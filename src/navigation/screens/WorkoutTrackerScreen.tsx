import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import ActiveWorkout from "../../modules/prediction/components/activeWorkout";
import { RootStackParamList } from "../types";
import { useAppSelector } from "../../redux/root";
import { selectPlans } from "../../redux/plans/slice";

const WorkoutTrackerScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, "workoutTracker">
> = ({ route: { params }, navigation }) => {
  const { plans } = useAppSelector(selectPlans);
  const activePlan = plans.find((e) => e.id === params.planId);
  const activeWorkoutDay = plans
    .find((elem) => params.planId === elem.id)
    ?.days.find((e) => e.id === params.id);

  if (activeWorkoutDay && activePlan)
    return (
      <ActiveWorkout
        workoutDay={activeWorkoutDay}
        planTitle={activePlan.title}
        onCancel={() => navigation.goBack()}
        onFinish={() => {}}
      />
    );
};
export default WorkoutTrackerScreen;
