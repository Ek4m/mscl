import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC } from "react";
import FaIcons from "react-native-vector-icons/FontAwesome5";

import { COLORS } from "../../../constants/colors";
import { CustomExercise } from "../../workout/types";
import Chip from "../../../UI/components/chip";
import { MuscleGroup, MuscleGroupTitles } from "../../workout/vault";
import { useAppDispatch } from "../../../redux/root";
import { updateMetrics } from "../../../redux/workout/create-plan";

const SelectedExerciseItem: FC<{
  ex: CustomExercise;
  handleRemoveExercise(): void;
}> = ({ ex, handleRemoveExercise }) => {
  const dispatch = useAppDispatch();
  return (
    <View style={styles.cardContainer}>
      <View style={styles.topSection}>
        <Image
          source={{
            uri: "https://liftmanual.com/wp-content/uploads/2023/04/barbell-full-squat.jpg",
          }}
          style={styles.exThumbnail}
          resizeMode="cover"
        />

        <View style={styles.headerText}>
          <Text style={styles.exName} numberOfLines={2}>
            {ex.name}
          </Text>
          <View style={styles.muscleBadge}>
            {ex.muscle?.map((e: MuscleGroup) => (
              <Chip type="info" label={MuscleGroupTitles[e]} key={e} />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomSection}>
        <View style={styles.inputGroup}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>SETS</Text>
            <TextInput
              style={styles.setRepInput}
              placeholder="4"
              value={ex.sets}
              onChangeText={(v) =>
                dispatch(updateMetrics({ id: ex.id, sets: v }))
              }
              placeholderTextColor="#52525b"
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.multiplier}>×</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>REPS</Text>
            <TextInput
              style={styles.setRepInput}
              placeholder="12"
              placeholderTextColor="#52525b"
              value={ex.reps}
              onChangeText={(v) =>
                dispatch(updateMetrics({ id: ex.id, reps: v }))
              }
              keyboardType="numeric"
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={handleRemoveExercise}
          style={styles.deleteAction}
        >
          <FaIcons name="trash" size={12} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectedExerciseItem;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#1c1c1e",
    borderRadius: 20,
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#2c2c2e",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  exThumbnail: {
    width: 100,
    height: 60,
    borderWidth: 2,
    borderColor: COLORS.lightBlue,
    borderRadius: 12,
    backgroundColor: "#2c2c2e",
  },
  headerText: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  exName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
    lineHeight: 20,
  },
  muscleBadge: {
    marginTop: 6,
    flexDirection: "row",
    gap: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  exMuscleTag: {
    color: COLORS.mainBlue,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  deleteAction: {
    padding: 10,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#2c2c2e",
    marginVertical: 6,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#09090b",
    borderRadius: 10,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  inputLabel: {
    color: "#71717a",
    fontSize: 9,
    fontWeight: "800",
    marginRight: 4,
  },
  setRepInput: {
    width: 40,
    height: 36,
    color: COLORS.white,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
  multiplier: {
    color: "#52525b",
    fontSize: 18,
    fontWeight: "300",
  },
  weightHint: {
    backgroundColor: "#27272a",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  hintText: {
    color: "#a1a1aa",
    fontSize: 11,
    fontWeight: "500",
  },
});
