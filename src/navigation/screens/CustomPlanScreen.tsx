import React, { FC, memo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import FaIcons from "react-native-vector-icons/FontAwesome5";

import { COLORS } from "../../constants/colors";
import ExercisePicker from "../../modules/prediction/components/exercisePicker";
import { MuscleGroup } from "../../modules/workout/vault";
import SelectedExerciseItem from "../../modules/prediction/components/selectedExerciseItem";
import NumOfDaysSelect from "../../modules/prediction/components/numOfDaysSelect";
import { useAppDispatch, useAppSelector } from "../../redux/root";
import {
  removeExercise,
  selectCreatePlanState,
  setActiveDay,
  setDaysCount,
  setPickerMode,
} from "../../redux/workout/create-plan";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

const CustomPlanCreatorScreen: FC<
  NativeStackScreenProps<RootStackParamList>
> = ({ navigation }) => {
  const { activeDay, daysCount, plan } = useAppSelector(selectCreatePlanState);
  const dispatch = useAppDispatch();

  const [isModalVisible, setModalVisible] = useState(false);

  const onSave = () => {
    const filledDays = plan
      .slice(0, daysCount)
      .filter((e) => Boolean(e.exercises.length));
    const numberOfFilledDays = filledDays.length;
    if (numberOfFilledDays < daysCount) {
      Alert.alert(
        `Warning!`,
        `You have selected ${daysCount} days, but only ${numberOfFilledDays} days were filled with exercises. Unfilled day will be ignored. Do you want to proceed?`,
        [
          { style: "cancel", text: "cancel" },
          {
            text: "proceed",
            onPress: async () => {
              navigation.navigate("inspectPlan");
            },
          },
        ],
      );
    } else {
      navigation.navigate("inspectPlan");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Custom <Text style={{ color: COLORS.mainBlue }}>Builder</Text>
        </Text>
        <TouchableOpacity onPress={onSave} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Plan</Text>
        </TouchableOpacity>
      </View>
      <NumOfDaysSelect
        daysCount={daysCount}
        setDaysCount={(c) => dispatch(setDaysCount(c))}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dayTabs}
          >
            {Array.from({ length: daysCount }).map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => dispatch(setActiveDay(i + 1))}
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
                key={ex.name}
                ex={ex}
                handleRemoveExercise={() => dispatch(removeExercise(index))}
              />
            ))
          )}
          <View style={styles.addActions}>
            <ExercisePicker
              visible={isModalVisible}
              onClose={() => setModalVisible(false)}
            />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => {
                dispatch(setPickerMode(MuscleGroup.Chest));
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
  listWrapper: {
    marginVertical: 10,
    gap: 10,
  },
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
    marginBottom: 20,
    borderColor: COLORS.mainBlue,
    borderStyle: "dashed",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  addBtnText: { color: COLORS.mainBlue, fontWeight: "bold" },
});

export default memo(CustomPlanCreatorScreen);
