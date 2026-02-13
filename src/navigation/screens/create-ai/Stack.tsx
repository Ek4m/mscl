import React, { useCallback } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import { CreateAiPlanParamList } from "./types";

import { useAppDispatch, useAppSelector } from "../../../redux/root";
import { reset, selectAiPlan } from "../../../redux/workout/create-ai";

import ConfirmEquipmentScreen from "./ConfirmEquipmentScreen";
import PreviewPlanScreen from "./PreviewPlanScreen";
import PreferencesScreen from "./PreferencesScreen";
import AnalyzingScreen from "./AnalyzingScreen";
import UploadScreen from "./UploadScreen";

const Stack = createNativeStackNavigator<CreateAiPlanParamList>();

const CreateAiStack = () => {
  const { isFetching } = useAppSelector(selectAiPlan);
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
      initialRouteName="upload"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="upload" component={UploadScreen} />
      {isFetching ? (
        <Stack.Screen name="analyzing" component={AnalyzingScreen} />
      ) : null}
      <Stack.Screen name="preferences" component={PreferencesScreen} />
      <Stack.Screen
        name="confirmEquipments"
        component={ConfirmEquipmentScreen}
      />
      <Stack.Screen name="previewPlan" component={PreviewPlanScreen} />
    </Stack.Navigator>
  );
};

export default CreateAiStack;
