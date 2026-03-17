import React, { FC, useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import FeatherIcon from "react-native-vector-icons/Feather";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

import { COLORS } from "../../constants/colors";
import { RootStackParamList } from "../types";
import { PremadePlan, PremadePlanWeek } from "../../modules/workout/types";
import {
  useGetExistingPlanRegistrationQuery,
  useRegisterPlanMutation,
} from "../../redux/plans/slice";
import SubmitButton from "../../UI/components/submitButton";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "../../UI/components/modal";

const PremadePlanDetailsScreen: FC<
  NativeStackScreenProps<RootStackParamList, "premadePlanDetails">
> = ({ route, navigation }) => {
  const plan: PremadePlan = route.params?.plan;

  const [isDescVisible, setIsDescVisible] = useState(false);
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(0);
  const activeWeek: PremadePlanWeek = plan.weeks[selectedWeekIdx];
  const { data: existingPlanRegistration, refetch } =
    useGetExistingPlanRegistrationQuery(plan.id);
  const isFirstRender = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      refetch();
    }, [refetch]),
  );
  const [registerPlan, { isLoading }] = useRegisterPlanMutation();

  const onRegisterPlan = useCallback(async () => {
    try {
      const result = await registerPlan({ planId: plan.id }).unwrap();
      navigation.navigate("planDetails", { id: result.id });
    } catch (err) {
      console.error("Failed to register plan:", err);
    }
  }, [plan.id, registerPlan]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ImageBackground source={{ uri: plan.thumbnail }} style={styles.hero}>
        <View style={styles.heroOverlay}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backCircle}
          >
            <FeatherIcon name="arrow-left" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      {existingPlanRegistration && (
        <View style={styles.warningRibbon}>
          <View style={styles.warningIconContent}>
            <FontAwesome5Icon
              name="exclamation-triangle"
              size={14}
              color={COLORS.black}
            />
            <Text style={styles.warningText}>
              You already have this plan in progress.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("planDetails", {
                id: existingPlanRegistration.id,
              });
            }}
          >
            <Text style={styles.resumeText}>RESUME</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.contentCard}>
        <Text style={styles.title}>{plan.title}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{plan.level.toUpperCase()}</Text>
          </View>
          <Text style={styles.durationText}>{plan.weeks.length} Weeks</Text>
          <TouchableOpacity onPress={() => setIsDescVisible((prev) => !prev)}>
            <FeatherIcon name="info" color={COLORS.white} size={15} />
          </TouchableOpacity>
        </View>
        <Modal
          onRequestClose={() => setIsDescVisible(false)}
          isVisible={isDescVisible}
        >
          <Text style={styles.description}>
            {plan.description ||
              "This elite program focuses on progressive overload across multiple planes of movement to maximize muscle fiber recruitment."}
          </Text>
        </Modal>
        <SubmitButton
          bgColor={existingPlanRegistration ? "grey" : COLORS.mainBlue}
          title={
            existingPlanRegistration ? "ALREADY ACTIVE" : "START THIS PROGRAM"
          }
          disabled={Boolean(existingPlanRegistration)}
          loading={isLoading}
          onPress={onRegisterPlan}
        />
        <View style={styles.divider} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekScroll}
        >
          {plan.weeks.map((_, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setSelectedWeekIdx(idx)}
              style={[
                styles.weekChip,
                selectedWeekIdx === idx && styles.activeWeekChip,
              ]}
            >
              <Text
                style={[
                  styles.weekChipText,
                  selectedWeekIdx === idx && styles.activeWeekChipText,
                ]}
              >
                WEEK {idx + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* DAYS LIST */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
            flex: 1,
          }}
        >
          {activeWeek.days.map((day, dIdx) => (
            <View key={day.id} style={styles.dayItem}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>
                  Day {dIdx + 1}: {day.title}
                </Text>
                <Text style={styles.exCount}>
                  {day.exercises.length} Exercises
                </Text>
              </View>
              <View style={styles.exercisePreview}>
                <Text style={styles.exNames} numberOfLines={1}>
                  {day.exercises.map((ex) => ex.variation.title).join(" • ")}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  hero: { height: 200, width: "100%" },
  heroOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", padding: 20 },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Warning Ribbon
  warningRibbon: {
    backgroundColor: COLORS.mainBlue,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  warningIconContent: { flexDirection: "row", alignItems: "center", gap: 8 },
  warningText: { color: COLORS.black, fontWeight: "700", fontSize: 12 },
  resumeText: {
    color: COLORS.black,
    fontWeight: "900",
    textDecorationLine: "underline",
    fontSize: 12,
  },

  contentCard: {
    flex: 1,
    backgroundColor: COLORS.black,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  title: { color: "white", fontSize: 26, fontWeight: "900" },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 8,
  },
  levelBadge: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
  },
  levelText: { color: COLORS.mainBlue, fontSize: 10, fontWeight: "bold" },
  durationText: { color: "#666", fontSize: 12, fontWeight: "bold" },
  description: {
    color: COLORS.black,
    fontSize: 14,
    lineHeight: 22,
    fontStyle: "italic",
    marginTop: 10,
    backgroundColor: "#e8e8e8cb",
    borderRadius: 10,
    padding: 20,
  },
  divider: { height: 1, backgroundColor: "#1a1a1a", marginVertical: 10 },
  weekScroll: {
    alignItems: "center",
    height: 35,
    marginBottom: 30,
  },
  weekChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.black1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  activeWeekChip: { backgroundColor: "white", borderColor: "white" },
  weekChipText: { color: "#666", fontWeight: "bold", fontSize: 12 },
  activeWeekChipText: { color: COLORS.black },

  dayItem: {
    backgroundColor: "#0a0a0a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayTitle: { color: "white", fontSize: 15, fontWeight: "700" },
  exCount: { color: COLORS.mainBlue, fontSize: 12, fontWeight: "bold" },
  exercisePreview: { marginTop: 8 },
  exNames: { color: "#444", fontSize: 12 },
});

export default PremadePlanDetailsScreen;
