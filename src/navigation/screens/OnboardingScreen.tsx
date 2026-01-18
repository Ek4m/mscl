import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../types';

const OnboardingScreen: FC<
  NativeStackScreenProps<RootStackParamList, 'onboarding'>
> = ({ navigation }) => {
  const onStart = () => {
    navigation.navigate('upload');
  };
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.heading}>
          Create workouts that match{' '}
          <Text style={styles.highlight}>YOUR gym</Text>
        </Text>
        <Text style={styles.subheading}>
          Upload photos of your gym equipment and we'll build the perfect
          science-based plan for you.
        </Text>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.primaryButton} onPress={onStart}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>
            Already have an account?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: 'space-between',
    backgroundColor: '#000',
  },
  top: {
    marginTop: 60,
  },
  heading: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 56,
  },
  highlight: {
    color: '#22d3ee',
  },
  subheading: {
    marginTop: 24,
    fontSize: 18,
    color: '#888',
    lineHeight: 26,
  },
  bottom: {
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#22d3ee',
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22d3ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    marginTop: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
