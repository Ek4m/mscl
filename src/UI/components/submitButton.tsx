import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import React, { FC, ReactNode } from "react";
import { IS_SMALL } from "../../constants/vault";

const SubmitButton: FC<
  TouchableOpacityProps & {
    title: string;
    icon?: ReactNode;
    textColor?: string;
    bgColor?: string;
    loading?: boolean;
  }
> = ({
  onPress,
  title,
  bgColor,
  icon,
  textColor,
  loading,
  disabled,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={[
        styles.button,
        style,
        {
          backgroundColor: bgColor || "#fff",
          opacity: disabled || loading ? 0.5 : 1,
        },
      ]}
      onPress={onPress}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor || "#000"} />
      ) : (
        <>
          {icon && <View style={{ marginRight: 5 }}>{icon}</View>}
          <Text style={[styles.buttonText, { color: textColor || "#000" }]}>
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
    height: IS_SMALL ? 55 : 64,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: IS_SMALL ? 12 : 15,
    fontWeight: "bold",
  },
});
