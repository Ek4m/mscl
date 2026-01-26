import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import FaIcons from "react-native-vector-icons/FontAwesome5";

import { COLORS } from "../../constants/colors";
import ExercisePicker from "../../modules/prediction/components/exercisePicker";
import { MuscleGroup } from "../../modules/workout/vault";
import { CustomDayPlan, Exercise } from "../../modules/workout/types";
import SelectedExerciseItem from "../../modules/prediction/components/selectedExerciseItem";

const CustomPlanCreator = () => {
  const [daysCount, setDaysCount] = useState(3);
  const [activeDay, setActiveDay] = useState(1);
  const [plan, setPlan] = useState<CustomDayPlan[]>(
    Array.from({ length: 7 }, (_, i) => ({ dayNumber: i + 1, exercises: [] })),
  );

  const [isModalVisible, setModalVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<"all" | MuscleGroup>("all");

  const handleSelectExercise = (exercise: Exercise) => {
    const updatedPlan = [...plan];
    updatedPlan[activeDay - 1].exercises.push({
      id: exercise.id,
      name: exercise.title,
      muscle: exercise.primaryMuscles.join(", "),
    });
    setPlan(updatedPlan);
  };
  const handleRemoveExercise = (index: number) => {
    const updatedPlan = [...plan];
    updatedPlan[activeDay - 1].exercises.splice(index, 1);
    setPlan(updatedPlan);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Custom <Text style={{ color: COLORS.mainBlue }}>Builder</Text>
        </Text>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Plan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* STEP 1: Frequency Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Frequency (Days per week)</Text>
          <View style={styles.daysRow}>
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <TouchableOpacity
                key={num}
                onPress={() => setDaysCount(num)}
                style={[
                  styles.dayBadge,
                  daysCount === num && styles.dayBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.dayBadgeText,
                    daysCount === num && styles.textBlack,
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dayTabs}
          >
            {Array.from({ length: daysCount }).map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setActiveDay(i + 1)}
                style={[styles.tab, activeDay === i + 1 && styles.tabActive]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeDay === i + 1 && styles.textWhite,
                  ]}
                >
                  Day {i + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.exerciseArea}>
          <View style={styles.areaHeader}>
            <Text style={styles.areaTitle}>Day {activeDay} Exercises</Text>
            <Text style={styles.countText}>
              {plan[activeDay - 1].exercises.length} added
            </Text>
          </View>

          {plan[activeDay - 1].exercises.length === 0 ? (
            <View style={styles.emptyState}>
              <FaIcons name="dumbbell" size={40} color="#27272a" />
              <Text style={styles.emptyText}>No exercises added yet</Text>
            </View>
          ) : (
            plan[activeDay - 1].exercises.map((ex, index) => (
              <SelectedExerciseItem
                key={ex.id}
                ex={ex}
                handleRemoveExercise={() => handleRemoveExercise(index)}
              />
            ))
          )}
          <View style={styles.addActions}>
            <ExercisePicker
              visible={isModalVisible}
              initialMuscle={pickerMode}
              onClose={() => setModalVisible(false)}
              onSelect={handleSelectExercise}
            />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => {
                setPickerMode(MuscleGroup.Chest);
                setModalVisible(true);
              }} // Picks a muscle to start with
            >
              <Text style={styles.addBtnText}>By Muscle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => {
                setPickerMode("all");
                setModalVisible(true);
              }} // Starts with All
            >
              <Text style={styles.addBtnText}>Direct Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20 },
  header: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: { fontSize: 28, fontWeight: "900", color: COLORS.white },
  saveBtn: {
    backgroundColor: COLORS.mainBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveBtnText: { color: "#000", fontWeight: "bold", fontSize: 14 },
  section: { marginBottom: 25 },
  label: {
    color: "#71717a",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  listWrapper: {
    marginVertical: 10,
    gap: 10,
  },
  daysRow: { flexDirection: "row", justifyContent: "space-between" },
  dayBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#18181b",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  dayBadgeActive: {
    backgroundColor: COLORS.mainBlue,
    borderColor: COLORS.mainBlue,
  },
  dayBadgeText: { color: "#71717a", fontWeight: "bold" },
  textBlack: { color: "#000" },
  textWhite: { color: COLORS.white },
  dayTabs: { flexDirection: "row" },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#222",
  },
  tabActive: { borderColor: COLORS.mainBlue, backgroundColor: "#083344" },
  tabText: { color: "#71717a", fontWeight: "600" },
  exerciseArea: { flex: 1, minHeight: 300 },
  areaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  areaTitle: { color: COLORS.white, fontSize: 18, fontWeight: "bold" },
  countText: { color: "#52525b", fontSize: 12 },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: "#09090b",
    borderRadius: 20,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  emptyText: { color: "#3f3f46", marginTop: 10, fontSize: 14 },
  addActions: { flexDirection: "row", gap: 12, marginTop: 20 },
  addBtn: {
    flex: 1,
    height: 55,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.mainBlue,
    borderStyle: "dashed",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  addBtnText: { color: COLORS.mainBlue, fontWeight: "bold" },
});

export default CustomPlanCreator;
