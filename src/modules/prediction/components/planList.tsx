import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";

import { COLORS } from "../../../constants/colors";
import { WorkoutPlan } from "../types";

const PlanList: FC<{ plan: WorkoutPlan }> = ({ plan }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {plan.days.map((day) => (
        <View style={styles.card} key={day.id}>
          <Text style={styles.dayLabel}>{day.title}</Text>
          <View style={styles.exerciseList}>
            {day.exercises.map((ex, idx) => (
              <View key={idx} style={styles.exerciseRow}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>{idx + 1}</Text>
                </View>
                <View>
                  <Text style={styles.exerciseName}>{ex.title}</Text>
                  <Text style={styles.exerciseDetails}>
                    {ex.targetSets} sets × {ex.targetReps}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default PlanList;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  dayLabel: {
    color: COLORS.lightBlue,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  exerciseList: {
    gap: 20,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#27272a",
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    color: "#71717a",
    fontWeight: "bold",
    fontSize: 14,
  },
  exerciseName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  exerciseDetails: {
    color: "#71717a",
    fontSize: 12,
    marginTop: 2,
  },
  // Locked Section Styles
  lockedCard: {
    height: 160,
    backgroundColor: "#18181b",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  blurredContent: {
    padding: 24,
    opacity: 0.2, // Simulates the "fade" part of blur
  },
  dayLabelLocked: {
    color: COLORS.lightBlue,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 20,
  },
  skeletonBar: {
    height: 12,
    width: 120,
    backgroundColor: "#27272a",
    borderRadius: 4,
  },
  lockOverlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  lockText: {
    color: "#71717a",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
