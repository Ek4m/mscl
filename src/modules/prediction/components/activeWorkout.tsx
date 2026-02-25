import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  Dispatch,
  useMemo,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";

import { ActiveExercise } from "../types";
import ExerciseCard from "./MoveCard";
import SubmitButton from "../../../UI/components/submitButton";
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
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const restTimerRef = useRef<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWorkoutSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isResting && restSeconds > 0) {
      restTimerRef.current = setInterval(() => {
        setRestSeconds((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
      setIsResting(false);
    }
    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [isResting, restSeconds]);

  const handleToggleSet = useCallback(
    (
      exerciseId: number,
      index: number,
      variationId: number | null,
      reps?: number,
    ) => {
      setExercises((prev) =>
        prev.map((ex) => {
          if (
            ex.exercise?.id === exerciseId &&
            (ex.variation?.id === variationId ||
              (!ex.variation && !variationId))
          ) {
            const newSets = [...ex.completedSets];
            const doneExercise = newSets[index];

            if (!doneExercise) {
              // Logic to create set with REPS
              const created = createWorkoutExercise(
                sessionId,
                ex.id,
                exerciseId,
                index,
                ex.variation?.id ?? null,
                reps, // Make sure your DB service accepts reps here
              );
              if (created) {
                newSets[index] = { ...created, reps: reps || 0 };
              }
              setRestSeconds(60);
              setIsResting(true);
            } else {
              removeWorkoutExercise(doneExercise.id);
              newSets[index] = null;
            }
            return { ...ex, completedSets: newSets };
          }
          return ex;
        }),
      );
    },
    [sessionId, setExercises],
  );
  const handleFinish = async () => {
    const isLastWeek =
      plan.weeks.findIndex((w) => w.id === week.id) === plan.weeks.length - 1;
    const isLastDay =
      week.days.findIndex((d) => d.id === workoutDay.id) ===
      week.days.length - 1;

    const saveSession = () => {
      finishWorkoutSession(sessionId, workoutSeconds);
      if (isLastWeek && isLastDay) {
        setShowSuccess(true);
      }
    };

    Alert.alert("Finish Workout", "Ready to log your session?", [
      { text: "Cancel", style: "cancel" },
      { text: "Save", onPress: saveSession },
    ]);
  };

  const stats = useMemo(() => {
    let totalTargetSets = 0;
    let totalCompletedSets = 0;
    let totalTargetReps = 0;
    let totalCompletedReps = 0;

    exercises.forEach((ex) => {
      totalTargetSets += ex.completedSets.length;
      totalTargetReps += ex.completedSets.length * (ex.targetReps || 0);

      ex.completedSets.forEach((set) => {
        if (set) {
          totalCompletedSets += 1;
          totalCompletedReps += set.reps || 0;
        }
      });
    });

    return {
      setsPct: 0.5,
      repsPct: 0.7,
      totalCompletedReps: 140,
      totalTargetReps: 155,
    };
  }, [exercises]);

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <TouchableOpacity
            onPress={onCancel}
            style={styles.backButton}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <IonIcons name="chevron-back" size={20} color="#71717a" />
            <Text style={styles.backText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{plan.title}</Text>
          <Text style={styles.subtitle}>{plan.title}</Text>
        </View>
        <View style={styles.timerContainer}>
          <View style={styles.timerRow}>
            <IonIcons name="timer-outline" size={18} color={COLORS.mainBlue} />
            <Text style={styles.timerText}>{formatTime(workoutSeconds)}</Text>
          </View>
          <Text style={styles.timerLabel}>Total Time</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onToggleSet={handleToggleSet}
          />
        ))}
      </ScrollView>
      <Modal
        onRequestClose={() => setShowSuccess(false)}
        isVisible={showSuccess}
        overlayClickable={false}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <IonIcons name="trophy" size={80} color={COLORS.mainBlue} />
            <Text style={styles.modalTitle}>Plan Completed!</Text>
            <Text style={styles.modalBody}>
              Congratulations! You've finished the "{plan.title}" program.
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Final Time</Text>
                <Text style={styles.statValue}>
                  {formatTime(workoutSeconds)}
                </Text>
              </View>
            </View>
            <View style={styles.statsContainer}>
              <Text style={styles.statsHeader}>Workout Performance</Text>

              {/* Sets Statistic */}
              <View style={styles.statRow}>
                <View style={styles.statInfo}>
                  <Text style={styles.statsLabel}>Sets Completed</Text>
                  <Text style={styles.statsValue}>
                    {Math.round(stats.setsPct * 100)}%
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${stats.setsPct * 100}%` },
                    ]}
                  />
                </View>
              </View>

              {/* Reps Statistic */}
              <View style={styles.statRow}>
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>Total Reps Vol.</Text>
                  <Text style={styles.statValue}>
                    {stats.totalCompletedReps} / {stats.totalTargetReps}
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.min(stats.repsPct * 100, 100)}%`,
                        backgroundColor: COLORS.mainBlue,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.continueButton} onPress={onFinish}>
              <Text style={styles.continueText}>Awesome!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.footerContainer}>
        {isResting && (
          <RestTimer
            restSeconds={restSeconds}
            isVisible={isResting}
            setRestSeconds={setRestSeconds}
            setIsResting={setIsResting}
          />
        )}

        <View style={styles.actionRow}>
          <SubmitButton
            bgColor={COLORS.mainBlue}
            onPress={handleFinish}
            icon={<IonIcons name="square" size={16} color="black" />}
            title="Finish Workout"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#18181b",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: "#09090b",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  backText: {
    color: "#71717a",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
    width: Dimensions.get("window").width * 0.6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 8,
    fontWeight: "700",
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    width: Dimensions.get("window").width * 0.6,
    marginTop: 4,
  },
  timerContainer: {
    alignItems: "flex-end",
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerText: {
    color: COLORS.mainBlue,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 6,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  timerLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#3f3f46",
    textTransform: "uppercase",
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 180,
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "transparent",
  },
  actionRow: {
    backgroundColor: "#18181b",
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  finishButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  finishText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#18181b",
    borderRadius: 32,
    padding: 32,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 16,
    textAlign: "center",
  },
  modalBody: {
    color: "#a1a1aa",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  statsRow: {
    marginVertical: 24,
    padding: 16,
    backgroundColor: "#09090b",
    borderRadius: 16,
    width: "100%",
  },
  statBox: {
    alignItems: "center",
  },
  statLabel: {
    color: "#71717a",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statValue: {
    color: COLORS.mainBlue,
    fontSize: 24,
    fontWeight: "800",
  },
  continueButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 100,
  },
  continueText: {
    color: "#000000",
    fontWeight: "900",
    fontSize: 16,
  },
  statsContainer: {
    width: "100%",
    marginVertical: 20,
    gap: 20,
  },
  statsHeader: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  statRow: {
    width: "100%",
  },
  statInfo: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statsLabel: {
    color: "#71717a",
    fontSize: 13,
  },
  statsValue: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "bold",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#27272a",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#ffffff", // Sets color
    borderRadius: 4,
  },
});

export default memo(ActiveWorkout);
