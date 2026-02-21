import React, { useCallback } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import { CreateAiPlanParamList } from "./types";

import { useAppDispatch } from "../../../redux/root";
import { reset } from "../../../redux/workout/create-ai";

import PreviewPlanScreen from "./PreviewPlanScreen";
import AiGeneratorScreen from "./AiGeneratorScreen";

const Stack = createNativeStackNavigator<CreateAiPlanParamList>();

const CreateAiStack = () => {
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
      initialRouteName="selectGender"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="selectGender" component={AiGeneratorScreen} />
      <Stack.Screen name="previewPlan" component={PreviewPlanScreen} />
    </Stack.Navigator>
  );
};

export default CreateAiStack;
