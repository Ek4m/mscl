import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthScreen from "./screens/AuthScreen";
import SplashScreen from "./screens/SplashScreen";
import AnalyzingScreen from "./screens/AnalyzingScreen";
import UploadScreen from "./screens/UploadScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import ConfirmEquipmentScreen from "./screens/ConfirmEquipmentScreen";
import PlanDetailsScreen from "./screens/PlanDetailsScreen";
import PreferencesScreen from "./screens/PreferencesScreen";
import PreviewPlanScreen from "./screens/PreviewPlanScreen";
import PaywallScreen from "./screens/PaywallScreen";
import WorkoutSessionScreen from "./screens/WorkoutSessionScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import WorkoutTrackerScreen from "./screens/WorkoutTrackerScreen";
import CustomPlanCreatorSceen from "./screens/CustomPlanScreen";
import PlanReviewScreen from "./screens/InspectPlanScreen";

import { RootStackParamList } from "./types";

import { useAppSelector } from "../redux/root";
import { selectUserInfo, useGetProfileQuery } from "../redux/auth/slice";
import { selectPredictions } from "../redux/workout/create-ai";

import MainLayout from "../UI/components/layout";
import TestScreen from "./screens/TestScreen";
import InitialInfoScreen from "./screens/InitialInfoScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { userInfo } = useAppSelector(selectUserInfo);
  const { isFetching } = useAppSelector(selectPredictions);
  useGetProfileQuery();
  return (
    <Stack.Navigator
      initialRouteName="splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="auth" component={AuthScreen} />
      <Stack.Screen name="register" component={RegisterScreen} />
      <Stack.Screen name="test" component={TestScreen} />
      <Stack.Screen name="splash" component={SplashScreen} />
      <Stack.Screen name="initialInfo" component={InitialInfoScreen} />
      <Stack.Screen name="onboarding" component={OnboardingScreen} />
      {userInfo ? (
        <>
          <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen
            name="workoutTracker"
            component={WorkoutTrackerScreen}
          />
          <Stack.Screen name="customPlan" component={CustomPlanCreatorSceen} />
          <Stack.Screen name="inspectPlan" component={PlanReviewScreen} />
          <Stack.Screen name="planDetails" component={PlanDetailsScreen} />
          <Stack.Screen
            name="workoutSession"
            component={WorkoutSessionScreen}
          />
          <Stack.Screen name="profile" component={ProfileScreen} />
          <Stack.Screen name="upload" component={UploadScreen} />
          {isFetching ? (
            <Stack.Screen name="analyzing" component={AnalyzingScreen} />
          ) : null}
          <Stack.Screen name="preferences" component={PreferencesScreen} />
          <Stack.Screen name="previewPlan" component={PreviewPlanScreen} />
          <Stack.Screen name="payment" component={PaywallScreen} />
          <Stack.Screen
            name="confirmEquipments"
            component={ConfirmEquipmentScreen}
          />
        </>
      ) : null}
    </Stack.Navigator>
  );
}
