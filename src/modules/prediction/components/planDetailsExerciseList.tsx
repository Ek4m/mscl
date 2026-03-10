import React, { FC, memo } from "react";
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";

import { COLORS } from "../../../constants/colors";
import { CustomDayPlan } from "../../workout/types";
import { getDoneSessionByDay, getWorkoutExercises } from "../../../db/services";
import { datePrettify } from "../../../helpers/datePrettify";
import Chip from "../../../UI/components/chip";
import { getImageUrl } from "../helpers";

const PlanDetailsExerciseList: FC<{ day: CustomDayPlan }> = ({ day }) => {
  const doneSession = getDoneSessionByDay(day.id);
  const exercises = doneSession ? getWorkoutExercises(doneSession.id) : [];

  return (
    <ScrollView
      style={styles.exerciseList}
      contentContainerStyle={styles.listContent}
    >
      <View style={styles.dayHeader}>
        <Text style={[styles.dayMeta, doneSession ? styles.paramDone : null]}>
          {day?.exercises.length || 0} TOTAL EXERCISES{" "}
          {doneSession
            ? `- DONE (${datePrettify(doneSession?.finished_at, { showTime: true })})`
            : ""}
        </Text>
      </View>

      {day?.exercises.map((ex, idx) => {
        const doneExercises = exercises.filter(
          (e) => e.exercise_id === ex.variation?.id,
        );
        const exerciseDone = Boolean(doneExercises.length);
        const doneReps = exerciseDone
          ? doneExercises.map((ex) => ex.reps).join(", ")
          : 0;

        return (
          <View key={idx} style={styles.exCard}>
            <View style={styles.exImageWrapper}>
              <Image
                source={{
                  uri: getImageUrl(ex.variation?.thumbnail),
                }}
                style={styles.exImage}
              />
            </View>
            <View style={styles.exDetails}>
              <View style={styles.titleContainer}>
                <Text
                  style={[
                    styles.exName,
                    exerciseDone ? styles.paramDone : null,
                  ]}
                >
                  {ex.variation?.title}
                </Text>
              </View>
              <View style={styles.targetRow}>
                <View style={styles.paramBox}>
                  <Text
                    style={[
                      styles.paramValue,
                      doneSession ? styles.paramDone : null,
                    ]}
                  >
                    {doneSession ? doneExercises.length + "/" : ""}
                    {ex.targetSets}
                  </Text>
                  <Text style={styles.paramLabel}>SETS</Text>
                </View>
                <View style={styles.paramDivider} />
                <View style={styles.paramBox}>
                  <Text
                    style={[
                      styles.paramValue,
                      doneSession ? styles.paramDone : null,
                    ]}
                  >
                    {doneSession
                      ? doneReps
                      : ex.targetReps === 1
                        ? ex.targetValue
                        : ex?.targetReps}
                  </Text>
                  <Text style={styles.paramLabel}>
                    {ex.targetReps === 1
                      ? ex.metric.unitSymbol.toUpperCase()
                      : "REPS"}
                  </Text>
                </View>
              </View>
              {exerciseDone && (
                <Chip label="Done" align="left" size="medium" type="info" />
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default memo(PlanDetailsExerciseList);

const styles = StyleSheet.create({
  exerciseList: { flex: 1, backgroundColor: "#000" },
  listContent: { padding: 20, paddingBottom: 120 },
  dayHeader: { marginBottom: 10 },
  dayTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "900",
    fontStyle: "italic",
  },
  dayMeta: {
    color: "#5a5a5a",
    fontSize: 11,
    fontWeight: "900",
    fontStyle: "italic",
    marginTop: 4,
    letterSpacing: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  exCard: {
    backgroundColor: "#0a0a0a",
    borderRadius: 20,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  exerciseDone: {
    borderColor: COLORS.lightBlue,
  },
  exImageWrapper: {
    width: 110,
    height: 55,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  exImage: { width: "100%", height: "100%", objectFit: "contain" },
  exDetails: { flex: 1, marginLeft: 10 },
  exName: {
    color: "white",
    fontSize: 17,
    fontWeight: "500",
    fontStyle: "italic",
  },
  targetRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  paramBox: { alignItems: "center", flexDirection: "row" },
  paramValue: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
    fontStyle: "italic",
    marginRight: 4,
  },
  paramDone: {
    color: COLORS.mainBlue,
  },
  paramLabel: { color: "#555", fontSize: 10, fontWeight: "bold", marginTop: 2 },
  paramDivider: {
    width: 1,
    height: 25,
    backgroundColor: "#222",
    marginHorizontal: 20,
  },
});
