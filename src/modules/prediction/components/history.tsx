import React, { FC, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";

import { datePrettify } from "../../../helpers/datePrettify";
import { formatSecondsToTime } from "../../../helpers/secondsToTime";

import { useAppSelector } from "../../../redux/root";
import { selectUserInfo } from "../../../redux/auth/slice";

import { COLORS } from "../../../constants/colors";
import { CustomPlanDetails } from "../../workout/types";
import { getWorkoutSessionsByUser } from "../../../db/services";
import { WorkoutSession } from "../../../db/types";

const PlanUsageHistory: FC<{ plan: CustomPlanDetails }> = ({ plan }) => {
  const { userInfo } = useAppSelector(selectUserInfo);
  const [history, setHistory] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    if (userInfo) setHistory(getWorkoutSessionsByUser(userInfo.id, plan.id));
  }, [userInfo]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout History</Text>
        <Text style={styles.subtitle}>Your completed sessions</Text>
      </View>
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
      >
        {history.map((item, idx) => {
          const workoutDayIndex = plan.days.findIndex(
            (elem) => elem.id === item.plan_day_id,
          );
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.indexBox}>
                <Text style={styles.indexText}>{idx + 1}</Text>
              </View>

              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Day {workoutDayIndex + 1}</Text>
                <Text style={styles.cardDetails}>
                  ⏱ {formatSecondsToTime(item.seconds)}
                </Text>
                <Text style={styles.cardDetails}>
                  {datePrettify(item.finished_at)}
                </Text>
              </View>
            </View>
          );
        })}
        {!history.length && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🏋️</Text>
            <Text style={styles.emptyTitle}>No workouts yet</Text>
            <Text style={styles.emptySubtitle}>
              Start a plan and your history will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PlanUsageHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "95%",
    maxHeight: Dimensions.get("screen").height / 2,
    backgroundColor: "#292828",
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.mainBlue,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  list: {
    flex: 1,
  },
  listContent: {},
  card: {
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  indexBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  indexText: {
    color: "#444",
    fontSize: 18,
    fontWeight: "900",
  },
  cardInfo: {
    marginHorizontal: 16,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  cardDetails: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 120,
    opacity: 0.6,
  },
  emptyEmoji: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
    maxWidth: 260,
  },
});
