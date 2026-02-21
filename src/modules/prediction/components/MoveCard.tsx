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

interface ExerciseCardProps {
  exercise: ActiveExercise;
  onToggleSet: (
    exerciseId: number,
    setIndex: number,
    variationId: number | null,
    reps?: number,
  ) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onToggleSet,
}) => {
  const [infoVisible, setInfoVisible] = useState(false);
  const [loggingSetIndex, setLoggingSetIndex] = useState<number | null>(null);
  const [repsInput, setRepsInput] = useState("");

  const title = exercise.variation?.title || exercise.exercise?.title;

  const handleSetPress = (idx: number, isDone: boolean) => {
    if (isDone) {
      Alert.alert(
        "REMOVE SET",
        `Delete set ${idx + 1} from this session?`,
        [
          { text: "KEEP", style: "cancel" },
          {
            text: "DELETE",
            style: "destructive",
            onPress: () =>
              onToggleSet(
                exercise.exercise?.id!,
                idx,
                exercise.variation?.id ?? null,
              ),
          },
        ],
        { cancelable: true },
      );
    } else {
      // Open rep logger for new set
      setRepsInput(exercise.targetReps?.toString() || "");
      setLoggingSetIndex(idx);
    }
  };

  const confirmReps = () => {
    if (loggingSetIndex !== null) {
      const reps = parseInt(repsInput) || exercise.targetReps || 0;
      onToggleSet(
        exercise.exercise?.id!,
        loggingSetIndex,
        exercise.variation?.id ?? null,
        reps,
      );
      setLoggingSetIndex(null);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.exerciseName}>{title?.toUpperCase()}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <Text style={styles.statText}>{exercise.targetSets} SETS</Text>
            </View>
            <View style={[styles.statBadge, { marginLeft: 8 }]}>
              <Text style={styles.statText}>
                {exercise.targetReps} REPS TARGET
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setInfoVisible(!infoVisible)}
          style={styles.infoBtn}
        >
          <FeatherIcon
            name={infoVisible ? "chevron-up" : "help-circle"}
            size={20}
            color={COLORS.mainBlue}
          />
        </TouchableOpacity>
      </View>

      {infoVisible && (
        <View style={styles.infoContent}>
          {exercise.exercise?.steps?.map((step, i) => (
            <Text key={i} style={styles.stepText}>
              {i + 1}. {step}
            </Text>
          ))}
        </View>
      )}

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
              <View style={styles.doneContent}>
                <Text style={styles.doneRepsText}>
                  {session.reps || exercise.targetReps}
                </Text>
                <Text style={styles.doneLabel}>REPS</Text>
              </View>
            ) : (
              <Text style={styles.setNumberText}>{idx + 1}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Industrial Rep Logger Modal */}
      <Modal
        visible={loggingSetIndex !== null}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              LOG SET {loggingSetIndex! + 1}
            </Text>
            <Text style={styles.modalSub}>{title?.toUpperCase()}</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.repsInput}
                value={repsInput}
                onChangeText={setRepsInput}
                keyboardType="number-pad"
                autoFocus
                selectionColor={COLORS.mainBlue}
              />
              <Text style={styles.inputLabel}>REPS COMPLETED</Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setLoggingSetIndex(null)}
              >
                <Text style={styles.cancelBtnText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmReps}>
                <Text style={styles.confirmBtnText}>LOG SET</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#141414",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222",
    padding: 20,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  exerciseName: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    fontStyle: "italic",
  },
  statsRow: { flexDirection: "row", marginTop: 8 },
  statBadge: {
    backgroundColor: "#1f1f1f",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
  },
  statText: { color: COLORS.mainBlue, fontSize: 10, fontWeight: "bold" },
  infoBtn: { padding: 4 },
  infoContent: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  stepText: { color: "#888", fontSize: 12, marginBottom: 4 },
  setGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 20 },
  setBox: {
    width: 55,
    height: 55,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  setPending: { backgroundColor: "#0d0d0d", borderColor: "#333" },
  setDone: { backgroundColor: COLORS.mainBlue, borderColor: COLORS.mainBlue },
  setNumberText: { color: "#444", fontWeight: "900", fontSize: 18 },
  doneContent: { alignItems: "center" },
  doneRepsText: { color: "white", fontWeight: "900", fontSize: 18 },
  doneLabel: { color: "white", fontSize: 8, fontWeight: "bold", marginTop: -2 },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: COLORS.mainBlue,
  },
  modalTitle: {
    color: COLORS.mainBlue,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center",
  },
  modalSub: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 10,
  },
  inputContainer: { alignItems: "center", marginVertical: 20 },
  repsInput: {
    color: "white",
    fontSize: 60,
    fontWeight: "900",
    textAlign: "center",
    width: "100%",
  },
  inputLabel: {
    color: "#555",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 10 },
  cancelBtn: { flex: 1, padding: 15, alignItems: "center" },
  cancelBtnText: { color: "#666", fontWeight: "bold" },
  confirmBtn: {
    flex: 2,
    backgroundColor: COLORS.mainBlue,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmBtnText: { color: "white", fontWeight: "900" },
});

export default ExerciseCard;
