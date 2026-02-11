import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../../navigation/types";

const Link: FC<{ title: string; screen: keyof RootStackParamList }> = ({
  screen,
  title,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handlePress = () => {
    //@ts-ignore
    navigation.navigate(screen);
  };
  return (
    <TouchableOpacity style={styles.linkContainer} onPress={handlePress}>
      <Text style={styles.link}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Link;

const styles = StyleSheet.create({
  linkContainer: {
    marginTop: 16,
  },
  link: {
    textAlign: "center",
    color: "gray",
  },
});
