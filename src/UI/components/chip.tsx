// Chip.tsx
import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { COLORS } from "../../constants/colors";

export type ChipType = "success" | "error" | "warning" | "info" | "neutral";

interface ChipProps {
  label: string;
  type?: ChipType;
}

const Chip: React.FC<ChipProps> = ({ label, type = "neutral" }) => {
  return (
    <View
      style={[styles.container, typeStyles[type].container]}
      pointerEvents="none"
    >
      <Text style={[styles.text, typeStyles[type].text]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 2,
    alignSelf: "flex-start",
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  text: {
    fontSize: 10,
    fontWeight: "600",
  },
});
export default Chip;
const typeStyles: Record<ChipType, { container: ViewStyle; text: TextStyle }> =
  {
    success: {
      container: { backgroundColor: "#dcfce7" },
      text: { color: "#166534" },
    },
    error: {
      container: { backgroundColor: "#fee2e2" },
      text: { color: "#991b1b" },
    },
    warning: {
      container: { backgroundColor: "#fef9c3" },
      text: { color: "#854d0e" },
    },
    info: {
      container: { backgroundColor: "#569fff68" },
      text: { color: COLORS.mainBlue },
    },
    neutral: {
      container: { backgroundColor: "#f3f4f6" },
      text: { color: "#374151" },
    },
  };
