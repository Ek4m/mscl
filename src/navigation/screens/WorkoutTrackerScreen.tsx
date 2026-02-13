import React, { memo, useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useFocusEffect } from "@react-navigation/native";

import ActiveWorkout from "../../modules/prediction/components/activeWorkout";
import { RootStackParamList } from "../types";
import { successToast } from "../../helpers/toast";
import {
  getWorkoutExercises,
  insertOrCreateWorkoutSession,
} from "../../db/services";
import { useAppSelector } from "../../redux/root";
import { selectUserInfo } from "../../redux/auth/slice";
import { ActiveExercise } from "../../modules/prediction/types";

const WorkoutTrackerScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, "workoutTracker">
> = ({ route: { params }, navigation }) => {
  const activePlan = params.plan;
  const { userInfo } = useAppSelector(selectUserInfo);
  const activeWorkoutDay = activePlan.days.find((d) => d.id === params.id);
  const [workoutSessionId, setWorkoutSessionId] = useState(0);
  const [exercises, setExercises] = useState<ActiveExercise[]>([]);

  useEffect(() => {
    if (userInfo && activeWorkoutDay) {
      console.log(activeWorkoutDay.id);
      const sessionId = insertOrCreateWorkoutSession(
        userInfo.id,
        activePlan.id,
        activeWorkoutDay.id,
      );
      setWorkoutSessionId(sessionId);
      const newExercises = activeWorkoutDay.exercises.map((ex) => ({
        ...ex,
        completedSets: new Array(ex.targetSets).fill(null),
      }));
      const copyExercises = [...newExercises];
      const savedExercises = getWorkoutExercises(sessionId);

      if (savedExercises && savedExercises.length) {
        savedExercises.forEach((ex) => {
          const exerciseIndex = copyExercises.findIndex((e) => {
            return (
              e.id === ex.plan_day_exercise_id &&
              e.exercise.id === ex.exercise_id &&
              e.variation?.id === ex.variation_id
            );
          });
          if (exerciseIndex >= 0) {
            copyExercises[exerciseIndex].completedSets[ex.order_index] = ex;
          }
        });
      }
      setExercises(copyExercises);
    }
  }, [params.plan, userInfo, activeWorkoutDay]);

  useFocusEffect(
    useCallback(() => {
      activateKeepAwakeAsync();
      return () => {
        deactivateKeepAwake();
        setExercises([]);
        setWorkoutSessionId(0);
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
        exercises={exercises}
        sessionId={workoutSessionId}
        setExercises={setExercises}
        workoutDay={activeWorkoutDay}
        plan={activePlan}
        onCancel={() => navigation.goBack()}
        onFinish={onFinishTracking}
      />
    );
};
export default memo(WorkoutTrackerScreen);
