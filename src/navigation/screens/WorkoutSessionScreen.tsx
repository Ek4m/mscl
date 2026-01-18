import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { plan } from '../../constants/dummy';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FaIcons from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../../constants/colors';
import { WorkoutDay } from '../../modules/prediction/types';

const WorkoutSessionScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'workoutSession'>
> = () => {
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const activeDay:WorkoutDay = plan.days[0]; 
  const exercises = activeDay.moves;

  const toggle = (idx: number) => {
    const next = new Set(completed);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setCompleted(next);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.screen}
    >
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Session Active</Text>
            <Text style={styles.daySubtitle}>{activeDay.title}</Text>
          </View>
          <View style={styles.statsRight}>
            <Text style={styles.counterText}>
              {completed.size}/{exercises.length}
            </Text>
            <Text style={styles.counterLabel}>Done</Text>
          </View>
        </View>

        {/* Scrollable Exercise List */}
        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.scrollPadding}
          showsVerticalScrollIndicator={false}
        >
          {exercises.map((ex, idx) => {
            const isDone = completed.has(idx);

            return (
              <View
                key={idx}
                style={[
                  styles.exerciseCard,
                  isDone ? styles.cardCompleted : styles.cardActive,
                ]}
              >
                {/* Checkbox Button */}
                <TouchableOpacity
                  onPress={() => toggle(idx)}
                  activeOpacity={0.7}
                  style={[
                    styles.checkbox,
                    isDone ? styles.checkboxCompleted : styles.checkboxActive,
                  ]}
                >
                  {isDone && <FaIcons name="check" size={16} color="black" />}
                </TouchableOpacity>

                {/* Exercise Info */}
                <View style={styles.exerciseInfo}>
                  <Text
                    style={[
                      styles.exerciseName,
                      isDone && styles.textCompleted,
                    ]}
                  >
                    {ex.name}
                  </Text>
                  <Text style={styles.exerciseSets}>
                    {ex.sets} × {ex.reps}
                  </Text>
                </View>

                {/* Weight Input */}
                {!isDone && (
                  <TextInput
                    placeholder="kg"
                    placeholderTextColor="#52525b"
                    keyboardType="numeric"
                    style={styles.weightInput}
                  />
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Footer Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.9}
            style={styles.finishButton}
          >
            <Text style={styles.finishButtonText}>Finish Workout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default WorkoutSessionScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#09090b', // zinc-950
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
  },
  daySubtitle: {
    color: COLORS.lightBlue,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  statsRight: {
    alignItems: 'flex-end',
  },
  counterText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
  },
  counterLabel: {
    fontSize: 10,
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  listContainer: {
    flex: 1,
  },
  scrollPadding: {
    paddingBottom: 20,
    gap: 12,
  },
  exerciseCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardActive: {
    backgroundColor: '#18181b', // zinc-900
    borderColor: '#3f3f46', // zinc-700
  },
  cardCompleted: {
    backgroundColor: '#18181b',
    borderColor: '#27272a', // zinc-800
    opacity: 0.5,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  checkboxActive: {
    borderColor: '#3f3f46',
  },
  checkboxCompleted: {
    backgroundColor: COLORS.mainBlue,
    borderColor: COLORS.mainBlue,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: '#71717a',
  },
  exerciseSets: {
    color: '#71717a',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  weightInput: {
    width: 64,
    backgroundColor: '#27272a',
    borderRadius: 8,
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
  },
  finishButton: {
    backgroundColor: COLORS.mainBlue,
    paddingVertical: 20,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: COLORS.mainBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  finishButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
  },
});
