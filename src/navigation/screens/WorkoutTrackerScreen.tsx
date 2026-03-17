import React, { memo, useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { useFocusEffect } from "@react-navigation/native";

import ActiveWorkout from "../../modules/prediction/components/activeWorkout";
import { RootStackParamList } from "../types";
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
  const weekId = params.weekId;
  const week = activePlan.weeks[weekId];
  const { userInfo } = useAppSelector(selectUserInfo);
  const activeWorkoutDay = week.days.find((d) => d.id === params.id);
  const [workoutSessionId, setWorkoutSessionId] = useState(0);
  const [exercises, setExercises] = useState<ActiveExercise[]>([]);

  useEffect(() => {
    if (userInfo && activeWorkoutDay) {
      const sessionId = insertOrCreateWorkoutSession(
        userInfo.id,
        activePlan.id,
        activeWorkoutDay.id,
      );
      setWorkoutSessionId(sessionId);
      const newExercises: ActiveExercise[] = activeWorkoutDay.exercises.map(
        (ex) => ({
          ...ex,
          createdAt: "",
          completedSets: new Array(ex.targetSets).fill(null),
        }),
      );
      const copyExercises: ActiveExercise[] = [...newExercises];
      const savedExercises = getWorkoutExercises(sessionId);
      if (savedExercises && savedExercises.length) {
        savedExercises.forEach((ex) => {
          const exerciseIndex = copyExercises.findIndex((e) => {
            return (
              e.id === ex.planDayExerciseId && e.variation?.id === ex.exerciseId
            );
          });
          if (exerciseIndex >= 0) {
            copyExercises[exerciseIndex].completedSets[ex.orderIndex] = ex;
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

  if (activeWorkoutDay && activePlan)
    return (
      <ActiveWorkout
        exercises={exercises}
        sessionId={workoutSessionId}
        week={week}
        setExercises={setExercises}
        workoutDay={activeWorkoutDay}
        plan={activePlan}
        onCancel={() => navigation.goBack()}
      />
    );
};
export default memo(WorkoutTrackerScreen);
