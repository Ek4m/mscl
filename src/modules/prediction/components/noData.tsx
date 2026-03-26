import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";

import { COLORS } from "../../../constants/colors";

const NoData: FC<{ message: string }> = ({ message }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <FeatherIcon name="inbox" size={32} color={COLORS.mainBlue} />
      </View>
      <Text style={styles.title}>NO RESULTS</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default NoData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.black1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 8,
  },
  message: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
