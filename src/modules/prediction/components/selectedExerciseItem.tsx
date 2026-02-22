import React, { FC } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import FaIcons from "react-native-vector-icons/FontAwesome5";

import { COLORS } from "../../../constants/colors";
import { MuscleGroupTitles } from "../../workout/vault";
import { useAppDispatch } from "../../../redux/root";
import { updateMetrics } from "../../../redux/workout/create-plan";
import { CustomCreateExerciseEntry } from "../../workout/types/create-custom";

const SelectedExerciseItem: FC<{
  ex: CustomCreateExerciseEntry;
  handleRemoveExercise(): void;
}> = ({ ex, handleRemoveExercise }) => {
  const dispatch = useAppDispatch();

  const handleUpdate = (type: "sets" | "reps", value: string) => {
    dispatch(
      updateMetrics({
        instanceId: ex.instanceId,
        [type]: value,
      }),
    );
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.topRow}>
        {/* EXERCISE IMAGE */}
        <Image
          source={{
            uri: "https://images.ctfassets.net/8urtyqugdt2l/2bMyO0jZaRJjfRptw60iwG/17c391156dd01ae6920c672cc2744fb1/desktop-bench-press.jpg",
          }}
          style={styles.exThumbnail}
          resizeMode="cover"
        />

        <View style={styles.infoContent}>
          <View style={styles.nameRow}>
            <Text style={styles.exName} numberOfLines={1}>
              {ex.name}
            </Text>
            <TouchableOpacity
              onPress={handleRemoveExercise}
              style={styles.deleteBtn}
            >
              <FaIcons name="times" size={12} color="#3f3f46" />
            </TouchableOpacity>
          </View>

          <Text style={styles.exMuscle}>
            {ex.muscleGroups.map((m) => MuscleGroupTitles[m]).join(" • ")}
          </Text>

          {/* COMPACT INPUTS INSIDE THE INFO AREA */}
          <View style={styles.inputRow}>
            <View style={styles.inputPill}>
              <Text style={styles.label}>SETS</Text>
              <TextInput
                style={styles.textInput}
                value={ex.sets}
                onChangeText={(v) => handleUpdate("sets", v)}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#27272a"
              />
            </View>

            <Text style={styles.multiplier}>×</Text>

            <View style={styles.inputPill}>
              <Text style={styles.label}>REPS</Text>
              <TextInput
                style={styles.textInput}
                value={ex.reps}
                onChangeText={(v) => handleUpdate("reps", v)}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#27272a"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SelectedExerciseItem;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#09090b",
    borderRadius: 24,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#18181b",
  },
  topRow: {
    flexDirection: "row",
    gap: 12,
  },
  exThumbnail: {
    width: 85,
    height: 85,
    borderRadius: 18,
    backgroundColor: "#18181b",
  },
  infoContent: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    flex: 1,
    marginRight: 8,
  },
  deleteBtn: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  exMuscle: {
    color: "#52525b",
    fontSize: 11,
    fontWeight: "600",
    marginTop: -4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  inputPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 10,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: "#18181b",
    flex: 1,
  },
  label: {
    color: "#3f3f46",
    fontSize: 8,
    fontWeight: "900",
  },
  textInput: {
    flex: 1,
    height: 42,
    color: COLORS.mainBlue,
    textAlign: "center",
    fontWeight: "900",
    fontSize: 14,
  },
  multiplier: {
    color: "#18181b",
    fontSize: 14,
    fontWeight: "bold",
  },
});
