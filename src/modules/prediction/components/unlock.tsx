import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC } from 'react';

import { COLORS } from '../../../constants/colors';
import { WorkoutPlan } from '../types';

const UnlockPlan: FC<{ plan: WorkoutPlan }> = ({ plan }) => {
  const onUnlock = () => {};
  return (
    <View style={styles.ctaWrapper}>
      <View style={styles.ctaCard}>
        <Text style={styles.ctaTitle}>Unlock Full Workout Plan</Text>
        <Text style={styles.ctaSubtitle}>
          Access all {plan.days.length} training days specifically designed for
          your current gym.
        </Text>
        <TouchableOpacity
          style={styles.unlockButton}
          onPress={onUnlock}
          activeOpacity={0.9}
        >
          <Text style={styles.unlockButtonText}>Unlock Full Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UnlockPlan;

const styles = StyleSheet.create({
  ctaWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  ctaCard: {
    backgroundColor: '#18181b',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#27272a',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  ctaTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ctaSubtitle: {
    color: '#a1a1aa',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  unlockButton: {
    backgroundColor: COLORS.mainBlue,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  unlockButtonText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 16,
  },
});
