import React, { FC, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types";
import { selectUserInfo } from "../../redux/auth/slice";
import { useAppSelector } from "../../redux/root";
import { useGetInitialInfoQuery } from "../../redux/workout/slice";

const SplashScreen: FC<
  NativeStackScreenProps<RootStackParamList, "splash">
> = ({ navigation }) => {
  const { userInfo, isFetching } = useAppSelector(selectUserInfo);
  useGetInitialInfoQuery();

  useFocusEffect(
    useCallback(() => {
      if (!isFetching) {
        setTimeout(() => {
          navigation.navigate(userInfo ? "home" : "onboarding");
        }, 1000);
      }
    }, [isFetching, userInfo, navigation]),
  );

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logoIcon}>💪</Text>
      </View>
      <Text style={styles.title}>GymSnap</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  logoBox: {
    width: 100,
    height: 100,
    backgroundColor: "#22d3ee",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#22d3ee",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    marginTop: 24,
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
  },
});

export default SplashScreen;
