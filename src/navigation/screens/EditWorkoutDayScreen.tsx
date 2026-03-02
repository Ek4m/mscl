import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import FeatherIcon from "react-native-vector-icons/Feather";
import { RootStackParamList } from "../types";
import { COLORS } from "../../constants/colors";
import SubmitButton from "../../UI/components/submitButton";
import { WorkoutExercise } from "../../modules/prediction/types";
import { selectAiPlan } from "../../redux/workout/create-ai";
import { useAppSelector } from "../../redux/root";
import { useEditDayMutation } from "../../redux/plans/slice";
import { successToast } from "../../helpers/toast";

const EditDayScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, "editDay">
> = ({ route, navigation }) => {
  const [triggerEdit, { isLoading }] = useEditDayMutation();
  const { dayPlan } = route.params;

  // 1. Get library of all available exercises from Redux
  const { exercises: exerciseLibrary } = useAppSelector(selectAiPlan);
  const [exercises, setExercises] = useState<WorkoutExercise[]>(
    [...dayPlan.exercises].sort((a, b) => a.orderIndex - b.orderIndex),
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const onSave = async () => {
    const exercisePayload = {
      dayId: dayPlan.id,
      exercises: exercises.map((ex, index) => ({
        exerciseId: ex.exercise?.id,
        variationId: ex.variation?.id,
        orderIndex: index + 1,
        targetReps: ex.targetReps,
        targetSets: ex.targetSets,
      })),
    };
    await triggerEdit(exercisePayload).unwrap();
    successToast("Workout plan updated!")
    navigation.goBack();
  };

  const addExercise = (libraryEx: any) => {
    const newEntry: WorkoutExercise = {
      id: Date.now(), 
      targetSets: 3,
      targetReps: 10,
      orderIndex: exercises.length,
      exercise: libraryEx,
      variation: { id: libraryEx?.variationId, title: "", thumbnail: "" },
      createdAt: new Date().toISOString(),
    };

    setExercises([...exercises, newEntry]);
    setIsModalVisible(false);
    setSearchQuery("");
  };

  const handleRemove = (id: number, title?: string) => {
    Alert.alert("Remove Exercise", `Remove ${title}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () =>
          setExercises((prev) => prev.filter((ex) => ex.id !== id)),
      },
    ]);
  };

  const updateVolume = (
    id: number,
    field: "targetSets" | "targetReps",
    amount: number,
  ) => {
    setExercises((current) =>
      current.map((ex) =>
        ex.id === id
          ? { ...ex, [field]: Math.max(1, (ex[field] || 0) + amount) }
          : ex,
      ),
    );
  };

  // Filtered list for the "Add" Modal
  const filteredLibrary = useMemo(() => {
    return exerciseLibrary.filter((ex) =>
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, exerciseLibrary]);

  const RenderExerciseItem = ({ item }: { item: WorkoutExercise }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.exerciseTitle}>{item.exercise?.title}</Text>
          <Text style={styles.muscleText}>
            {item.exercise?.primaryMuscles.join(", ").toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleRemove(item.id, item.exercise?.title)}
          style={styles.removeBtn}
        >
          <FeatherIcon name="trash-2" size={18} color="#ff4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.volumeRow}>
        {(["targetSets", "targetReps"] as const).map((field) => (
          <View key={field} style={styles.volumeControl}>
            <Text style={styles.label}>
              {field === "targetSets" ? "SETS" : "REPS"}
            </Text>
            <View style={styles.counterGroup}>
              <TouchableOpacity
                onPress={() => updateVolume(item.id, field, -1)}
              >
                <FeatherIcon name="minus-square" size={28} color="#333" />
              </TouchableOpacity>
              <Text style={styles.volumeValue}>{item[field]}</Text>
              <TouchableOpacity onPress={() => updateVolume(item.id, field, 1)}>
                <FeatherIcon
                  name="plus-square"
                  size={28}
                  color={COLORS.mainBlue}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FeatherIcon name="x" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EDIT DAY {dayPlan.dayIndex + 1}</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <FeatherIcon name="plus" size={24} color={COLORS.mainBlue} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={RenderExerciseItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No exercises added yet. Tap + to add.
          </Text>
        }
      />

      {/* Exercise Selection Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Exercise</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <FeatherIcon name="chevron-down" size={28} color="white" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <FlatList
            data={filteredLibrary}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.libraryItem}
                onPress={() => addExercise(item)}
              >
                <Text style={styles.libraryItemTitle}>{item.title}</Text>
                <FeatherIcon
                  name="plus-circle"
                  size={20}
                  color={COLORS.mainBlue}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      <View style={styles.footer}>
        <SubmitButton
          title="SAVE CHANGES"
          loading={isLoading}
          bgColor={COLORS.mainBlue}
          onPress={onSave}
        />
      </View>
    </View>
  );
};

export default EditDayScreen;

const styles = StyleSheet.create({
  // ... (keep your existing styles)
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 60,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    fontStyle: "italic",
  },
  listContent: { padding: 20, paddingBottom: 100 },
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },

  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: "#111", padding: 20 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { color: "white", fontSize: 22, fontWeight: "bold" },
  searchInput: {
    backgroundColor: "#222",
    color: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  libraryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  libraryItemTitle: { color: "white", fontSize: 16 },

  // Existing Card Styles
  card: {
    backgroundColor: "#121212",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  exerciseTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  muscleText: {
    color: COLORS.mainBlue,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
    letterSpacing: 1,
  },
  volumeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#222",
    paddingTop: 15,
  },
  volumeControl: { width: "48%" },
  label: {
    color: "#555",
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
  },
  counterGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#080808",
    borderRadius: 12,
    paddingVertical: 5,
  },
  volumeValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    minWidth: 30,
    textAlign: "center",
  },
  removeBtn: {
    padding: 8,
    backgroundColor: "rgba(255, 68, 68, 0.1)",
    borderRadius: 10,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
});
