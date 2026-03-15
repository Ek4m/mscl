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
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import FeatherIcon from "react-native-vector-icons/Feather";

import { COLORS } from "../../constants/colors";
import SubmitButton from "../../UI/components/submitButton";

import { successToast } from "../../helpers/toast";
import { getImageUrl } from "../../modules/prediction/helpers";

import { Metric, WorkoutExercise } from "../../modules/prediction/types";
import { Exercise } from "../../modules/workout/types";
import { RootStackParamList } from "../types";

import { selectAiPlan } from "../../redux/workout/create-ai";
import { useEditDayMutation } from "../../redux/plans/slice";
import { useAppSelector } from "../../redux/root";

const EditDayScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, "editDay">
> = ({ route, navigation }) => {
  const [triggerEdit, { isLoading }] = useEditDayMutation();
  const { dayPlan } = route.params;

  const { exercises: exerciseLibrary, metrics } = useAppSelector(selectAiPlan);
  const [exercises, setExercises] = useState<WorkoutExercise[]>(
    [...dayPlan.exercises].sort((a, b) => a.orderIndex - b.orderIndex),
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const onSave = async () => {
    const exercisePayload = {
      dayId: dayPlan.id,
      exercises: exercises.map((ex, index) => ({
        exerciseId: ex.variation?.id,
        orderIndex: index + 1,
        targetReps: ex.targetReps,
        targetSets: ex.targetSets,
        targetValue: Number(ex.targetValue) || 0,
        metric: { id: ex.metric?.id },
      })),
    };
    await triggerEdit(exercisePayload).unwrap();
    successToast("Workout plan updated!");
    navigation.goBack();
  };

  const addExercise = (libraryEx: Exercise) => {
    const newEntry: WorkoutExercise = {
      id: Date.now(),
      targetSets: 3,
      targetReps: 10,
      orderIndex: exercises.length,
      variation: libraryEx,
      metric: libraryEx.exercise.defaultMetric,
      targetValue: libraryEx.exercise.defaultMetric.defaultValue,
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
    field: "targetSets" | "targetReps" | "targetValue",
    amount: number,
  ) => {
    if (field !== "targetValue") {
      setExercises((current) =>
        current.map((ex) =>
          ex.id === id
            ? { ...ex, [field]: Math.max(1, (ex[field] || 0) + amount) }
            : ex,
        ),
      );
    } else {
      setExercises((current) =>
        current.map((ex) =>
          ex.id === id ? { ...ex, targetValue: amount } : ex,
        ),
      );
    }
  };

  const updateMetric = (exerciseId: number, selectedMetric: Metric) => {
    setExercises((current) =>
      current.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              metric: selectedMetric,
              targetValue: selectedMetric.defaultValue,
            }
          : ex,
      ),
    );
  };

  const filteredLibrary = useMemo(() => {
    return exerciseLibrary.filter((ex) =>
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, exerciseLibrary]);

  const RenderExerciseItem = ({ item }: { item: WorkoutExercise }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.exerciseTitle}>{item.variation?.title}</Text>
          <Text style={styles.muscleText}>
            {item.variation?.primaryMuscles.join(", ").toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleRemove(item.id, item.variation?.title)}
          style={styles.removeBtn}
        >
          <FeatherIcon name="trash-2" size={18} color="#ff4444" />
        </TouchableOpacity>
      </View>
      <View style={styles.metricsRow}>
        {metrics.map((m) => {
          const isActive = item.metric?.id === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              style={[styles.metricTab, isActive && styles.activeMetricTab]}
              onPress={() => updateMetric(item.id, m)}
            >
              <Text
                style={[
                  styles.metricTabText,
                  isActive && styles.activeMetricTabText,
                ]}
              >
                {m.name.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
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
        <View style={styles.volumeControl}>
          <Text style={styles.label}>{item.metric?.name.toUpperCase()}</Text>
          <TextInput
            keyboardType="numeric"
            style={[styles.counterGroup, styles.counterGroupInput]}
            onChangeText={(val) =>
              updateVolume(item.id, "targetValue", Number(val))
            }
            value={item.targetValue?.toString()}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FeatherIcon name="x" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          EDIT DAY {dayPlan.orderIndex + 1}
        </Text>
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
                <View style={styles.thumbnailContainer}>
                  <Image
                    style={styles.thumbnail}
                    source={{ uri: getImageUrl(item.thumbnail) }}
                  />
                  <Text style={styles.libraryItemTitle}>{item.title}</Text>
                </View>
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
  container: { flex: 1, backgroundColor: COLORS.black },
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
  modalContainer: { flex: 1, backgroundColor: COLORS.black1, padding: 20 },
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
    padding: 8,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  libraryItemTitle: { color: "white", fontSize: 16 },

  // Existing Card Styles
  card: {
    backgroundColor: "#121212",
    borderRadius: 20,
    padding: 15,
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
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  muscleText: {
    color: COLORS.mainBlue,
    fontSize: 8,
    fontWeight: "700",
    marginTop: 4,
    letterSpacing: 1,
  },
  volumeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#222",
    paddingTop: 10,
  },
  volumeControl: { width: "30%" },
  label: {
    color: "#555",
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 5,
    textAlign: "center",
  },
  counterGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#080808",
    borderRadius: 12,
    color: COLORS.white,
    paddingVertical: 5,
  },
  counterGroupInput: {
    height: 38,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
  },
  volumeValue: {
    color: COLORS.white,
    fontSize: 15,
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
  thumbnailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnail: {
    width: 80,
    height: 40,
    backgroundColor: "white",
    marginRight: 10,
    borderRadius: 5,
    objectFit: "contain",
  },
  // ... existing styles
  metricsRow: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 8,
  },
  metricTab: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
  },
  activeMetricTab: {
    backgroundColor: COLORS.mainBlue,
    borderColor: COLORS.mainBlue,
  },
  metricTabText: {
    color: "#666",
    fontSize: 10,
    fontWeight: "800",
  },
  activeMetricTabText: {
    color: COLORS.white,
  },
  valueInput: {
    backgroundColor: "#080808",
    borderRadius: 12,
    color: COLORS.white,
    paddingVertical: 10,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#222",
  },
});
