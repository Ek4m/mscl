import React, { useState, useMemo, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import FaIcons from "react-native-vector-icons/FontAwesome5";

import { COLORS } from "../../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../../redux/root";
import { selectPredictions } from "../../../redux/workout/create-ai";
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
  const { activeDay, plan, pickerMode } = useAppSelector(selectCreatePlanState);
  const { exercises } = useAppSelector(selectPredictions);
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | "all">(
    "all",
  );

  const day = plan[activeDay - 1];

  useEffect(() => {
    if (pickerMode) setSelectedMuscle(pickerMode);
  }, [pickerMode]);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = ex.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesMuscle =
        selectedMuscle === "all" || ex.primaryMuscles.includes(selectedMuscle);
      const alreadySelected = day.exercises.some((e) => e.id === ex.id);
      return matchesSearch && matchesMuscle && !alreadySelected;
    });
  }, [search, selectedMuscle, day]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Add Exercise</Text>
          <TouchableOpacity onPress={onClose}>
            <FaIcons name="times" size={20} color="#71717a" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <FaIcons
            name="search"
            size={14}
            color="#52525b"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search exercises..."
            placeholderTextColor="#52525b"
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <View style={{ height: 50 }}>
          <FlatList
            horizontal
            data={[
              "all",
              MuscleGroup.Chest,
              MuscleGroup.Biceps,
              MuscleGroup.Triceps,
              MuscleGroup.Back,
              MuscleGroup.LowerBack,
              MuscleGroup.Shoulders,
            ]}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipList}
            renderItem={({ item }: { item: MuscleGroup | "all" }) => (
              <TouchableOpacity
                onPress={() => setSelectedMuscle(item)}
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
                  {item === "all" ? "All" : MuscleGroupTitles[item]}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ExerciseAddItem
              item={item}
              onClose={onClose}
              onSelect={(ex) => dispatch(addExercise(ex))}
            />
          )}
        />
      </View>
    </Modal>
  );
};

export default ExercisePicker;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#09090b",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  searchContainer: {
    marginVertical: 10,
    backgroundColor: "#18181b",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, height: 45, color: "#fff" },
  chipList: { gap: 10 },
  chip: {
    paddingHorizontal: 16,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#18181b",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  chipActive: {
    backgroundColor: COLORS.mainBlue,
    borderColor: COLORS.mainBlue,
  },
  chipText: { color: "#71717a", fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: "#000" },
});
