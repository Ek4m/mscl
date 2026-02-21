import React, { FC, useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../../constants/colors";
import { CustomPlanDetails } from "../../workout/types";
import { datePrettify } from "../../../helpers/datePrettify";
import {
  getWorkoutExercises,
  getWorkoutSessionsByUser,
} from "../../../db/services";
import { useAppSelector } from "../../../redux/root";
import { selectUserInfo } from "../../../redux/auth/slice";
import { WorkoutSessionExercise } from "../../../db/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/types";

interface Session {
  id: number;
  timestamp: string;
  workout_plan_id: number;
}

const PlanListItem: FC<{ program: CustomPlanDetails }> = ({ program }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { userInfo } = useAppSelector(selectUserInfo);
  const sessions = getWorkoutSessionsByUser(userInfo?.id!, program.id);
  const latestSessions = sessions
    .sort(
      (a, b) =>
        new Date(b.started_at).getTime() - new Date(a.started_at).getTime(),
    )
    .slice(0, 5);
  const exercises = useMemo(() => {
    const exercisesArray: WorkoutSessionExercise[] = [];
    sessions.forEach((s) => {
      exercisesArray.push(...getWorkoutExercises(s.id));
    });
    return exercisesArray;
  }, [sessions]);

  const lastExercise = useMemo(() => {
    return exercises.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )[0];
  }, [exercises]);
  console.log("-__", lastExercise);

  return (
    <TouchableOpacity style={styles.programCard}>
      <View style={styles.programHeader}>
        <View style={styles.programIconBox}>
          <Image
            style={styles.muscleImage}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/2376/2376399.png",
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.programTitle}>{program.title}</Text>
          <Text style={styles.subtitle}>
            {program.weeks.length} Weeks Program
          </Text>
        </View>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate("planDetails", { id: program.id })}
        >
          <Icon name="play" color={COLORS.white} size={20} />
        </TouchableOpacity>
      </View>

      {/* Session History: The "Something is there" visual */}
      <View style={styles.sessionSection}>
        <Text style={styles.sectionLabel}>Recent Activity</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sessionList}
        >
          {sessions.length === 0 ? (
            <Text style={styles.emptyText}>
              No sessions logged yet. Start today!
            </Text>
          ) : (
            latestSessions.map((s) => (
              <View key={s.id} style={styles.sessionChip}>
                <Icon name="check-circle" color={COLORS.lightBlue} size={14} />
                <Text style={styles.sessionDate}>
                  {datePrettify(s.finished_at)}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Footer: Stats */}
      <View style={styles.footer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{sessions?.length}</Text>
          <Text style={styles.statLabel}>Total Sessions</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {lastExercise ? datePrettify(lastExercise.created_at) : "N/A"}
          </Text>
          <Text style={styles.statLabel}>Last Active</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PlanListItem;

const styles = StyleSheet.create({
  programCard: {
    backgroundColor: "#1c1c1e",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2c2c2e",
  },
  programHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  programIconBox: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(0, 122, 255, 0.1)", // Light blue tint
    marginRight: 12,
  },
  programTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Oswald",
  },
  subtitle: {
    color: "#8e8e93",
    fontSize: 12,
  },
  startButton: {
    backgroundColor: COLORS.mainBlue,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  muscleImage: {
    width: 40,
    height: 40,
  },
  sessionSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sessionList: {
    flexDirection: "row",
  },
  sessionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2c2c2e",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    gap: 4,
  },
  sessionDate: {
    color: "#d1d1d6",
    fontSize: 11,
  },
  emptyText: {
    color: "#48484a",
    fontSize: 12,
    fontStyle: "italic",
  },
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#2c2c2e",
    paddingTop: 12,
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  statLabel: {
    color: "#8e8e93",
    fontSize: 10,
    textTransform: "uppercase",
  },
  divider: {
    width: 1,
    backgroundColor: "#2c2c2e",
  },
});
