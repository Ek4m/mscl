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
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";

import { RootStackParamList } from "../../types";
import {
  reset,
  selectAiPlan,
  useGeneratePlanMutation,
} from "../../../redux/workout/create-ai";
import { useAppSelector } from "../../../redux/root";
import { COLORS } from "../../../constants/colors";
import { CreateAiPlanParamList } from "./types";

type PreviewPlanProps = CompositeScreenProps<
  NativeStackScreenProps<CreateAiPlanParamList, "previewPlan">,
  NativeStackScreenProps<RootStackParamList>
>;

const PreviewPlanScreen: React.FC<PreviewPlanProps> = ({ navigation }) => {
  const [generateProgram, { isLoading }] = useGeneratePlanMutation();
  const { days, level, gender, weeks } = useAppSelector(selectAiPlan);

  useFocusEffect(
    useCallback(() => {
      generateProgram({
        level,
        numOfDays: days,
        gender,
        weeks,
      })
        .unwrap()
        .then((res) => {
          navigation.replace("planDetails", { id: res.id });
        });
    }, [level, days, generateProgram, weeks, gender]),
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Based on your gym equipment</Text>
      </View>
      {isLoading && (
        <ActivityIndicator size={"large"} color={COLORS.lightBlue} />
      )}
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
