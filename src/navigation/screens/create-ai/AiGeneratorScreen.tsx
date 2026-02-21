import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CreateAiPlanParamList } from "./types";
import { COLORS } from "../../../constants/colors";
import { Gender, GymLevel } from "../../../modules/prediction/enums";
import SubmitButton from "../../../UI/components/submitButton";
import { useAppDispatch, useAppSelector } from "../../../redux/root";
import {
  selectAiPlan,
  setDays,
  setGender,
  setLevel,
  setWeeks,
} from "../../../redux/workout/create-ai";

const AiGeneratorScreen: React.FC<
  NativeStackScreenProps<CreateAiPlanParamList, "selectGender">
> = ({ navigation }) => {
  const { days, level, gender, weeks } = useAppSelector(selectAiPlan);
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
          {/* VISUAL GENDER SELECTION */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>SELECT YOUR IDENTITY</Text>
            <View style={styles.genderContainer}>
              {/* MALE CARD */}
              <TouchableOpacity
                onPress={() => dispatch(setGender(Gender.MALE))}
                style={[
                  styles.genderCard,
                  gender === Gender.MALE && styles.activeGenderCard,
                ]}
              >
                <FontAwesome5Icon
                  name="male"
                  size={50}
                  color={gender === Gender.MALE ? COLORS.mainBlue : "#444"}
                />
                <Text
                  style={[
                    styles.genderLabel,
                    gender === Gender.MALE && styles.activeGenderLabel,
                  ]}
                >
                  MALE
                </Text>
                {gender === Gender.MALE && (
                  <View style={styles.checkCircle}>
                    <FeatherIcon name="check" size={12} color="white" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => dispatch(setGender(Gender.FEMALE))}
                style={[
                  styles.genderCard,
                  gender === Gender.FEMALE && styles.activeGenderCard,
                ]}
              >
                <FontAwesome5Icon
                  name="female"
                  size={50}
                  color={gender === Gender.FEMALE ? COLORS.mainBlue : "#444"}
                />
                <Text
                  style={[
                    styles.genderLabel,
                    gender === Gender.FEMALE && styles.activeGenderLabel,
                  ]}
                >
                  FEMALE
                </Text>
                {gender === Gender.FEMALE && (
                  <View style={styles.checkCircle}>
                    <FeatherIcon name="check" size={12} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* FITNESS LEVEL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>FITNESS LEVEL</Text>
            <View style={styles.chipRow}>
              {Object.values(GymLevel).map((l) =>
                renderChip(l, level === l, () => dispatch(setLevel(l))),
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

  /* NEW GENDER CARD STYLES */
  genderContainer: {
    flexDirection: "row",
    gap: 15,
  },
  genderCard: {
    flex: 1,
    height: 200,
    backgroundColor: "#141414",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#222",
    position: "relative",
  },
  activeGenderCard: {
    borderColor: COLORS.mainBlue,
    backgroundColor: "rgba(0, 150, 255, 0.05)",
  },
  genderLabel: {
    marginTop: 10,
    color: "#555",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 1,
  },
  activeGenderLabel: {
    color: "white",
  },
  checkCircle: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: COLORS.mainBlue,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "#111",
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
