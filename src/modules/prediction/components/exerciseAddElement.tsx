import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import FaIcons from "react-native-vector-icons/FontAwesome5";

import { COLORS } from "../../../constants/colors";
import { Exercise } from "../../workout/types";
import { MuscleGroupTitles } from "../../workout/vault";

const ExerciseAddItem: FC<{
  item: Exercise;
  onSelect(item: Exercise): void;
  onClose(): void;
}> = ({ item, onSelect, onClose }) => {
  return (
    <TouchableOpacity
      style={styles.exItem}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      <View>
        <Text style={styles.exName}>{item.title}</Text>
        <Text style={styles.exMuscle}>
          {item.primaryMuscles.map((m) => MuscleGroupTitles[m]).join(", ")}
        </Text>
      </View>
      <FaIcons name="plus-circle" size={18} color={COLORS.mainBlue} />
    </TouchableOpacity>
  );
};

export default ExerciseAddItem;

const styles = StyleSheet.create({
  exItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#18181b",
  },
  exName: { color: COLORS.white, fontSize: 16, fontWeight: "600" },
  exMuscle: { color: "#52525b", fontSize: 12, marginTop: 2 },
});
