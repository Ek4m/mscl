import React, { useState, useEffect, useCallback, memo, Dispatch } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
  Image, // Added Image
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";

import { ActiveExercise } from "../types";
import ExerciseCard from "./MoveCard";
import { COLORS } from "../../../constants/colors";
import { formatTime } from "../helpers";
import RestTimer from "./RestTimer";
import {
  CustomDayPlan,
  CustomPlanDetails,
  CustomPlanWeeks,
} from "../../workout/types";
import {
  createWorkoutExercise,
  finishWorkoutSession,
  removeWorkoutExercise,
} from "../../../db/services";
import Modal from "../../../UI/components/modal";

const { width } = Dimensions.get("window");

interface ActiveWorkoutProps {
  workoutDay: CustomDayPlan;
  plan: CustomPlanDetails;
  exercises: ActiveExercise[];
  sessionId: number;
  week: CustomPlanWeeks;
  setExercises: Dispatch<React.SetStateAction<ActiveExercise[]>>;
  onFinish: () => void;
  onCancel: () => void;
}

const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({
  plan,
  sessionId,
  onFinish,
  exercises,
  week,
  workoutDay,
  setExercises,
  onCancel,
}) => {
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentExercise = exercises[currentExIdx];
  // Calculate progress based on exercises completed
  const progress = ((currentExIdx + 1) / exercises.length) * 100;

  useEffect(() => {
    const interval = setInterval(() => setWorkoutSeconds((p) => p + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSet = useCallback(
    (
      exerciseId: number,
      index: number,
      variationId: number | null,
      reps?: number,
    ) => {
      setExercises((prev) => {
        const newExercises = [...prev];
        const ex = newExercises[currentExIdx];

        if (ex && ex.exercise?.id === exerciseId) {
          const newSets = [...ex.completedSets];
          const existingSet = newSets[index];

          if (!existingSet) {
            const created = createWorkoutExercise(
              sessionId,
              ex.id,
              exerciseId,
              index,
              ex.variation?.id ?? null,
              reps,
            );
            if (created) {
              newSets[index] = { ...created, reps: reps || 0 };
              setRestSeconds(60);
              setIsResting(true);
            }
          } else {
            removeWorkoutExercise(existingSet.id);
            newSets[index] = null;
          }
          newExercises[currentExIdx] = { ...ex, completedSets: newSets };
        }
        return newExercises;
      });
    },
    [currentExIdx, sessionId, setExercises],
  );

  const nextStep = () => {
    if (currentExIdx < exercises.length - 1) {
      setCurrentExIdx((p) => p + 1);
    } else {
      handleFinish();
    }
  };

  const prevStep = () => {
    if (currentExIdx > 0) setCurrentExIdx((p) => p - 1);
  };

  const handleFinish = async () => {
    const isLastWeek =
      plan.weeks.findIndex((w) => w.id === week.id) === plan.weeks.length - 1;
    const isLastDay =
      week.days.findIndex((d) => d.id === workoutDay.id) ===
      week.days.length - 1;

    Alert.alert("Finish Workout", "Ready to log your session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Save",
        onPress: () => {
          finishWorkoutSession(sessionId, workoutSeconds);
          if (isLastWeek && isLastDay) setShowSuccess(true);
          else onFinish();
        },
      },
    ]);
  };

  return (
    <View style={styles.safeArea}>
      {/* Visual Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarActive, { width: `${progress}%` }]} />
      </View>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <IonIcons name="close" size={24} color="#71717a" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.stepText}>
            EXERCISE {currentExIdx + 1} OF {exercises.length}
          </Text>
          <Text style={styles.timerText}>{formatTime(workoutSeconds)}</Text>
        </View>

        <View style={{ width: 24 }} />
      </View>

      <View style={styles.focusContainer}>
        {currentExercise ? (
          <View style={styles.activeExerciseWrapper}>
            {/* Exercise Image Section */}
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: "https://training.fit/wp-content/uploads/2020/02/bizepscurls-stehend-langhantel.png",
                }}
                style={styles.exerciseImage}
                resizeMode="cover"
              />
              <View style={styles.logoRemover} />
            </View>

            <Text style={styles.exerciseTitle}>
              {currentExercise.variation?.title ||
                currentExercise.exercise?.title}
            </Text>

            <View style={styles.cardWrapper}>
              <ExerciseCard
                exercise={currentExercise}
                onToggleSet={handleToggleSet}
              />
            </View>
          </View>
        ) : (
          <Text style={styles.errorText}>No exercise found.</Text>
        )}
      </View>

      <View style={styles.footer}>
        {isResting && (
          <RestTimer
            restSeconds={restSeconds}
            isVisible={isResting}
            setRestSeconds={setRestSeconds}
            setIsResting={setIsResting}
          />
        )}

        <View style={styles.navButtons}>
          <TouchableOpacity
            style={[styles.navBtn, currentExIdx === 0 && { opacity: 0.3 }]}
            onPress={prevStep}
            disabled={currentExIdx === 0}
          >
            <IonIcons name="chevron-back" size={20} color="white" />
            <Text style={styles.navBtnText}>Back</Text>
          </TouchableOpacity>

          {currentExIdx === exercises.length - 1 ? (
            <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
              <Text style={styles.finishBtnText}>FINISH WORKOUT</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.navBtnPrimary} onPress={nextStep}>
              <Text style={styles.navBtnTextPrimary}>Next</Text>
              <IonIcons name="chevron-forward" size={20} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Reusing your Success Modal Logic */}
      <Modal isVisible={showSuccess} onRequestClose={onFinish}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <IonIcons name="trophy" size={60} color={COLORS.mainBlue} />
            <Text style={styles.modalTitle}>Workout Complete!</Text>
            <TouchableOpacity style={styles.continueButton} onPress={onFinish}>
              <Text style={styles.continueText}>Awesome!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000000" },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#18181b",
    width: "100%",
    marginTop: 60,
  },
  progressBarActive: {
    height: "100%",
    backgroundColor: COLORS.mainBlue,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerCenter: { alignItems: "center" },
  stepText: {
    color: "#71717a",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  timerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  focusContainer: {
    flex: 1,
  },
  activeExerciseWrapper: {
    flex: 1,
    alignItems: "center",
  },
  imageContainer: {
    width: width,
    height: width * 0.55,
    backgroundColor: "#09090b",
    marginBottom: 20,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: "#18181b",
  },
  exerciseImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#eee",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#09090b",
  },
  logoRemover: {
    width: 70,
    height: 30,
    bottom: 0,
    left: 0,
    position: "absolute",
    backgroundColor: "#eee",
  },
  exerciseTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  cardWrapper: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#18181b",
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 4,
  },
  navBtnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.mainBlue,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    gap: 4,
  },
  navBtnText: { color: "#71717a", fontWeight: "600", fontSize: 16 },
  navBtnTextPrimary: { color: "#000", fontWeight: "700", fontSize: 16 },
  finishBtn: {
    backgroundColor: COLORS.mainBlue,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 100,
  },
  finishBtnText: { color: "#000", fontWeight: "900", fontSize: 14 },
  closeButton: { padding: 5 },
  errorText: { color: "white", textAlign: "center", marginTop: 50 },
  // Modal styles from previous context
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#18181b",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    marginVertical: 16,
    textAlign: "center",
  },
  continueButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 100,
    marginTop: 10,
  },
  continueText: {
    color: "#000000",
    fontWeight: "900",
    fontSize: 16,
  },
});

export default memo(ActiveWorkout);
