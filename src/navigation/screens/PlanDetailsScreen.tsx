import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StatusBar,
  Platform,
  RefreshControl,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import FeatherIcon from "react-native-vector-icons/Feather";
import FAIcon from "react-native-vector-icons/FontAwesome5";
import OctiIcon from "react-native-vector-icons/Octicons";

import { useGetUserCustomPlanByIdQuery } from "../../redux/plans/slice";
import { useAppSelector } from "../../redux/root";
import { selectUserInfo } from "../../redux/auth/slice";
import { COLORS } from "../../constants/colors";
import { RootStackParamList } from "../types";
import { getWorkoutSessionsByUser } from "../../db/services";
import SubmitButton from "../../UI/components/submitButton";
import PlanDetailsExerciseList from "../../modules/prediction/components/planDetailsExerciseList";

const { width } = Dimensions.get("window");

const PlanDetailsScreen: FC<
  NativeStackScreenProps<RootStackParamList, "planDetails">
> = ({ route, navigation }) => {
  const id = route.params?.id || 1;
  const { data: plan, isFetching, refetch } = useGetUserCustomPlanByIdQuery(id);
  const { userInfo } = useAppSelector(selectUserInfo);

  const [activeWeekIdx, setActiveWeekIdx] = useState(0);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [userProgress, setUserProgress] = useState({ week: 0, day: 0 });

  const currentWeek = plan?.weeks[activeWeekIdx];
  const currentDay = currentWeek?.days[activeDayIdx];

  const sessions = useMemo(
    () => getWorkoutSessionsByUser(userInfo?.id!, id),
    [id, userInfo],
  );

  const calculateProgress = useCallback(() => {
    if (!plan?.weeks || !sessions || !sessions.length)
      return { week: 0, day: 0 };
    const latestSession = sessions[0];
    let foundWeek = 0,
      foundDay = 0;

    plan.weeks.forEach((week, wIdx) => {
      const dIdx = week.days.findIndex(
        (d) => d.id === latestSession.plan_day_id,
      );
      if (dIdx !== -1) {
        foundWeek = wIdx;
        foundDay = dIdx;
      }
    });

    if (foundDay === plan.weeks[foundWeek].days.length - 1) {
      return foundWeek < plan.weeks.length - 1
        ? { week: foundWeek + 1, day: 0 }
        : { week: foundWeek, day: foundDay };
    }
    return { week: foundWeek, day: foundDay + 1 };
  }, [sessions, plan]);

  useEffect(() => {
    const nextProgress = calculateProgress();
    setUserProgress(nextProgress);
    setActiveWeekIdx(nextProgress.week);
    setActiveDayIdx(nextProgress.day);
  }, [calculateProgress]);

  const onStartSession = () => {
    if (currentDay && plan) {
      navigation.navigate("workoutTracker", {
        id: currentDay.id,
        plan,
        weekId: activeWeekIdx,
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={{
          uri:
            plan?.template?.thumbnail ||
            "https://img.freepik.com/premium-photo/dumbbells-kettlebell-gym-floor_1205263-196404.jpg",
        }}
        style={styles.hero}
      >
        <View style={styles.heroOverlay}>
          <View style={styles.safeHeader}>
            <View style={styles.navRow}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backCircle}
              >
                <FeatherIcon name="arrow-left" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.heroContent}>
              <View style={styles.heroBadge}>
                <OctiIcon name="flame" size={12} color={COLORS.mainBlue} />
                <Text style={styles.heroBadgeText}>ELITE PROGRAM</Text>
              </View>
              <Text style={styles.heroTitle}>{plan?.title}</Text>
              <Text style={styles.heroSub}>
                Week {activeWeekIdx + 1} • {currentWeek?.days.length} Days
                Active
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* Week Selector */}
      <View style={styles.weekContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekScroll}
        >
          {plan?.weeks.map((_, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                setActiveWeekIdx(idx);
                setActiveDayIdx(0);
              }}
              style={[
                styles.weekTab,
                activeWeekIdx === idx && styles.activeWeekTab,
              ]}
            >
              <Text
                style={[
                  styles.weekTabText,
                  activeWeekIdx === idx && styles.activeWeekTabText,
                ]}
              >
                WEEK {idx + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Day Selector */}
      <View style={styles.dayContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayScroll}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              tintColor={COLORS.mainBlue}
            />
          }
        >
          {currentWeek?.days.map((day, idx) => {
            const isDone =
              activeWeekIdx < userProgress.week ||
              (activeWeekIdx === userProgress.week && idx < userProgress.day);
            const isActive = activeDayIdx === idx;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setActiveDayIdx(idx)}
                style={[
                  styles.dayChip,
                  isActive && styles.activeDayChip,
                  isDone && !isActive && styles.doneDayChip,
                ]}
              >
                {isDone ? (
                  <FAIcon
                    name="check"
                    size={10}
                    color={isActive ? "black" : COLORS.mainBlue}
                  />
                ) : (
                  <Text
                    style={[
                      styles.dayChipText,
                      isActive && styles.activeDayChipText,
                    ]}
                  >
                    DAY {idx + 1}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      {/* Exercise List */}
      {currentDay && <PlanDetailsExerciseList day={currentDay} />}
      {activeWeekIdx === userProgress.week &&
        activeDayIdx === userProgress.day && (
          <View style={styles.footer}>
            <SubmitButton
              icon={<FeatherIcon name="play" size={18} color="black" />}
              bgColor={COLORS.mainBlue}
              onPress={onStartSession}
              title="START SESSION"
            />
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  hero: { height: 380, width: width },
  heroOverlay: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)", // Uniform dark overlay for text contrast
    justifyContent: "flex-end",
  },
  safeHeader: { flex: 1, justifyContent: "space-between" },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 0 : 20,
  },
  backCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  heroContent: { marginBottom: 10 },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: COLORS.mainBlue,
    fontWeight: "900",
    fontSize: 11,
    letterSpacing: 2,
  },
  heroTitle: {
    color: "white",
    fontSize: 38,
    fontWeight: "900",
    fontStyle: "italic",
    textTransform: "uppercase",
    lineHeight: 40,
  },
  heroSub: { color: "#ccc", fontSize: 14, fontWeight: "600", marginTop: 8 },

  weekContainer: {
    backgroundColor: "#050505",
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  weekScroll: { paddingHorizontal: 20 },
  weekTab: {
    paddingVertical: 16,
    marginRight: 25,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeWeekTab: { borderBottomColor: COLORS.mainBlue },
  weekTabText: { color: "#444", fontWeight: "900", fontSize: 13 },
  activeWeekTabText: { color: "white" },

  dayContainer: { backgroundColor: "#000" },
  dayScroll: { paddingHorizontal: 20, paddingVertical: 10 },
  dayChip: {
    height: 45,
    minWidth: 80,
    paddingHorizontal: 20,
    backgroundColor: "#111",
    borderRadius: 12,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  activeDayChip: { backgroundColor: "#fff", borderColor: "#fff" },
  doneDayChip: { borderColor: COLORS.mainBlue },
  dayChipText: { color: "#666", fontWeight: "900", fontSize: 12 },
  activeDayChipText: { color: "black" },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.92)",
  },
});

export default PlanDetailsScreen;
