import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthScreen from "./screens/AuthScreen";
import SplashScreen from "./screens/SplashScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import PlanDetailsScreen from "./screens/PlanDetailsScreen";
import PaywallScreen from "./screens/PaywallScreen";
import WorkoutSessionScreen from "./screens/WorkoutSessionScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import WorkoutTrackerScreen from "./screens/WorkoutTrackerScreen";
import CustomPlanCreatorSceen from "./screens/CustomPlanScreen";
import PlanReviewScreen from "./screens/InspectPlanScreen";
import TestScreen from "./screens/TestScreen";
import InitialInfoScreen from "./screens/InitialInfoScreen";
import PremadePlansScreen from "./screens/PreMadePlansScreen";

import CreateAiStack from "./screens/create-ai/Stack";
import { RootStackParamList } from "./types";

import { useAppSelector } from "../redux/root";
import { selectUserInfo, useGetProfileQuery } from "../redux/auth/slice";
import {
  selectAiPlan,
  useGetInitialInfoQuery,
} from "../redux/workout/create-ai";
import PremadePlanDetailsScreen from "./screens/PremadePlanDetailsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { userInfo } = useAppSelector(selectUserInfo);
  const { started } = useAppSelector(selectAiPlan);
  useGetInitialInfoQuery();
  const { data, error } = useGetProfileQuery();
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
          <Stack.Screen name="premadePlanDetails" component={PremadePlanDetailsScreen} />
          <Stack.Screen name="premadePlans" component={PremadePlansScreen} />
          {started && (
            <Stack.Screen name="createAiPlan" component={CreateAiStack} />
          )}
          <Stack.Screen name="planDetails" component={PlanDetailsScreen} />
          <Stack.Screen
            name="workoutSession"
            component={WorkoutSessionScreen}
          />
          <Stack.Screen name="profile" component={ProfileScreen} />
          <Stack.Screen name="payment" component={PaywallScreen} />
        </>
      ) : null}
    </Stack.Navigator>
  );
}
