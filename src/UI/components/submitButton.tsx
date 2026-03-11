import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import React, { FC, ReactNode } from "react";
import { IS_SMALL } from "../../constants/vault";
import { COLORS } from "../../constants/colors";

// Define our variants
type ButtonVariant = "default" | "outlined" | "titleOnly";

interface SubmitButtonProps extends TouchableOpacityProps {
  title: string;
  icon?: ReactNode;
  textColor?: string;
  bgColor?: string;
  loading?: boolean;
  variant?: ButtonVariant; // Added variant prop
}

const SubmitButton: FC<SubmitButtonProps> = ({
  onPress,
  title,
  bgColor,
  icon,
  textColor,
  loading,
  disabled,
  style,
  variant = "default", // Defaulting to 'default'
  ...props
}) => {
  // Logic to determine styles based on variant
  const getVariantContainerStyle = (): ViewStyle => {
    switch (variant) {
      case "outlined":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: textColor || COLORS.white,
        };
      case "titleOnly":
        return {
          backgroundColor: "transparent",
          height: "auto", // Let it shrink to text size if needed
          paddingVertical: 10,
        };
      default:
        return {
          backgroundColor: bgColor || COLORS.white,
        };
    }
  };

  const finalTextColor =
    variant === "default"
      ? textColor || COLORS.black
      : textColor || COLORS.white;

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      activeOpacity={0.5}
      style={[
        styles.button,
        getVariantContainerStyle(),
        { opacity: disabled || loading ? 0.5 : 1 },
        style,
      ]}
      onPress={onPress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={finalTextColor} />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.buttonText, { color: finalTextColor }]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({
  button: {
    height: IS_SMALL ? 48 : 55,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: IS_SMALL ? 12 : 14, // Bumped slightly for readability
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
