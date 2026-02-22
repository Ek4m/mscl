import React, { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FaIcons from "react-native-vector-icons/FontAwesome5";

import { COLORS } from "../../../constants/colors";
import { Exercise } from "../../workout/types";
import { MuscleGroupTitles } from "../../workout/vault";

const ExerciseAddItem: FC<{
  item: Exercise;
  onSelect(item: Exercise, variationId?: number): void;
  onClose(): void;
}> = ({ item, onSelect, onClose }) => {
  return (
    <TouchableOpacity
      style={styles.exItem}
      activeOpacity={0.7}
      onPress={() => {
        onSelect(item, item.variationId);
        onClose();
      }}
    >
      <View style={styles.leftContent}>
        <View style={styles.iconCircle}>
           <FaIcons name="dumbbell" size={14} color="#3f3f46" />
        </View>
        <View>
          <Text style={styles.exName}>{item.title}</Text>
          <View style={styles.muscleRow}>
            {item.primaryMuscles.map((m, idx) => (
               <Text key={m} style={styles.exMuscle}>
                 {MuscleGroupTitles[m]}{idx < item.primaryMuscles.length - 1 ? ' • ' : ''}
               </Text>
            ))}
          </View>
        </View>
      </View>
      
      <View style={styles.addBtn}>
         <FaIcons name="plus" size={12} color={COLORS.mainBlue} />
      </View>
    </TouchableOpacity>
  );
};

export default ExerciseAddItem;

const styles = StyleSheet.create({
  exItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#09090b",
    padding: 14,
    borderRadius: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#18181b",
  },
  leftContent: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconCircle: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  exName: { color: "#fff", fontSize: 15, fontWeight: "700" },
  muscleRow: { flexDirection: 'row', marginTop: 3 },
  exMuscle: { color: "#52525b", fontSize: 11, fontWeight: '600' },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#083344',
    justifyContent: 'center',
    alignItems: 'center'
  },
});