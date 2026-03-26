import React, { useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { CreateAiPlanParamList } from "./types";
import { COLORS } from "../../../constants/colors";
import { GymLevel } from "../../../modules/prediction/enums";
import SubmitButton from "../../../UI/components/submitButton";

import { useAppDispatch, useAppSelector } from "../../../redux/root";
import {
  selectAiPlan,
  setCategory,
  setDays,
  setGender,
  setLevel,
  setWeeks,
} from "../../../redux/workout/create-ai";
import GenderSelection from "../../../modules/prediction/components/genderSelection";

const AiGeneratorScreen: React.FC<
  NativeStackScreenProps<CreateAiPlanParamList, "selectGender">
> = ({ navigation }) => {
  const { days, level, gender, weeks, category, exerciseTypes } =
    useAppSelector(selectAiPlan);
  const dispatch = useAppDispatch();

  const renderChip = (
    label: string | number,
    isSelected: boolean,
    onPress: () => void,
  ) => (
    <TouchableOpacity
      onPress={onPress}
      key={label}
      style={[styles.chip, isSelected && styles.activeChip]}
    >
      <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
        {String(label).toUpperCase()}
      </Text>
    </TouchableOpacity>
  );

  const onSubmit = useCallback(() => {
    Alert.alert("Proceeding...", "Are you sure to continue?", [
      {
        isPreferred: true,
        onPress: () => {
          navigation.navigate("previewPlan");
        },
        text: "Proceed!",
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  }, []);

  useEffect(() => {
    if (exerciseTypes.length) dispatch(setCategory(exerciseTypes[0].id));
  }, [exerciseTypes]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.miniHero}>
          <Text style={styles.heroBadgeText}>PLAN GENERATOR</Text>
          <Text style={styles.heroTitle}>
            CONFIGURE YOUR <Text style={styles.highlightText}>PATH</Text>
          </Text>
        </View>

        <View style={styles.configSection}>
          <GenderSelection
            gender={gender}
            onChange={(g) => dispatch(setGender(g))}
          />
          <View style={styles.inputGroup}>
            <Text style={styles.label}>FITNESS LEVEL</Text>
            <View style={styles.chipRow}>
              {Object.values(GymLevel).map((l) =>
                renderChip(l, level === l, () => dispatch(setLevel(l))),
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CATEGORY</Text>
            <View style={styles.chipRow}>
              {exerciseTypes.map((type) =>
                renderChip(type.title, category === type.id, () =>
                  dispatch(setCategory(type.id)),
                ),
              )}
            </View>
          </View>

          {/* DAYS PER WEEK */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>DAYS PER WEEK</Text>
            <View style={styles.chipRow}>
              {[2, 3, 4, 5, 6].map((d) =>
                renderChip(d, days === d, () => dispatch(setDays(d))),
              )}
            </View>
          </View>

          {/* PLAN DURATION */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>PLAN DURATION</Text>
            <View style={styles.chipRow}>
              {[4, 8, 12].map((w) =>
                renderChip(`${w} Weeks`, weeks === w, () =>
                  dispatch(setWeeks(w)),
                ),
              )}
            </View>
          </View>

          {/* ACTION BUTTON */}
          <View style={styles.aiActionCard}>
            <View style={styles.planHeader}>
              <View style={styles.iconCircle}>
                <FontAwesome5Icon
                  name="robot"
                  size={18}
                  color={COLORS.mainBlue}
                />
              </View>
              <View>
                <Text style={styles.planTitle}>AI ENGINE</Text>
                <Text style={styles.planSub}>
                  Ready to forge your custom program
                </Text>
              </View>
            </View>
            <SubmitButton
              onPress={onSubmit}
              textColor={COLORS.white}
              bgColor={COLORS.mainBlue}
              title="GENERATE MY PLAN"
              icon={<FeatherIcon name="zap" size={18} color={COLORS.white} />}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  miniHero: { paddingHorizontal: 25, paddingTop: 60 },
  heroBadgeText: {
    color: COLORS.mainBlue,
    fontWeight: "bold",
    letterSpacing: 2,
    fontSize: 12,
    marginBottom: 10,
  },
  heroTitle: {
    color: "white",
    fontSize: 32,
    fontWeight: "900",
    fontStyle: "italic",
  },
  highlightText: { color: COLORS.mainBlue },

  configSection: { padding: 20 },
  inputGroup: { marginBottom: 30 },
  label: {
    color: "#666",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 15,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#141414",
    borderWidth: 1,
    borderColor: "#222",
  },
  activeChip: {
    borderColor: COLORS.mainBlue,
    backgroundColor: "rgba(0, 150, 255, 0.1)",
  },
  chipText: { color: "#888", fontWeight: "600", fontSize: 14 },
  activeChipText: { color: "white" },

  aiActionCard: {
    backgroundColor: COLORS.black1,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 25,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0f191a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(22, 245, 249, 0.2)",
  },
  planTitle: { color: "white", fontSize: 16, fontWeight: "900" },
  planSub: { color: "#666", fontSize: 12 },
  generateBtn: {
    backgroundColor: COLORS.mainBlue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 16,
    gap: 10,
  },
  generateBtnText: { color: "white", fontWeight: "800", fontSize: 14 },
});

export default AiGeneratorScreen;
