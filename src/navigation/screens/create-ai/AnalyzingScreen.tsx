import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useEffect, FC } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

import { CreateAiPlanParamList } from "./types";

import {
  addToSelected,
  closeAnalyzing,
  selectAiPlan,
} from "../../../redux/workout/create-ai";
import { COLORS } from "../../../constants/colors";
import { useAppDispatch, useAppSelector } from "../../../redux/root";

const AnalyzingScreen: FC<
  NativeStackScreenProps<CreateAiPlanParamList, "analyzing">
> = ({ navigation }) => {
  const [message, setMessage] = useState("Scanning equipment...");
  const dispatch = useAppDispatch();
  const { predictions, isFetching } = useAppSelector(selectAiPlan);

  useEffect(() => {
    const messages = [
      "Scanning equipment...",
      "Identifying variations...",
      "Optimizing workout logic...",
      "Almost ready...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setMessage(messages[i]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (predictions && predictions.length > 0) {
      dispatch(closeAnalyzing());
      dispatch(addToSelected(predictions));
      navigation.replace("confirmEquipments", { predictions });
    }
  }, [isFetching, navigation, predictions, dispatch]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.lightBlue} />
      <Text style={styles.title}>{message}</Text>
      <Text style={styles.subtitle}>
        This usually takes about 20 seconds. We're building something unique for
        you.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  title: {
    marginTop: 32,
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default AnalyzingScreen;
