import React, { FC } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text, StyleSheet } from "react-native";

import { RootStackParamList } from "../types";
import SubmitButton from "../../UI/components/submitButton";
import Link from "../../modules/auth/components/link";
import { COLORS } from "../../constants/colors";

const OnboardingScreen: FC<
  NativeStackScreenProps<RootStackParamList, "onboarding">
> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.heading}>
          Create workouts that match{" "}
          <Text style={styles.highlight}>YOUR gym</Text>
        </Text>
        <Text style={styles.subheading}>
          Upload photos of your gym equipment and we'll build the perfect
          science-based plan for you.
        </Text>
      </View>

      <View style={styles.bottom}>
        <SubmitButton
          bgColor={COLORS.mainBlue}
          onPress={() => navigation.navigate("register")}
          title="Get Started"
        />
        <Link title="Already have an account?" screen="auth" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: "space-between",
    backgroundColor: "#000",
  },
  top: {
    marginTop: 60,
  },
  heading: {
    fontSize: 48,
    fontWeight: "900",
    color: "#fff",
    lineHeight: 56,
  },
  highlight: {
    color: "#22d3ee",
  },
  subheading: {
    marginTop: 24,
    fontSize: 18,
    color: "#888",
    lineHeight: 26,
  },
  bottom: {
    marginBottom: 40,
  },
});

export default OnboardingScreen;
