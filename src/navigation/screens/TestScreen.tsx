import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import FeatherIcons from 'react-native-vector-icons/Feather';

import { WorkoutDay, WorkoutPlan } from '../../modules/prediction/types';
import ActiveWorkout from '../../modules/prediction/components/activeWorkout';

const MOCK_PLAN: WorkoutPlan = {
  id: 1,
  title: 'Hypertrophy Foundations',
  level: 'Intermediate',
  days: [
    {
      id: 100,
      title: 'Day A: Push (Chest/Shoulders/Triceps)',
      moves: [
        {
          id: 2,
          name: 'Barbell Bench Press',
          sets: 4,
          reps: '8-10',
          notes: 'Control the eccentric phase',
        },
        { id: 10, name: 'Overhead Press', sets: 3, reps: '10-12' },
        { id: 11, name: 'Lateral Raises', sets: 3, reps: '15-20' },
        { id: 12, name: 'Tricep Pushdowns', sets: 4, reps: '12-15' },
      ],
    },
    {
      id: 3,
      title: 'Day B: Pull (Back/Biceps)',
      moves: [
        { id: 1, name: 'Weighted Pull-ups', sets: 3, reps: 'AMRAP' },
        { id: 2, name: 'Seated Cable Row', sets: 3, reps: '10-12' },
        { id: 3, name: 'Dumbbell Bicep Curls', sets: 3, reps: '12-15' },
      ],
    },
  ],
};

const WorkoutTracker: React.FC = () => {
  const [activeDay, setActiveDay] = useState<WorkoutDay | null>(null);
  const [view, setView] = useState<'dashboard' | 'active'>('dashboard');

  const handleStartWorkout = (day: WorkoutDay) => {
    setActiveDay(day);
    setView('active');
  };

  if (view === 'active' && activeDay)
    return (
      <ActiveWorkout
        workoutDay={activeDay}
        planTitle={MOCK_PLAN.title}
        onFinish={() => setView('dashboard')}
        onCancel={() => setView('dashboard')}
      />
    );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Current Plan</Text>
            </View>
            <Text style={styles.planTitle}>{MOCK_PLAN.title}</Text>
            <View style={styles.planMeta}>
              <View style={styles.metaItem}>
                <FeatherIcons name="activity" size={14} color="#2563eb" />
                <Text style={styles.metaText}>{MOCK_PLAN.level}</Text>
              </View>
              <View style={styles.metaItem}>
                <IonIcons name="clipboard" size={14} color="#2563eb" />
                <Text style={styles.metaText}>{MOCK_PLAN.days.length} days a week</Text>
              </View>
            </View>
          </View>
          <View style={styles.workoutList}>
            <Text style={styles.sectionLabel}>Select Workout</Text>
            {MOCK_PLAN.days.map((day, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleStartWorkout(day)}
                style={styles.workoutItem}
              >
                <View>
                  <Text style={styles.dayName}>{day.title}</Text>
                  <Text style={styles.exerciseCount}>
                    {day.moves.length} Exercises
                  </Text>
                </View>
                <View style={styles.playButton}>
                  <IonIcons name="play" size={12} color="white" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* <View style={styles.statsRow}>
          <View style={styles.statsCard}>
            <IonIcons name="trophy" size={20} color="#eab308" />
            <Text style={styles.statsValue}>12</Text>
            <Text style={styles.statsLabel}>Streak Days</Text>
          </View>
          <View style={styles.statsCard}>
            <FeatherIcons name="activity" size={20} color="#2563eb" />
            <Text style={styles.statsValue}>8.4k</Text>
            <Text style={styles.statsLabel}>Total Volume</Text>
          </View>
        </View> */}
      </ScrollView>
    </View>
  );
};
export default WorkoutTracker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  brand: {
    fontSize: 40,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#ffffff',
    letterSpacing: -2,
  },
  brandSub: {
    fontSize: 10,
    fontWeight: '700',
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#09090b',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#18181b',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    marginBottom: 24,
  },
  cardHeader: {
    padding: 24,
  },
  badge: {
    backgroundColor: '#2563eb',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  planTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 12,
  },
  planMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '600',
  },
  workoutList: {
    backgroundColor: 'rgba(24, 24, 27, 0.4)',
    padding: 24,
  },
  sectionLabel: {
    color: '#71717a',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  workoutItem: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  exerciseCount: {
    color: '#52525b',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  playButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3f3f46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statsCard: {
    flex: 1,
    backgroundColor: 'rgba(24, 24, 27, 0.5)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#18181b',
    padding: 16,
  },
  statsValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 8,
  },
  statsLabel: {
    color: '#71717a',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#09090b',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    color: '#3f3f46',
    fontSize: 10,
    fontWeight: '700',
  },
  navTextActive: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
});
