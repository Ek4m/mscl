import React, { FC, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import FaIcons from "react-native-vector-icons/FontAwesome5";

import { COLORS } from "../../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../../redux/root";
import {
  selectCreatePlanState,
  setActiveDay,
  setActiveWeek,
  setDaysPerWeek,
  setWeeksCount,
  setPickerMode,
  removeExercise,
} from "../../../redux/workout/create-plan";

import ExercisePicker from "../../../modules/prediction/components/exercisePicker";
import SelectedExerciseItem from "../../../modules/prediction/components/selectedExerciseItem";
import { MuscleGroup } from "../../../modules/workout/vault";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CreateCustomPlanParamList } from "./types";

const CustomPlanCreatorScreen: FC<
  NativeStackScreenProps<CreateCustomPlanParamList, "builder">
> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { activeWeek, activeDay, weeksCount, daysPerWeek, plan } =
    useAppSelector(selectCreatePlanState);

  const [isModalVisible, setModalVisible] = useState(false);

  // Safely get exercises for the currently selected Week and Day
  const currentWeek = plan[activeWeek - 1];
  const currentDayExercises =
    currentWeek?.days[activeDay - 1]?.exercises || [];

  const adjustCount = (type: "weeks" | "days", delta: number) => {
    if (type === "weeks") {
      dispatch(setWeeksCount(Math.max(1, Math.min(12, weeksCount + delta))));
    } else {
      dispatch(setDaysPerWeek(Math.max(1, Math.min(7, daysPerWeek + delta))));
    }
  };

  const openPicker = (mode: MuscleGroup | "all") => {
    dispatch(setPickerMode(mode));
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 1. HEADER & CONFIGURATION */}
      <View style={styles.topNav}>
        <View style={styles.headerRow}>
          <Text style={styles.brandText}>BUILDER</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("inspectPlan")}
            style={styles.saveBadge}
          >
            <Text style={styles.saveText}>FINISH</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.configRow}>
          <View style={styles.counterGroup}>
            <Text style={styles.counterLabel}>WEEKS</Text>
            <View style={styles.counterControls}>
              <TouchableOpacity onPress={() => adjustCount("weeks", -1)}>
                <FaIcons name="minus" size={10} color="#52525b" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{weeksCount}</Text>
              <TouchableOpacity onPress={() => adjustCount("weeks", 1)}>
                <FaIcons name="plus" size={10} color={COLORS.mainBlue} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.counterGroup, { marginLeft: 20 }]}>
            <Text style={styles.counterLabel}>DAYS/WK</Text>
            <View style={styles.counterControls}>
              <TouchableOpacity onPress={() => adjustCount("days", -1)}>
                <FaIcons name="minus" size={10} color="#52525b" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{daysPerWeek}</Text>
              <TouchableOpacity onPress={() => adjustCount("days", 1)}>
                <FaIcons name="plus" size={10} color={COLORS.mainBlue} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* 2. COMPACT WEEK SELECTOR */}
      <View style={styles.weekBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekScroll}
        >
          {plan.map((week) => (
            <TouchableOpacity
              key={week.weekNumber}
              onPress={() => dispatch(setActiveWeek(week.weekNumber))}
              style={[
                styles.weekPill,
                activeWeek === week.weekNumber && styles.weekPillActive,
              ]}
            >
              <Text
                style={[
                  styles.weekPillText,
                  activeWeek === week.weekNumber && styles.textBlack,
                ]}
              >
                W{week.weekNumber}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 3. SMALL DAY SELECTOR */}
        <View style={styles.dayContainer}>
          {Array.from({ length: daysPerWeek }).map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => dispatch(setActiveDay(i + 1))}
              style={[
                styles.smallDayCircle,
                activeDay === i + 1 && styles.dayCircleActive,
              ]}
            >
              <Text
                style={[
                  styles.smallDayText,
                  activeDay === i + 1 && styles.textWhite,
                ]}
              >
                {i + 1}
              </Text>
              {activeDay === i + 1 && <View style={styles.miniDot} />}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.contentArea}>
          <View style={styles.statusLine}>
            <Text style={styles.statusTitle}>
              Week {activeWeek} • Day {activeDay}
            </Text>
            <View style={styles.divider} />
          </View>

          {/* LIST OF SELECTED EXERCISES */}
          {currentDayExercises.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.iconBox}>
                <FaIcons name="layer-group" size={24} color="#18181b" />
              </View>
              <Text style={styles.emptyTitle}>Empty Session</Text>
              <Text style={styles.emptySub}>Tap '+' to add exercises</Text>
            </View>
          ) : (
            currentDayExercises.map((ex) => (
              <SelectedExerciseItem
                key={ex.instanceId} // Use instanceId for unique keys
                ex={ex}
                handleRemoveExercise={() =>
                  dispatch(removeExercise(ex.instanceId))
                }
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* 4. COMPACT ACTION DOCK */}
      <View style={styles.dock}>
        <TouchableOpacity
          style={styles.mainAddBtn}
          onPress={() => openPicker("all")}
        >
          <FaIcons name="plus" size={18} color="#000" />
        </TouchableOpacity>
      </View>

      {/* 5. MODAL */}
      <ExercisePicker
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  topNav: {
    paddingTop: 50,
    backgroundColor: "#000",
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  brandText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 3,
  },
  saveBadge: {
    backgroundColor: COLORS.mainBlue,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  saveText: { color: "#000", fontWeight: "900", fontSize: 11 },

  configRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#09090b",
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#18181b",
  },
  counterGroup: { flexDirection: "row", alignItems: "center" },
  counterLabel: {
    color: "#3f3f46",
    fontSize: 10,
    fontWeight: "800",
    marginRight: 8,
  },
  counterControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  counterValue: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
    minWidth: 15,
    textAlign: "center",
  },

  weekBar: { borderBottomWidth: 1, borderColor: "#09090b", paddingBottom: 10 },
  weekScroll: { paddingHorizontal: 20, gap: 8 },
  weekPill: {
    backgroundColor: "#09090b",
    paddingHorizontal: 15,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#18181b",
  },
  weekPillActive: {
    backgroundColor: COLORS.mainBlue,
    borderColor: COLORS.mainBlue,
  },
  weekPillText: { color: "#71717a", fontSize: 12, fontWeight: "bold" },
  textBlack: { color: "#000" },

  scrollContent: { paddingBottom: 120 },
  dayContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 20,
  },
  smallDayCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#09090b",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#18181b",
  },
  dayCircleActive: { borderColor: COLORS.mainBlue, backgroundColor: "#083344" },
  smallDayText: { color: "#3f3f46", fontSize: 14, fontWeight: "900" },
  textWhite: { color: "#fff" },
  miniDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.mainBlue,
    position: "absolute",
    bottom: 6,
  },

  contentArea: { paddingHorizontal: 20, marginTop: 30 },
  statusLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  statusTitle: { color: "#fff", fontSize: 16, fontWeight: "800" },
  divider: { flex: 1, height: 1, backgroundColor: "#09090b" },

  emptyState: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#09090b",
    borderRadius: 25,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#18181b",
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  emptyTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  emptySub: { color: "#3f3f46", fontSize: 12, marginTop: 5 },

  dock: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 10,
    borderRadius: 40,
    gap: 20,
    borderWidth: 1,
    borderColor: "#18181b",
  },
  dockIcon: { padding: 10 },
  mainAddBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.mainBlue,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomPlanCreatorScreen;
