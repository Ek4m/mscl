import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

import { ActiveExercise } from "../types";
import { COLORS } from "../../../constants/colors";

interface ExerciseCardProps {
  exercise: ActiveExercise;
  onToggleSet: (
    exerciseId: number,
    setIndex: number,
    variationId: number | null,
  ) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onToggleSet,
}) => {
  const [infoVisible, setInfoVisible] = useState(false);
  const title =
    exercise.variation && exercise.variation.title
      ? exercise.variation.title
      : exercise.exercise.title;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{title}</Text>
          <Text style={styles.stats}>
            {exercise.targetSets} Sets × {exercise.targetReps} Reps
          </Text>
        </View>
        {exercise.exercise.steps?.length && (
          <TouchableOpacity
            onPress={() => setInfoVisible(!infoVisible)}
            style={styles.infoButton}
          >
            <AntDesign name="info-circle" size={18} color="#71717a" />
          </TouchableOpacity>
        )}
      </View>

      {infoVisible && (
        <View style={styles.steps}>
          {exercise.exercise.steps?.map((step, index) => (
            <Text key={step} style={styles.step}>
              {index + 1}. {step.trim()}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.setGrid}>
        {exercise.completedSets.map((exSession, idx) => (
          <TouchableOpacity
            key={`${exercise.id}-set-${idx}`}
            onPress={() =>
              onToggleSet(exercise.exercise?.id, idx, exercise.variation?.id ?? null)
            }
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[
              styles.setButton,
              exSession ? styles.setButtonDone : styles.setButtonPending,
            ]}
          >
            {exSession ? (
              <AntDesign name="check" size={20} color="#ffffff" />
            ) : (
              <Text
                style={[
                  styles.setText,
                  exSession ? styles.setTextDone : styles.setTextPending,
                ]}
              >
                {idx + 1}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {exercise.exercise.description && (
        <View style={styles.footer}>
          <Text style={styles.noteText}>
            Note: {exercise.exercise.description}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(24, 24, 27, 0.5)",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  stats: {
    fontSize: 14,
    fontWeight: "500",
    color: "#a1a1aa",
  },
  infoButton: {
    padding: 4,
  },
  setGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 12,
  },
  setButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  setButtonPending: {
    backgroundColor: "#27272a",
    borderColor: "#3f3f46",
  },
  setButtonDone: {
    backgroundColor: COLORS.mainBlue,
    borderColor: COLORS.mainBlue,
    shadowColor: COLORS.mainBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  steps: {},
  step: {
    fontSize: 10,
    color: "#a1a1aa",
  },
  setText: {
    fontSize: 16,
    fontWeight: "700",
  },
  setTextPending: {
    color: "#a1a1aa",
  },
  setTextDone: {
    color: "#ffffff",
  },
  footer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(39, 39, 42, 0.5)",
  },
  noteText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#71717a",
  },
});

export default ExerciseCard;
