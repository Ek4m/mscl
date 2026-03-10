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
import { useAppDispatch, useAppSelector } from "../../../redux/root";
import { updateMetrics } from "../../../redux/workout/create-plan";
import { CustomCreateExerciseEntry } from "../../workout/types/create-custom";
import { getImageUrl } from "../helpers";
import { selectAiPlan } from "../../../redux/workout/create-ai";

const SelectedExerciseItem: FC<{
  ex: CustomCreateExerciseEntry;
  handleRemoveExercise(): void;
}> = ({ ex, handleRemoveExercise }) => {
  const dispatch = useAppDispatch();
  const { metrics } = useAppSelector(selectAiPlan);

  const handleUpdate = (
    type: "sets" | "reps" | "metricId" | "targetValue",
    value: string | number,
  ) => {
    const updateBody = {
      instanceId: ex.instanceId,
      [type]: value,
    };
    if (type === "metricId") {
      const metric = metrics.find((m) => m.id === value);
      if (metric) {
        updateBody["targetValue"] = metric.defaultValue.toString();
      }
    }
    dispatch(updateMetrics(updateBody));
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.topRow}>
        <Image
          source={{ uri: getImageUrl(ex?.thumbnail) }}
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
          <View style={styles.metricPicker}>
            {metrics.map((m) => (
              <TouchableOpacity
                key={m.id}
                onPress={() => handleUpdate("metricId", m.id)}
                style={[
                  styles.unitTab,
                  ex.metricId === m.id && styles.unitTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.unitTabText,
                    ex.metricId === m.id && styles.textBlack,
                  ]}
                >
                  {m.unitSymbol.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* WORKLOAD ROW - Sets x Reps @ Target */}
      <View style={styles.workloadRow}>
        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>SETS</Text>
          <TextInput
            style={styles.mainInput}
            value={ex.sets}
            onChangeText={(v) => handleUpdate("sets", v)}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#27272a"
          />
        </View>

        <Text style={styles.operator}>×</Text>

        <View style={styles.inputBox}>
          <Text style={styles.inputLabel}>REPS</Text>
          <TextInput
            style={styles.mainInput}
            value={ex.reps}
            onChangeText={(v) => handleUpdate("reps", v)}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#27272a"
          />
        </View>

        <Text style={styles.operator}>@</Text>

        <View style={[styles.inputBox, styles.targetBox]}>
          <Text style={styles.inputLabel}>TARGET</Text>
          <TextInput
            style={[styles.mainInput, { color: COLORS.mainBlue }]}
            value={ex.targetValue}
            onChangeText={(v) => handleUpdate("targetValue", v)}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#27272a"
          />
        </View>
        <Text style={styles.operator}>
          {metrics.find((m) => m.id === ex.metricId)?.unitSymbol}
        </Text>
      </View>
    </View>
  );
};

export default SelectedExerciseItem;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#09090b",
    borderRadius: 20,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#18181b",
  },
  topRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  exThumbnail: {
    width: 100, // Slightly smaller to prioritize text area
    height: 65,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  infoContent: {
    flex: 1,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    flex: 1,
  },
  deleteBtn: {
    padding: 4,
  },
  exMuscle: {
    color: "#52525b",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  metricPicker: {
    flexDirection: "row",
    marginTop: 8,
    gap: 4,
  },
  unitTab: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "#18181b",
  },
  unitTabActive: {
    backgroundColor: COLORS.mainBlue,
  },
  unitTabText: {
    fontSize: 8,
    fontWeight: "900",
    color: "#52525b",
  },
  textBlack: {
    color: "#000",
  },
  /* NEW WORKLOAD DESIGN */
  workloadRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 8,
    gap: 8,
  },
  inputBox: {
    flex: 1,
    alignItems: "center",
  },
  targetBox: {
    flex: 1.5, // Give target value more room
    borderLeftWidth: 1,
    borderLeftColor: "#18181b",
  },
  inputLabel: {
    color: "#3f3f46",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  mainInput: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
    height: 25,
    padding: 0,
    textAlign: "center",
  },
  operator: {
    color: "#27272a",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 10,
  },
});
