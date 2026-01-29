import React, { FC, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import FaIcons from "react-native-vector-icons/FontAwesome5";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { COLORS } from "../../constants/colors";
import { RootStackParamList } from "../types";
import { CustomDayPlan, CustomExercise } from "../../modules/workout/types";

import { useAppDispatch, useAppSelector } from "../../redux/root";
import {
  selectCreatePlanState,
  setTitle,
  useSubmitCustomPlanMutation,
} from "../../redux/workout/create-plan";

import SubmitButton from "../../UI/components/submitButton";
import Input from "../../UI/form/input";
import { errorToast, successToast } from "../../helpers/toast";

const PlanReviewScreen: FC<NativeStackScreenProps<RootStackParamList>> = ({
  navigation,
}) => {
  const [submit, { isLoading }] = useSubmitCustomPlanMutation();
  const { plan, title } = useAppSelector(selectCreatePlanState);
  const dispatch = useAppDispatch();

  const filledPlanDays = useMemo(() => {
    return plan.filter((p) => Boolean(p.exercises.length));
  }, [plan]);

  const onSubmit = async () => {
    try {
      const result = await submit({ plan, title }).unwrap();
      successToast("Plan created successfully!");
      navigation.navigate("planDetails", { id: result.newPlan.id });
    } catch (error: any) {
      errorToast(error.data.messages);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FaIcons name="chevron-left" size={20} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Plan</Text>
        <View style={{ width: 20 }} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Step 1: Naming */}
        <View style={styles.section}>
          <Text style={styles.label}>PROGRAM NAME</Text>
          <Input
            placeholder="e.g. Summer Shred 2026"
            value={title}
            onChangeText={(v) => dispatch(setTitle(v))}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>INSPECT SCHEDULE</Text>
          {filledPlanDays.map((day: CustomDayPlan, index: number) => (
            <View key={index} style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayText}>
                  Day {day.dayNumber || index + 1}
                </Text>
                <Text style={styles.exerciseCount}>
                  {day.exercises.length} Exercises
                </Text>
              </View>

              {day.exercises?.map((ex: CustomExercise, exIdx: number) => (
                <View key={ex.id || exIdx} style={styles.exerciseRow}>
                  <Text style={styles.bullet}>•</Text>
                  <View style={styles.exerciseNameContainer}>
                    <Text style={styles.exerciseName}>{ex.name}</Text>
                    <Text style={styles.exerciseName}>
                      {ex.sets} x {ex.reps}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      <SubmitButton
        loading={isLoading}
        bgColor={COLORS.mainBlue}
        title="Confirm & Create"
        onPress={onSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingBottom: 10,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  scrollContent: {},
  section: { marginBottom: 30 },
  label: {
    color: COLORS.mainBlue,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  dayCard: {
    backgroundColor: "#09090b",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#18181b",
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#18181b",
    paddingBottom: 8,
  },
  dayText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  exerciseCount: { color: "#71717a", fontSize: 12 },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  bullet: { color: COLORS.mainBlue, marginRight: 8, fontSize: 18 },
  exerciseName: { color: "#d4d4d8", fontSize: 14 },
  exerciseNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
});

export default PlanReviewScreen;
