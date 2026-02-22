import React, { useState, useMemo, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import FaIcons from "react-native-vector-icons/FontAwesome5";

import { COLORS } from "../../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../../redux/root";
import { selectAiPlan } from "../../../redux/workout/create-ai";
import { MuscleGroup, MuscleGroupTitles } from "../../workout/vault";
import ExerciseAddItem from "./exerciseAddElement";
import {
  addExercise,
  selectCreatePlanState,
} from "../../../redux/workout/create-plan";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const ExercisePicker: React.FC<Props> = ({ visible, onClose }) => {
  const { activeDay, activeWeek, plan, pickerMode } = useAppSelector(
    selectCreatePlanState,
  );
  const { exercises } = useAppSelector(selectAiPlan);
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | "all">(
    "all",
  );

  // Get current day's exercises for filtering
  const currentDayExercises = useMemo(() => {
    return plan[activeWeek - 1]?.days[activeDay - 1]?.exercises || [];
  }, [plan, activeWeek, activeDay]);

  useEffect(() => {
    if (pickerMode) setSelectedMuscle(pickerMode);
  }, [pickerMode, visible]);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = ex.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesMuscle =
        selectedMuscle === "all" || ex.primaryMuscles.includes(selectedMuscle);
      const alreadySelected = currentDayExercises.some(
        (e) => e.name === ex.title,
      );

      return matchesSearch && matchesMuscle && !alreadySelected;
    });
  }, [search, selectedMuscle, currentDayExercises, exercises]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Compact Handle Indicator for PageSheet */}
        <View style={styles.handle} />

        <View style={styles.modalHeader}>
          <View>
            <Text style={styles.modalTitle}>Add Exercise</Text>
            <Text style={styles.modalSub}>
              Week {activeWeek} • Day {activeDay}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <FaIcons name="times" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <FaIcons name="search" size={14} color="#52525b" />
          <TextInput
            placeholder="Search movements..."
            placeholderTextColor="#52525b"
            style={styles.input}
            value={search}
            onChangeText={setSearch}
            selectionColor={COLORS.mainBlue}
          />
        </View>

        <View style={styles.filterWrapper}>
          <FlatList
            horizontal
            data={["all", ...Object.values(MuscleGroup)]}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipList}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedMuscle(item as any)}
                style={[
                  styles.chip,
                  selectedMuscle === item && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedMuscle === item && styles.chipTextActive,
                  ]}
                >
                  {item === "all"
                    ? "All"
                    : MuscleGroupTitles[item as MuscleGroup]}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.createdAt}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ExerciseAddItem
              item={item}
              onClose={onClose}
              onSelect={(ex, variationId) => {
                dispatch(addExercise({ exercise: ex, variationId }));
              }}
            />
          )}
        />
      </View>
    </Modal>
  );
};

export default ExercisePicker;

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: "#000", padding: 20 },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#27272a",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { color: "#fff", fontSize: 24, fontWeight: "900" },
  modalSub: {
    color: COLORS.mainBlue,
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: "#18181b",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    backgroundColor: "#09090b",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#18181b",
    marginBottom: 15,
  },
  input: { flex: 1, height: 50, color: "#fff", marginLeft: 10, fontSize: 15 },
  filterWrapper: { marginBottom: 20 },
  chipList: { gap: 8 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#09090b",
    borderWidth: 1,
    borderColor: "#18181b",
  },
  chipActive: {
    backgroundColor: COLORS.mainBlue,
    borderColor: COLORS.mainBlue,
  },
  chipText: { color: "#71717a", fontSize: 13, fontWeight: "700" },
  chipTextActive: { color: "#000" },
  listContent: { paddingBottom: 40 },
});
