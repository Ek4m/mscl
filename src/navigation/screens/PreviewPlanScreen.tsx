import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import { RootStackParamList } from '../types';
import PlanList from '../../modules/prediction/components/planList';
import {
  selectPredictions,
  useGeneratePlanMutation,
} from '../../redux/workout/slice';
import { useAppSelector } from '../../redux/root';
import { COLORS } from '../../constants/colors';

const PreviewPlanScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'previewPlan'>
> = () => {
  const [generateProgram, { isLoading, isSuccess, data }] =
    useGeneratePlanMutation();
  const { days, level, selectedPredictions } =
    useAppSelector(selectPredictions);

  useFocusEffect(
    useCallback(() => {
      generateProgram({
        equipments: selectedPredictions,
        level,
        numOfDays: days,
      });
    }, [selectedPredictions, level, days, generateProgram]),
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Custom Plan</Text>
        <Text style={styles.subtitle}>Based on your gym equipment</Text>
      </View>
      {isLoading && <ActivityIndicator color={COLORS.lightBlue} />}
      {data && isSuccess && <PlanList plan={data} />}
    </View>
  );
};

export default PreviewPlanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar?.currentHeight || 0,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#71717a',
    fontWeight: '500',
  },
});
