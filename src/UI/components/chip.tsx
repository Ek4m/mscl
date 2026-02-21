import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { COLORS } from "../../constants/colors";

export type ChipType = "success" | "error" | "warning" | "info" | "neutral";

interface ChipProps {
  label: string;
  type?: ChipType;
  align?: "left" | "center" | "right";
  size?: "small" | "large" | "medium";
}

const Chip: React.FC<ChipProps> = ({
  label,
  type = "neutral",
  size = "small",
  align = "center",
}) => {
  return (
    <View
      style={[
        styles.container,
        typeStyles[type].container,
        {
          alignSelf:
            align === "left"
              ? "flex-start"
              : align === "right"
                ? "flex-end"
                : "center",
        },
      ]}
      pointerEvents="none"
    >
      <Text style={[styles.text, styles[size]]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  text: {
    color: COLORS.white,
    fontWeight: "600",
  },
  small: {
    fontSize: 8,
  },
  medium: {
    fontSize: 10,
  },
  large: {
    fontSize: 14,
  },
});
export default Chip;
const typeStyles: Record<ChipType, { container: ViewStyle }> = {
  success: {
    container: { backgroundColor: "#00a41b" },
  },
  error: {
    container: { backgroundColor: "#ae2525" },
  },
  warning: {
    container: { backgroundColor: "#e3d210" },
  },
  info: {
    container: { backgroundColor: COLORS.mainBlue },
  },
  neutral: {
    container: { backgroundColor: "#6b6b6b" },
  },
};
