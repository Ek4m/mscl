import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  Dispatch,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
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
} from "../../workout/types";
import {
  createWorkoutExercise,
  finishWorkoutSession,
  removeWorkoutExercise,
} from "../../../db/services";

interface ActiveWorkoutProps {
  workoutDay: CustomDayPlan;
  plan: CustomPlanDetails;
  exercises: ActiveExercise[];
  sessionId: number;
  setExercises: Dispatch<React.SetStateAction<ActiveExercise[]>>;
  onFinish: () => void;
  onCancel: () => void;
}

const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({
  plan,
  sessionId,
  onFinish,
  exercises,
  setExercises,
  onCancel,
}) => {
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const restTimerRef = useRef<any>(null);

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
    const saveSession = async () => {
      finishWorkoutSession(sessionId, workoutSeconds);
      onFinish();
    };
    Alert.alert("Finish Workout", "Ready to log your session?", [
      { text: "Cancel", style: "cancel" },
      { text: "Save", onPress: saveSession },
    ]);
  };

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
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 1.5,
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
});

export default memo(ActiveWorkout);
