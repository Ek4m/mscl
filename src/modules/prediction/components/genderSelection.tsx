import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import FeatherIcon from "react-native-vector-icons/Feather";

import { COLORS } from "../../../constants/colors";
import { Gender } from "../enums";

const GenderSelection: FC<{
  onChange(val: Gender): void;
  gender: Gender;
}> = ({ gender, onChange }) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>SELECT YOUR IDENTITY</Text>
      <View style={styles.genderContainer}>
        {/* MALE CARD */}
        <TouchableOpacity
          onPress={() => onChange(Gender.MALE)}
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
          onPress={() => onChange(Gender.FEMALE)}
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
  );
};

export default GenderSelection;

const styles = StyleSheet.create({
  inputGroup: { marginBottom: 30, width: "100%" },
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
  label: {
    color: "#666",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 15,
  },
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
});
