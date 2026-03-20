import React, { FC, useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Controller, useForm } from "react-hook-form";
import FontAwesome5Icons from "react-native-vector-icons/FontAwesome5";

import { RootStackParamList } from "../types";
import { COLORS } from "../../constants/colors";
import Input from "../../UI/form/input";
import SubmitButton from "../../UI/components/submitButton";
import Link from "../../modules/auth/components/link";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../../redux/auth/slice";
import { ForgotPasswordCredentials } from "../../modules/auth/types";
import { errorToast } from "../../helpers/toast";

type Phase = "EMAIL" | "RESET" | "SUCCESS";

const ForgotPasswordScreen: FC<
  NativeStackScreenProps<RootStackParamList, "forgotPassword">
> = ({ navigation }) => {
  const [phase, setPhase] = useState<Phase>("EMAIL");
  const [forgotPassword, { isLoading: isForgotLoading }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetLoading }] =
    useResetPasswordMutation();

  const formMethods = useForm<ForgotPasswordCredentials>({
    defaultValues: {
      email: "",
      newPassword: "",
      newPasswordRetyped: "",
      token: "",
    },
  });

  const { control, handleSubmit, reset } = formMethods;

  const onSendCode = async (data: ForgotPasswordCredentials) => {
    const { email } = data;
    try {
      const response = await forgotPassword(email).unwrap();
      setPhase("RESET");
    } catch (e: any) {
      errorToast(e.data.messages);
    }
  };

  const onResetPassword = async (data: ForgotPasswordCredentials) => {
    try {
      const response = await resetPassword(data).unwrap();
      setPhase("SUCCESS");
    } catch (e: any) {
      errorToast(e.data.messages);
    }
  };

  useEffect(
    useCallback(() => {
      return () => reset();
    }, []),
  );

  const renderPhase = () => {
    switch (phase) {
      case "EMAIL":
        return (
          <>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email to receive a reset code
            </Text>
            <View style={styles.form}>
              <Text style={styles.label}>Email Address</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value }, fieldState }) => (
                  <Input
                    placeholder="example@gmail.com"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    {...fieldState}
                  />
                )}
              />
              <SubmitButton
                loading={isForgotLoading}
                title="Send Code"
                onPress={handleSubmit(onSendCode)}
              />
            </View>
          </>
        );

      case "RESET":
        return (
          <>
            <Text style={styles.title}>New Password</Text>
            <Text style={styles.subtitle}>
              Enter the code from Gmail and your new password
            </Text>
            <View style={styles.form}>
              <Text style={styles.label}>Verification Code</Text>
              <Controller
                control={control}
                name="token"
                render={({ field: { onChange, value }, fieldState }) => (
                  <Input
                    placeholder="123456"
                    value={value}
                    onChangeText={onChange}
                    {...fieldState}
                  />
                )}
              />

              <Text style={styles.label}>New Password</Text>
              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, value }, fieldState }) => (
                  <Input
                    placeholder="New Password"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    {...fieldState}
                  />
                )}
              />

              <Text style={styles.label}>Confirm Password</Text>
              <Controller
                control={control}
                name="newPasswordRetyped"
                render={({ field: { onChange, value }, fieldState }) => (
                  <Input
                    placeholder="Retype Password"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    {...fieldState}
                  />
                )}
              />

              <SubmitButton
                loading={isResetLoading}
                title="Update Password"
                onPress={handleSubmit(onResetPassword)}
              />
            </View>
          </>
        );

      case "SUCCESS":
        return (
          <View style={styles.centerContent}>
            <FontAwesome5Icons
              name="check-circle"
              color={COLORS.white}
              size={100}
            />
            <Text style={styles.title}>All Set!</Text>
            <Text style={styles.subtitle}>
              Your password has been successfully changed.
            </Text>
            <View style={{ marginTop: 32, width: "100%" }}>
              <SubmitButton
                title="Back to Login"
                onPress={() => navigation.navigate("auth")}
              />
            </View>
          </View>
        );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {renderPhase()}
      {phase !== "SUCCESS" && (
        <View style={{ marginTop: 20 }}>
          <Link title="Back to Login" screen="auth" />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 80,
    backgroundColor: COLORS.black,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
    marginTop: 40,
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
    marginTop: 16,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
});

export default ForgotPasswordScreen;
