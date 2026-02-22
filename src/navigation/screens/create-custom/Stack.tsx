import React, { useCallback } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import { CreateCustomPlanParamList } from "./types";
import { reset } from "../../../redux/workout/create-plan";

import { useAppDispatch } from "../../../redux/root";
import CustomPlanScreen from "./CustomPlanScreen";
import PlanReviewScreen from "./InspectPlanScreen";

const Stack = createNativeStackNavigator<CreateCustomPlanParamList>();

const CreateCustomStack = () => {
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      return () => {
        dispatch(reset());
      };
    }, []),
  );
  return (
    <Stack.Navigator
      initialRouteName="builder"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="builder" component={CustomPlanScreen} />
      <Stack.Screen name="inspectPlan" component={PlanReviewScreen} />
    </Stack.Navigator>
  );
};

export default CreateCustomStack;
