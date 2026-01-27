import React, { FC } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Controller, useForm } from "react-hook-form";

import { RootStackParamList } from "../types";
import { LoginCredentials } from "../../modules/auth/types";
import { useLoginMutation } from "../../redux/auth/slice";
import { ACCESS_TOKEN } from "../../constants/vault";
import { errorToast } from "../../helpers/toast";

import SubmitButton from "../../UI/components/submitButton";
import Link from "../../modules/auth/components/link";
import Input from "../../UI/form/input";

const AuthScreen: FC<NativeStackScreenProps<RootStackParamList, "auth">> = ({
  navigation,
}) => {
  const [login, { isLoading }] = useLoginMutation();
  const { control, getValues } = useForm<LoginCredentials>({
    defaultValues: {
      username: "Ek4m",
      password: "Salmanov99!",
    },
  });

  const onLogin = async () => {
    try {
      const values = getValues();
      const result = await login(values).unwrap();
      await AsyncStorage.setItem(ACCESS_TOKEN, result.token);
      setTimeout(() => {
        navigation.replace("home");
      });
    } catch (error: any) {
      errorToast(error.data.messages);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Enter your credentials to continue</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Username</Text>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value }, fieldState }) => (
            <Input
              placeholder="Ex: John123"
              value={value}
              onChangeText={onChange}
              {...fieldState}
            />
          )}
        />
        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value }, fieldState }) => (
            <Input
              placeholder="Password"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              {...fieldState}
            />
          )}
        />
        <SubmitButton loading={isLoading} title="Continue" onPress={onLogin} />
      </View>
      <Link title="Don't have an account? Sign up" screen="register" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 80,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  form: {
    marginTop: 40,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#444",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginLeft: 4,
    marginBottom: 8,
  },
});

export default AuthScreen;
