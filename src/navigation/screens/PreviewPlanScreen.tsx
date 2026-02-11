import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import { RootStackParamList } from "../types";
import PlanList from "../../modules/prediction/components/planList";
import {
  selectPredictions,
  useGeneratePlanMutation,
} from "../../redux/workout/create-ai";
import { useAppSelector } from "../../redux/root";
import { COLORS } from "../../constants/colors";
import Chip from "../../UI/components/chip";
import SubmitButton from "../../UI/components/submitButton";
import Link from "../../modules/auth/components/link";

const PreviewPlanScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, "previewPlan">
> = ({ navigation }) => {
  const [generateProgram, { isLoading, isSuccess, data }] =
    useGeneratePlanMutation();
  const { days, level, selectedPredictions } =
    useAppSelector(selectPredictions);

    useFocusEffect(
    useCallback(() => {
      generateProgram({
        equipments: selectedPredictions,
        level,
        numOfDays: days,
      });
    }, [selectedPredictions, level, days, generateProgram]),
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{data?.title}</Text>
        <Chip size="large" label={level.toUpperCase()} type={"info"} />
        <Text style={styles.subtitle}>Based on your gym equipment</Text>
      </View>
      {isLoading && <ActivityIndicator color={COLORS.lightBlue} />}
      {data && isSuccess && <PlanList plan={data} />}
      <SubmitButton
        onPress={() =>
          navigation.navigate("planDetails", { id: data?.id || 0 })
        }
        bgColor={COLORS.lightBlue}
        title="Start workout!"
      />
      <Link screen="home" title="Use this plan later" />
    </View>
  );
};

export default PreviewPlanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#09090b",
    paddingTop: Platform.OS === "ios" ? 60 : StatusBar?.currentHeight || 0,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#71717a",
    fontWeight: "500",
  },
});
