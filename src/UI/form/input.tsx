import { StyleSheet, TextInput, TextInputProps } from "react-native";
import React, { FC } from "react";
import { COLORS } from "../../constants/colors";

const Input: FC<TextInputProps> = ({ style, ...props }) => {
  return (
    <TextInput style={styles.input} {...props} placeholderTextColor="#444" />
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#222",
    height: 64,
    borderRadius: 20,
    paddingHorizontal: 20,
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 20,
  },
});
