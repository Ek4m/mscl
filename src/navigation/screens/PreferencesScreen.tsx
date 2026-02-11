import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAppDispatch, useAppSelector } from "../../redux/root";
import {
  selectPredictions,
  setDays,
  setLevel,
} from "../../redux/workout/create-ai";
import { RootStackParamList } from "../types";
import { GymLevel } from "../../modules/prediction/enums";
import { COLORS } from "../../constants/colors";
import NumOfDaysSelect from "../../modules/prediction/components/numOfDaysSelect";
import SubmitButton from "../../UI/components/submitButton";

const PreferencesScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, "preferences">
> = ({ navigation }) => {
  const { level, days } = useAppSelector(selectPredictions);
  const dispatch = useAppDispatch();

  const onFinish = () => {
    navigation.navigate("previewPlan");
  };

  return (
    <View style={styles.screenWrapper}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Almost Done</Text>
          <Text style={styles.subtitle}>Tell us a bit about your goals.</Text>
          <View style={styles.sectionContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FITNESS LEVEL</Text>
              <View style={styles.row}>
                {[GymLevel.BEGINNER, GymLevel.INTERMEDIATE, GymLevel.PRO].map(
                  (l) => (
                    <TouchableOpacity
                      key={l}
                      onPress={() => dispatch(setLevel(l))}
                      activeOpacity={0.7}
                      style={[
                        styles.optionButton,
                        level === l
                          ? styles.activeButton
                          : styles.inactiveButton,
                      ]}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          level === l ? styles.activeText : styles.inactiveText,
                        ]}
                      >
                        {l}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>
            </View>
            <NumOfDaysSelect
              daysCount={days}
              setDaysCount={(val) => dispatch(setDays(val))}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <SubmitButton title="Create workout plan!" onPress={onFinish} />
        </View>
      </View>
    </View>
  );
};

export default PreferencesScreen;

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#09090b",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#71717a",
    marginBottom: 40,
  },
  sectionContainer: {
    gap: 32,
  },
  inputGroup: {
    gap: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#52525b",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: COLORS.mainBlue,
    borderColor: COLORS.mainBlue,
  },
  inactiveButton: {
    backgroundColor: "#18181b",
    borderColor: "#27272a",
  },
  buttonText: {
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  activeText: {
    color: "#000",
  },
  inactiveText: {
    color: "#a1a1aa",
  },
  footer: {
    marginTop: 20,
  },
});
