import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";

import { ActiveExercise } from "../types";
import { COLORS } from "../../../constants/colors";
import Chip from "../../../UI/components/chip";
import { MuscleGroupTitles } from "../../workout/vault";
import SubmitButton from "../../../UI/components/submitButton";

interface ExerciseCardProps {
  exercise: ActiveExercise;
  onToggleSet: (
    exerciseId: number,
    setIndex: number,
    reps?: number,
    doneValue?: number,
    extraWeight?: number,
  ) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onToggleSet,
}) => {
  const [infoVisible, setInfoVisible] = useState(false);
  const [loggingSetIndex, setLoggingSetIndex] = useState<number | null>(null);
  const [repsInput, setRepsInput] = useState("");
  const [doneValue, setDoneValue] = useState("");
  const [extraWeight, setExtraWeight] = useState("");

  const title = exercise.variation?.title || "Exercise";

  const handleSetPress = (idx: number, isDone: boolean) => {
    if (isDone) {
      Alert.alert(
        "REMOVE SET",
        `Delete set ${idx + 1}?`,
        [
          { text: "KEEP", style: "cancel" },
          {
            text: "DELETE",
            style: "destructive",
            onPress: () => onToggleSet(exercise.variation.id, idx),
          },
        ],
        { cancelable: true },
      );
    } else {
      setRepsInput(exercise.targetReps?.toString() || "");
      setDoneValue(exercise.metric.defaultValue.toString());
      setLoggingSetIndex(idx);
    }
  };

  const confirmReps = () => {
    if (loggingSetIndex !== null) {
      const reps = parseInt(repsInput) || exercise.targetReps || 1;
      const doneValueRep = parseInt(doneValue) || exercise.targetValue || 0;
      const extraWeightNum = parseInt(extraWeight) || 0;
      onToggleSet(
        exercise.variation.id,
        loggingSetIndex,
        reps,
        doneValueRep,
        extraWeightNum,
      );
      setLoggingSetIndex(null);
    }
  };

  return (
    <View style={styles.card}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.exerciseTitle}>{title}</Text>

          <View style={styles.targetRow}>
            {/* Only show Sets if they exist */}
            {exercise.targetSets && (
              <View style={styles.metricBadge}>
                <Text style={styles.targetItem}>{exercise.targetSets}</Text>
                <Text style={styles.targetLabel}> SETS</Text>
              </View>
            )}

            {/* Only show Reps and Metric if they exist */}
            {exercise.targetReps && (
              <View style={styles.metricBadge}>
                <Text style={styles.targetItem}>{exercise.targetReps}</Text>
                <Text style={styles.targetLabel}> REPS</Text>
              </View>
            )}

            {/* Only show Weight/Metric if preferred metric exists (e.g., 60 KG) */}
            {exercise.targetValue && (
              <View style={styles.metricBadge}>
                <Text style={styles.targetLabel}>Preferred: </Text>
                <Text style={styles.targetItem}>{exercise.targetValue}</Text>
                <Text style={styles.targetLabel}>
                  {" "}
                  {exercise.metric.unitSymbol || "KG"}
                </Text>
              </View>
            )}
          </View>
        </View>

        {exercise.variation?.steps?.length && (
          <TouchableOpacity
            onPress={() => setInfoVisible(!infoVisible)}
            style={styles.infoBtn}
          >
            <FeatherIcon
              name={infoVisible ? "x-circle" : "info"}
              size={22}
              color={infoVisible ? COLORS.mainBlue : "#444"}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Conditional Muscle Chips */}
      {!infoVisible && (
        <View style={styles.muscleContainer}>
          {exercise.variation?.primaryMuscles.map((m) => (
            <Chip key={m} type="neutral" label={MuscleGroupTitles[m]} />
          ))}
        </View>
      )}

      {/* Collapsible Info */}
      {infoVisible && (
        <View style={styles.infoContent}>
          <Text style={styles.sectionHeading}>INSTRUCTIONS</Text>
          {exercise.variation?.steps?.map((step, i) => (
            <Text key={i} style={styles.stepText}>
              {i + 1}. {step}
            </Text>
          ))}
        </View>
      )}

      {/* Progress Section */}
      <View style={styles.footer}>
        <View style={styles.setGrid}>
          {exercise.completedSets.map((session, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleSetPress(idx, !!session)}
              style={[
                styles.setBox,
                session ? styles.setDone : styles.setPending,
              ]}
            >
              {session ? (
                <Text style={styles.doneRepsText}>{session.reps}</Text>
              ) : (
                <Text style={styles.setNumberText}>{idx + 1}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Modal
        visible={loggingSetIndex !== null}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              LOGGING SET {loggingSetIndex! + 1}
            </Text>

            {exercise.targetReps > 1 && (
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.repsInput}
                  value={repsInput}
                  onChangeText={setRepsInput}
                  keyboardType="number-pad"
                  autoFocus
                  selectionColor={COLORS.mainBlue}
                />
                <Text style={styles.inputSubLabel}>REPS COMPLETED</Text>
              </View>
            )}
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder={exercise.metric.defaultValue.toString()}
                placeholderTextColor={"#9c9c9c74"}
                style={styles.repsInput}
                value={doneValue}
                onChangeText={setDoneValue}
                keyboardType="number-pad"
                selectionColor={COLORS.mainBlue}
              />
              <Text style={styles.inputSubLabel}>
                HOW MUCH YOU DID ({exercise.metric.unitSymbol.toUpperCase()})
              </Text>
            </View>
            {exercise.variation.exercise.allowsWeight && (
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder={"5"}
                  placeholderTextColor={"#9c9c9c74"}
                  style={styles.repsInput}
                  value={extraWeight}
                  onChangeText={setExtraWeight}
                  keyboardType="number-pad"
                  selectionColor={COLORS.mainBlue}
                />
                <Text style={styles.inputSubLabel}>
                  EXTRA WEIGHT (KG, IF DONE)
                </Text>
              </View>
            )}
            <View style={styles.modalActions}>
              <SubmitButton
                style={styles.modalBtn}
                variant="outlined"
                onPress={() => setLoggingSetIndex(null)}
                title="CANCEL"
              />
              <SubmitButton
                bgColor={COLORS.mainBlue}
                style={styles.modalBtn}
                onPress={confirmReps}
                title="SAVE SET"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  exerciseTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#333",
    marginHorizontal: 8,
  },
  muscleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 16,
  },
  infoBtn: {
    padding: 8,
  },
  infoContent: {
    backgroundColor: "#0A0A0A",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sectionHeading: {
    color: "#444",
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 8,
    letterSpacing: 1,
  },
  stepText: {
    color: "#AAA",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#1A1A1A",
    paddingTop: 16,
  },
  setGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  setBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  setPending: {
    backgroundColor: "#0A0A0A",
    borderColor: "#222",
  },
  setDone: {
    backgroundColor: COLORS.mainBlue,
    borderColor: COLORS.mainBlue,
  },
  setNumberText: {
    color: "#333",
    fontWeight: "800",
    fontSize: 16,
  },
  doneRepsText: {
    color: "#FFF",
    fontWeight: "900",
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#111",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  modalTitle: {
    color: "#444",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },
  inputWrapper: {
    alignItems: "center",
    marginBottom: 10,
  },
  repsInput: {
    color: "#FFF",
    fontSize: 40,
    fontWeight: "900",
    textAlign: "center",
  },
  inputSubLabel: {
    color: COLORS.mainBlue,
    fontSize: 10,
    fontWeight: "700",
  },
  modalActions: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 12,
  },
  modalBtn: {
    width: "45%",
  },
  targetRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  metricBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#262626",
  },
  targetItem: {
    color: COLORS.mainBlue, // Primary highlight color
    fontSize: 14,
    fontWeight: "900",
    fontFamily: "System", // Or a mono font if available
  },
  targetLabel: {
    color: "#666",
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});

export default ExerciseCard;
