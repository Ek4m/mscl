import React, { useState, useEffect, useRef, useCallback } from "react";
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
import AntDesignIcons from "react-native-vector-icons/AntDesign";

import { WorkoutDay, WorkoutHistoryEntry, ActiveExercise } from "../types";
import ExerciseCard from "./MoveCard";
import { dbService } from "../dbServices";
import SubmitButton from "../../../UI/components/submitButton";
import { COLORS } from "../../../constants/colors";

interface ActiveWorkoutProps {
  workoutDay: WorkoutDay;
  planTitle: string;
  onFinish: () => void;
  onCancel: () => void;
}

const ActiveWorkout: React.FC<ActiveWorkoutProps> = ({
  workoutDay,
  planTitle,
  onFinish,
  onCancel,
}) => {
  const [exercises, setExercises] = useState<ActiveExercise[]>(
    workoutDay.moves.map((ex, idx) => ({
      ...ex,
      id: idx,
      completedSets: new Array(ex.sets).fill(false),
    })),
  );

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
    (exerciseId: number, setIndex: number) => {
      setExercises((prev) =>
        prev.map((ex) => {
          if (ex.id === exerciseId) {
            const newSets = [...ex.completedSets];
            const wasDone = newSets[setIndex];
            newSets[setIndex] = !wasDone;
            if (!wasDone) {
              setRestSeconds(60);
              setIsResting(true);
            }
            return { ...ex, completedSets: newSets };
          }
          return ex;
        }),
      );
    },
    [],
  );

  const handleFinish = async () => {
    const saveSession = async () => {
      const historyEntry: WorkoutHistoryEntry = {
        plan_title: planTitle,
        date: new Date().toISOString(),
        total_duration_seconds: workoutSeconds,
      };
      console.log(historyEntry);
      const success = await dbService.saveWorkoutHistory(historyEntry);
      if (success) onFinish();
    };

    if (Platform.OS === "web") {
      //   if (window.confirm("Ready to finish your session?")) saveSession();
    } else {
      Alert.alert("Finish Workout", "Ready to log your session?", [
        { text: "Cancel", style: "cancel" },
        { text: "Log Session", onPress: saveSession },
      ]);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
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
            <IonIcons name="chevron-back" size={16} color="#71717a" />
            <Text style={styles.backText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{workoutDay.title}</Text>
          <Text style={styles.subtitle}>{planTitle}</Text>
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
          <View style={styles.restCard}>
            <View style={styles.restInfo}>
              <View style={styles.restIcon}>
                <IonIcons name="timer-outline" size={24} color="#ffffff" />
              </View>
              <View>
                <Text style={styles.restLabel}>Rest Timer</Text>
                <Text style={styles.restTime}>{formatTime(restSeconds)}</Text>
              </View>
            </View>
            <View style={styles.restActions}>
              <TouchableOpacity
                style={styles.restAdd}
                onPress={() => setRestSeconds((s) => s + 30)}
              >
                <Text style={styles.restAddText}>+30s</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.restSkip}
                onPress={() => setIsResting(false)}
              >
                <AntDesignIcons
                  name="fast-forward"
                  size={14}
                  color={COLORS.mainBlue}
                />
                <Text style={styles.restSkipText}>Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  restCard: {
    backgroundColor: COLORS.mainBlue,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: COLORS.mainBlue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  restInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  restIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 8,
    borderRadius: 12,
  },
  restLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  restTime: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
  },
  restActions: {
    flexDirection: "row",
    gap: 8,
  },
  restAdd: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  restAddText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  restSkip: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  restSkipText: {
    color: COLORS.mainBlue,
    fontSize: 12,
    fontWeight: "700",
  },
  actionRow: {
    backgroundColor: "#18181b",
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  finishButton: {
    backgroundColor: "#ffffff",
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

export default ActiveWorkout;
