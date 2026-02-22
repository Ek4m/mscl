import React, { FC, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import FaIcons from "react-native-vector-icons/FontAwesome5";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CompositeScreenProps } from "@react-navigation/native";

import { CreateCustomPlanParamList } from "./types";
import {
  selectCreatePlanState,
  setTitle,
  useSubmitCustomPlanMutation,
} from "../../../redux/workout/create-plan";
import { useAppDispatch, useAppSelector } from "../../../redux/root";

import { errorToast, successToast } from "../../../helpers/toast";
import { COLORS } from "../../../constants/colors";

import Input from "../../../UI/form/input";
import SubmitButton from "../../../UI/components/submitButton";
import { RootStackParamList } from "../../types";

type PreviewPlanProps = CompositeScreenProps<
  NativeStackScreenProps<CreateCustomPlanParamList, "inspectPlan">,
  NativeStackScreenProps<RootStackParamList>
>;

const PlanReviewScreen: FC<PreviewPlanProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [submit, { isLoading }] = useSubmitCustomPlanMutation();
  const { plan, title, weeksCount, daysPerWeek } = useAppSelector(
    selectCreatePlanState,
  );

  // Filter out any weeks/days that have no exercises to keep the summary clean
  const summarizedPlan = useMemo(() => {
    return plan
      .map((week) => ({
        ...week,
        days: week.days.filter(
          (s) => s.exercises.length > 0 && s.dayIndex <= daysPerWeek,
        ),
      }))
      .filter((week) => week.days.length > 0);
  }, [plan, daysPerWeek]);

  const onSubmit = async () => {
    if (!title.trim()) return errorToast(["Please enter a program name"]);

    try {
      const response = await submit({
        title,
        weeksCount,
        daysPerWeek,
        plan,
      }).unwrap();
      successToast("Plan created successfully!");
      navigation.replace("planDetails", { id: response.id });
    } catch (error: any) {
      errorToast(error.data?.messages || ["Failed to create plan"]);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <FaIcons name="chevron-left" size={16} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Program</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* PROGRAM NAMING */}
        <View style={styles.section}>
          <Text style={styles.label}>PROGRAM NAME</Text>
          <Input
            placeholder="e.g. Hypertrophy Phase 1"
            value={title}
            onChangeText={(v) => dispatch(setTitle(v))}
          />
        </View>

        {/* STATS OVERVIEW */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{weeksCount}</Text>
            <Text style={styles.statLab}>WEEKS</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{daysPerWeek}</Text>
            <Text style={styles.statLab}>DAYS/WK</Text>
          </View>
        </View>

        {/* HIERARCHICAL SCHEDULE */}
        <View style={styles.section}>
          <Text style={styles.label}>INSPECT SCHEDULE</Text>

          {summarizedPlan.length === 0 ? (
            <Text style={styles.emptyText}>No exercises added yet.</Text>
          ) : (
            summarizedPlan.map((week) => (
              <View key={week.weekNumber} style={styles.weekContainer}>
                <View style={styles.weekHeader}>
                  <Text style={styles.weekTitle}>WEEK {week.weekNumber}</Text>
                </View>

                {week.days.map((session) => (
                  <View key={session.dayIndex} style={styles.dayCard}>
                    <View style={styles.dayHeader}>
                      <Text style={styles.dayText}>Day {session.dayIndex}</Text>
                      <Text style={styles.exerciseCount}>
                        {session.exercises.length} Exercises
                      </Text>
                    </View>

                    {session.exercises.map((ex) => (
                      <View key={ex.instanceId} style={styles.exerciseRow}>
                        <View style={styles.dot} />
                        <View style={styles.exInfo}>
                          <Text style={styles.exName}>{ex.name}</Text>
                          <Text style={styles.exMeta}>
                            {ex.sets} sets × {ex.reps} reps
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* FOOTER ACTION */}
      <View style={styles.footer}>
        <SubmitButton
          bgColor={COLORS.mainBlue}
          loading={isLoading}
          title="CONFIRM & CREATE"
          onPress={onSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#09090b",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "900" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },

  section: { marginTop: 20 },
  label: {
    color: COLORS.mainBlue,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 15,
  },

  statsRow: { flexDirection: "row", gap: 12, marginTop: 10 },
  statBox: {
    flex: 1,
    backgroundColor: "#09090b",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#18181b",
  },
  statVal: { color: "#fff", fontSize: 18, fontWeight: "900" },
  statLab: { color: "#3f3f46", fontSize: 10, fontWeight: "bold", marginTop: 4 },

  weekContainer: { marginBottom: 25 },
  weekHeader: { marginBottom: 12, paddingLeft: 5 },
  weekTitle: { color: "#fff", fontSize: 14, fontWeight: "900", opacity: 0.5 },

  dayCard: {
    backgroundColor: "#09090b",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#18181b",
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#18181b",
    paddingBottom: 10,
  },
  dayText: { color: COLORS.white, fontWeight: "800", fontSize: 15 },
  exerciseCount: { color: COLORS.mainBlue, fontSize: 11, fontWeight: "700" },

  exerciseRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#27272a",
    marginRight: 12,
  },
  exInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exName: { color: "#d4d4d8", fontSize: 14, fontWeight: "600", flex: 1 },
  exMeta: { color: "#71717a", fontSize: 12, fontWeight: "500" },

  emptyText: { color: "#3f3f46", textAlign: "center", marginTop: 20 },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
});

export default PlanReviewScreen;
