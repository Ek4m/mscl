import React, { memo, useCallback } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useFocusEffect } from "@react-navigation/native";

import ActiveWorkout from "../../modules/prediction/components/activeWorkout";
import { RootStackParamList } from "../types";
import { useAppSelector } from "../../redux/root";
import { selectPlans } from "../../redux/plans/slice";
import { successToast } from "../../helpers/toast";

const WorkoutTrackerScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, "workoutTracker">
> = ({ route: { params }, navigation }) => {
  const activePlan = params.plan;
  const activeWorkoutDay = activePlan.days.find((d) => d.id === params.id);

  useFocusEffect(
    useCallback(() => {
      activateKeepAwakeAsync();
      return () => {
        deactivateKeepAwake();
      };
    }, []),
  );

  const onFinishTracking = () => {
    successToast("Tracking was saved successfully");
    navigation.goBack();
  };

  if (activeWorkoutDay && activePlan)
    return (
      <ActiveWorkout
        workoutDay={activeWorkoutDay}
        plan={activePlan}
        onCancel={() => navigation.goBack()}
        onFinish={onFinishTracking}
      />
    );
};
export default memo(WorkoutTrackerScreen);
