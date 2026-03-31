import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";

import { CustomPlanDetails } from "../../workout/types";
import { datePrettify } from "../../../helpers/datePrettify";
import { COLORS } from "../../../constants/colors";

interface PlanHistoryProps {
  plan: CustomPlanDetails;
}

const UnifiedPlanLog: React.FC<PlanHistoryProps> = ({ plan }) => {
  const allSessions = useMemo(() => {
    return plan.weeks
      .flatMap((week) =>
        week.days.flatMap((day) =>
          (day.sessions || []).map((session) => ({
            ...session,
            dayTitle:
              day.orderIndex !== undefined
                ? `DAY ${day.orderIndex + 1}`
                : "WORKOUT",
            weekIndex: week.orderIndex + 1,
            detailedExercises: session.exercises.map((sEx) => {
              const originalEx = day.exercises.find(
                (e) =>
                  e.id === sEx.workoutExerciseId || e.variation.id === sEx.id,
              );
              return {
                ...sEx,
                definition: originalEx?.variation,
                protocol: {
                  sets: originalEx?.targetSets,
                  reps: originalEx?.targetReps,
                  value: originalEx?.targetValue,
                  metric: originalEx?.metric,
                },
              };
            }),
          })),
        ),
      )
      .sort(
        (a, b) =>
          new Date(b.finishedAt).getTime() - new Date(a.finishedAt).getTime(),
      );
  }, [plan]);
  if (allSessions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FeatherIcon name="database" size={40} color="#222" />
        <Text style={styles.emptyText}>
          NO DATA LOGGED FOR {plan.title.toUpperCase()}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>
        MISSION LOGS: {plan.title.toUpperCase()}
      </Text>

      {allSessions.map((session) => (
        <View key={session.id} style={styles.sessionCard}>
          <View style={styles.sessionHeader}>
            <View>
              <Text style={styles.sessionDate}>
                {datePrettify(session.finishedAt)}
              </Text>
              <Text style={styles.sessionSub}>
                WEEK {session.weekIndex} • {session.dayTitle} •{" "}
                {Math.floor(session.seconds / 60)}m
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>VERIFIED</Text>
            </View>
          </View>

          <View style={styles.exerciseList}>
            {session.detailedExercises.map((ex, idx) => (
              <View key={idx} style={styles.exerciseRow}>
                <View style={styles.dotLine}>
                  <View style={styles.dot} />
                  {idx !== session.detailedExercises.length - 1 && (
                    <View style={styles.line} />
                  )}
                </View>

                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>
                    {ex.definition?.title?.toUpperCase() || "UNKNOWN EXERCISE"}
                  </Text>

                  <View style={styles.comparisonGrid}>
                    {/* PROTOCOL (Target) */}
                    <View style={styles.comparisonColumn}>
                      <Text style={styles.columnLabel}>PROTOCOL</Text>
                      <View style={styles.protocolBox}>
                        <Text style={styles.protocolText}>
                          {ex.protocol.reps} REPS @ {ex.doneValue}
                          {ex.protocol.metric?.unitSymbol}
                        </Text>
                      </View>
                    </View>

                    <FeatherIcon
                      name="arrow-right"
                      size={12}
                      color="#333"
                      style={{ marginTop: 20 }}
                    />

                    {/* ACTUAL (Done) */}
                    <View style={styles.comparisonColumn}>
                      <Text style={styles.columnLabel}>ACTUAL</Text>
                      <View
                        style={[
                          styles.actualBox,
                          ex.doneValue >= (ex.protocol.value || 0) &&
                            styles.successBorder,
                        ]}
                      >
                        <View style={styles.statRow}>
                          <Text style={styles.actualValue}>{ex.reps}</Text>
                          <Text style={styles.actualLabel}>REPS</Text>
                        </View>
                        <View style={styles.vDivider} />
                        <View style={styles.statRow}>
                          <Text style={styles.actualValue}>{ex.doneValue}</Text>
                          <Text style={styles.actualLabel}>
                            {ex.protocol.metric?.unitSymbol}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {ex.extraWeight > 0 && (
                    <Text style={styles.extraWeightText}>
                      + {ex.extraWeight}KG EXTRA LOAD DETECTED
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080808", paddingHorizontal: 20 },
  headerTitle: {
    color: "#444",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginVertical: 20,
  },
  sessionCard: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 12,
  },
  sessionDate: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "900",
    fontStyle: "italic",
  },
  sessionSub: { color: "#666", fontSize: 10, fontWeight: "700", marginTop: 2 },
  statusBadge: {
    backgroundColor: COLORS.mainBlue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: { color: COLORS.black, fontSize: 8, fontWeight: "900" },

  exerciseList: { marginTop: 5 },
  exerciseRow: { flexDirection: "row", marginBottom: 20 },
  dotLine: { alignItems: "center", marginRight: 12, width: 10 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.mainBlue,
    marginTop: 6,
  },
  line: { width: 1, flex: 1, backgroundColor: "#222", marginTop: 4 },

  exerciseInfo: { flex: 1 },
  exerciseName: {
    color: "#eee",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 10,
  },

  comparisonGrid: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  comparisonColumn: { flex: 1 },
  columnLabel: {
    color: "#444",
    fontSize: 8,
    fontWeight: "900",
    marginBottom: 4,
    letterSpacing: 1,
  },

  protocolBox: {
    backgroundColor: "#0a0a0a",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#222",
  },
  protocolText: { color: "#666", fontSize: 11, fontWeight: "700" },

  actualBox: {
    backgroundColor: "#181818",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  successBorder: { borderColor: COLORS.mainBlue + "40" },
  statRow: { alignItems: "center" },
  actualValue: { color: COLORS.white, fontSize: 13, fontWeight: "900" },
  actualLabel: { color: "#555", fontSize: 7, fontWeight: "800" },
  vDivider: { width: 1, height: 15, backgroundColor: "#333" },

  extraWeightText: {
    color: COLORS.mainBlue,
    fontSize: 8,
    fontWeight: "900",
    marginTop: 8,
    fontStyle: "italic",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: { color: "#222", fontSize: 10, fontWeight: "900", marginTop: 15 },
});

export default UnifiedPlanLog;
