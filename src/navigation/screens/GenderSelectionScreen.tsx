import React, { FC, useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import GenderSelection from "../../modules/prediction/components/genderSelection";
import SubmitButton from "../../UI/components/submitButton";

import { Gender } from "../../modules/prediction/enums";
import { RootStackParamList } from "../types";
import { COLORS } from "../../constants/colors";

import { useAppDispatch, useAppSelector } from "../../redux/root";
import { selectUserInfo, setUserGender } from "../../redux/auth/slice";

const GenderSelectionScreen: FC<
  NativeStackScreenProps<RootStackParamList, "genderSelection">
> = ({ navigation }) => {
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const { userInfo } = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();

  const onContinue = useCallback(async () => {
    dispatch(setUserGender(gender));
    setTimeout(() => {
      navigation.navigate(userInfo ? "home" : "auth");
    }, 1000);
  }, [userInfo]);

  return (
    <View style={styles.container}>
      <GenderSelection gender={gender} onChange={setGender} />
      <SubmitButton
        title="Continue"
        onPress={onContinue}
        bgColor={COLORS.mainBlue}
      />
    </View>
  );
};

export default GenderSelectionScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    padding: 30,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
  },
});
