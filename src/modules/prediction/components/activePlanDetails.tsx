import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import FAIcon from "react-native-vector-icons/FontAwesome5";
import FeatherIcon from "react-native-vector-icons/Feather";

import { COLORS } from "../../../constants/colors";
import { getWorkoutSessionsByUser } from "../../../db/services";
import { useAppSelector } from "../../../redux/root";
import { selectUserInfo } from "../../../redux/auth/slice";
import { CustomPlanDetails } from "../../workout/types";
import { RootStackParamList } from "../../../navigation/types";
import SubmitButton from "../../../UI/components/submitButton";
import PlanDetailsExerciseList from "./planDetailsExerciseList";

const ActivePlanDetails: FC<{ plan: CustomPlanDetails }> = ({ plan }) => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "planDetails">>();
  const [activeWeekIdx, setActiveWeekIdx] = useState(0);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [userProgress, setUserProgress] = useState({ week: 0, day: 0 });
  const { userInfo } = useAppSelector(selectUserInfo);

  const currentWeek = plan?.weeks[activeWeekIdx];
  const currentDay = currentWeek?.days[activeDayIdx];

  const sessions = useMemo(
    () => getWorkoutSessionsByUser(userInfo?.id!, plan.id),
    [plan.id, userInfo],
  );

  const calculateProgress = useCallback(() => {
    if (!plan?.weeks || !sessions || !sessions.length)
      return { week: 0, day: 0 };
    const latestSession = sessions[0];
    let foundWeek = 0,
      foundDay = 0;

    plan.weeks.forEach((week, wIdx) => {
      const dIdx = week.days.findIndex((d) => d.id === latestSession.planDayId);
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

  const onEditDay = () => {
    if (plan) {
      const day = plan.weeks[activeWeekIdx]?.days[activeDayIdx];
      if (day) {
        navigation.navigate("editDay", { dayPlan: day });
      }
    }
  };
  return (
    <>
      <Text style={styles.heroSub}>
        Week {activeWeekIdx + 1} • {currentWeek?.days.length} Days Active
      </Text>
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
      <View style={styles.dayContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayScroll}
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
      {currentDay && <PlanDetailsExerciseList day={currentDay} />}
      {activeWeekIdx >= userProgress.week &&
        activeDayIdx >= userProgress.day && (
          <View style={styles.footer}>
            {activeWeekIdx === userProgress.week &&
              activeDayIdx === userProgress.day && (
                <SubmitButton
                  icon={<FeatherIcon name="play" size={18} color="black" />}
                  bgColor={COLORS.mainBlue}
                  onPress={onStartSession}
                  title="START SESSION"
                />
              )}
            <SubmitButton
              variant="titleOnly"
              icon={<FeatherIcon name="edit" size={18} color="white" />}
              bgColor={COLORS.mainBlue}
              onPress={onEditDay}
              title="EDIT"
            />
          </View>
        )}
    </>
  );
};

export default ActivePlanDetails;

const styles = StyleSheet.create({
  heroSub: {
    color: "#ccc",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    marginLeft: 20,
  },
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

  dayContainer: { backgroundColor: COLORS.black },
  dayScroll: { paddingHorizontal: 20, paddingVertical: 10 },
  dayChip: {
    height: 45,
    minWidth: 80,
    paddingHorizontal: 20,
    backgroundColor: COLORS.black1,
    borderRadius: 12,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  activeDayChip: { backgroundColor: COLORS.white, borderColor: COLORS.white },
  doneDayChip: { borderColor: COLORS.mainBlue },
  dayChipText: { color: "#666", fontWeight: "900", fontSize: 12 },
  activeDayChipText: { color: "black" },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingBottom: 20,
    backgroundColor: "rgba(0,0,0,0.92)",
  },
});
