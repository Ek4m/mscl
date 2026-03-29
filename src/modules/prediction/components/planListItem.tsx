import React, { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Chip from "../../../UI/components/chip";

import { COLORS } from "../../../constants/colors";
import { datePrettify } from "../../../helpers/datePrettify";

import { RootStackParamList } from "../../../navigation/types";
import { CustomPlanDetails } from "../../workout/types";

import { getWorkoutSessionsByUser } from "../../../db/services";

import { useAppSelector } from "../../../redux/root";
import { selectUserInfo } from "../../../redux/auth/slice";
import { PlanStatus } from "../enums";

const PlanListItem: FC<{ program: CustomPlanDetails }> = ({ program }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { userInfo } = useAppSelector(selectUserInfo);
  const sessions = getWorkoutSessionsByUser(userInfo?.id!, program.id);

  const isArchived = program.status === PlanStatus.ARCHIVED;
  const onPressHandler = () => {
    if (!isArchived) {
      navigation.navigate("planDetails", { id: program.id });
    } else {
      navigation.navigate("planDetails", {
        id: program.id,
        sessions: 1,
        status: PlanStatus.ARCHIVED,
      });
    }
  };
  return (
    <TouchableOpacity
      style={[styles.card, isArchived && styles.archivedCard]}
      onPress={onPressHandler}
    >
      {isArchived && (
        <View style={styles.archivedBadge}>
          <Icon name="check-decagram" color={COLORS.black} size={10} />
          <Text style={styles.archivedBadgeText}>DONE</Text>
        </View>
      )}

      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
          <Image
            style={styles.muscleImage}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/2376/2376399.png",
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, isArchived && { color: "#888" }]}>
            {program.title.toUpperCase()}
          </Text>
          <Text style={styles.subtitle}>{program.weeks.length} WEEK PLAN</Text>
        </View>
        <View style={styles.playBtn}>
          <Icon
            name={isArchived ? "history" : "chevron-right"}
            color={COLORS.mainBlue}
            size={24}
          />
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            <Text style={styles.unit}>LAST TRACKED</Text>
          </Text>
          <Text style={styles.unit}>
            {sessions.length ? datePrettify(sessions[0].finishedAt) : "-"}
          </Text>
        </View>
        <View style={styles.vLine} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>LEVEL</Text>
          <Chip
            label={program.template?.level.toUpperCase() || ""}
            type="info"
            size="medium"
          />
        </View>
      </View>

      <View style={styles.activityBar}>
        {sessions.length > 0 ? (
          sessions
            .slice(0, 8)
            .map((s) => <View key={s.id} style={styles.activityDotActive} />)
        ) : (
          <Text style={styles.noActivity}>NO RECENT DATA DETECTED</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
export default PlanListItem;
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#141414",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  archivedCard: {
    borderColor: COLORS.mainBlue,
    overflow: "hidden",
    backgroundColor: "#0f0f0f",
  },
  archivedBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: COLORS.mainBlue,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  archivedBadgeText: {
    color: COLORS.black,
    fontSize: 8,
    fontWeight: "900",
  },
  topRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.black,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  muscleImage: {
    width: 30,
    height: 30,
    tintColor: COLORS.mainBlue,
  },
  title: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "900",
    fontStyle: "italic",
  },
  subtitle: {
    color: "#555",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  playBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#0d0d0d",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  stat: { flex: 1, alignItems: "center" },
  vLine: { width: 1, height: "100%", backgroundColor: "#222" },
  statLabel: { color: "#444", fontSize: 9, fontWeight: "900", marginBottom: 4 },
  statValue: { color: COLORS.white, fontSize: 16, fontWeight: "900" },
  unit: { fontSize: 10, color: "#444" },
  activityBar: {
    flexDirection: "row",
    marginTop: 15,
    gap: 4,
    alignItems: "center",
  },
  activityDotActive: {
    width: 12,
    height: 4,
    backgroundColor: COLORS.mainBlue,
    borderRadius: 2,
  },
  noActivity: {
    color: "#333",
    fontSize: 9,
    fontWeight: "900",
    fontStyle: "italic",
  },
});
