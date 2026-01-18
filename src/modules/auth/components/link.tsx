import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { RootStackParamList } from "../../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const Link: FC<{ title: string; screen: "auth" | "register" }> = ({
  screen,
  title,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handlePress = () => {
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
