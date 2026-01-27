import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import { COLORS } from "../../../constants/colors";

const NumOfDaysSelect: FC<{
  daysCount: number;
  setDaysCount(val: number): void;
}> = ({ daysCount, setDaysCount }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>Frequency (Days per week)</Text>
      <View style={styles.daysRow}>
        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
          <TouchableOpacity
            key={num}
            onPress={() => setDaysCount(num)}
            style={[
              styles.dayBadge,
              daysCount === num && styles.dayBadgeActive,
            ]}
          >
            <Text
              style={[
                styles.dayBadgeText,
                daysCount === num && styles.textBlack,
              ]}
            >
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default NumOfDaysSelect;

const styles = StyleSheet.create({
  section: { marginBottom: 25 },
  label: {
    color: "#71717a",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  listWrapper: {
    marginVertical: 10,
    gap: 10,
  },
  daysRow: { flexDirection: "row", justifyContent: "space-between" },
  dayBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#18181b",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  dayBadgeActive: {
    backgroundColor: COLORS.mainBlue,
    borderColor: COLORS.mainBlue,
  },
  dayBadgeText: { color: "#71717a", fontWeight: "bold" },
  textBlack: { color: "#000" },
});
