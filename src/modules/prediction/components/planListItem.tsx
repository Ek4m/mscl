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

const PlanListItem: FC<{ program: CustomPlanDetails }> = ({ program }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { userInfo } = useAppSelector(selectUserInfo);
  const sessions = getWorkoutSessionsByUser(userInfo?.id!, program.id);
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => navigation.navigate("planDetails", { id: program.id })}
    >
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
          <Text style={styles.title}>{program.title.toUpperCase()}</Text>
          <Text style={styles.subtitle}>{program.weeks.length} WEEK PLAN</Text>
        </View>
        <View style={styles.playBtn}>
          <Icon name="chevron-right" color={COLORS.mainBlue} size={24} />
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            <Text style={styles.unit}>LAST TRACKED</Text>
          </Text>
          <Text style={styles.unit}>
            {datePrettify(sessions[0].finished_at)}
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

      {/* Mini Progress Dots or Activity Tracker */}
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
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  topRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#000",
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
    opacity: 0.8,
    tintColor: COLORS.mainBlue,
  },
  title: {
    color: COLORS.white,
    fontSize: 18,
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
    padding: 15,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  stat: { flex: 1, alignItems: "center" },
  vLine: { width: 1, height: "100%", backgroundColor: "#222" },
  statLabel: { color: "#444", fontSize: 9, fontWeight: "900", marginBottom: 4 },
  statValue: { color: "#fff", fontSize: 16, fontWeight: "900" },
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
