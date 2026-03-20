import React, { FC, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Controller, useForm } from "react-hook-form";

import { RootStackParamList } from "../types";
import { COLORS } from "../../constants/colors";
import Input from "../../UI/form/input";
import SubmitButton from "../../UI/components/submitButton";
import { errorToast } from "../../helpers/toast";
import { ChangePasswordCredentials } from "../../modules/auth/types";
import { useChangePasswordMutation } from "../../redux/auth/slice";

const ResetPasswordScreen: FC<
  NativeStackScreenProps<RootStackParamList, "resetPassword">
> = ({ navigation }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const { control, handleSubmit } = useForm<ChangePasswordCredentials>({
    defaultValues: {
      password: "",
      newPassword: "",
      newPasswordRetyped: "",
    },
  });

  const onUpdatePassword = async (data: ChangePasswordCredentials) => {
    if (data.newPassword !== data.newPasswordRetyped) {
      return errorToast(["Passwords do not match"]);
    }
    try {
      await changePassword(data).unwrap();
      setIsSuccess(true);
    } catch (error: any) {
      errorToast(error.data?.messages || ["Failed to update password"]);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {!isSuccess ? (
        <>
          <Text style={styles.title}>Security</Text>
          <Text style={styles.subtitle}>
            Update your password to keep your account secure
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Current Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value }, fieldState }) => (
                <Input
                  placeholder="Enter current password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
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
                  placeholder="Minimum 8 characters"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  {...fieldState}
                />
              )}
            />

            <Text style={styles.label}>Confirm New Password</Text>
            <Controller
              control={control}
              name="newPasswordRetyped"
              render={({ field: { onChange, value }, fieldState }) => (
                <Input
                  placeholder="Retype new password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  {...fieldState}
                />
              )}
            />

            <View style={{ marginTop: 24 }}>
              <SubmitButton
                loading={isLoading}
                title="Update Password"
                onPress={handleSubmit(onUpdatePassword)}
              />
            </View>
          </View>
        </>
      ) : (
        <View style={styles.centerContent}>
          <Text style={styles.successIcon}>🛡️</Text>
          <Text style={styles.title}>Password Updated</Text>
          <Text style={styles.subtitle}>
            Your security settings have been saved.
          </Text>
          <View style={{ marginTop: 40, width: "100%" }}>
            <SubmitButton title="Go Back" onPress={() => navigation.goBack()} />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 60,
    backgroundColor: COLORS.black,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginTop: 8,
  },
  form: {
    marginTop: 32,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginLeft: 4,
    marginBottom: 8,
    marginTop: 20,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  successIcon: {
    fontSize: 70,
    marginBottom: 24,
  },
});

export default ResetPasswordScreen;
