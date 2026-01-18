import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import FaIcons from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const PaywallScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'payment'>
> = () => {
  const [tier, setTier] = useState<'monthly' | 'yearly'>('yearly');

  const features = [
    'Plans that match your gym exactly',

    'Regenerate anytime equipment changes',

    'Advanced exercise substitutions',

    'Save multiple gym profiles',
  ];

  const onSubscribe = () => {};
  const isSubscribing = false;
  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerContent}>
          {/* Main Icon */}
          <View style={styles.iconCircle}>
            <FaIcons size={40} color="black" name="check" />
          </View>

          <Text style={styles.title}>Level Up Your Gains</Text>
          <Text style={styles.subtitle}>
            Get unlimited custom plans for any gym you visit.
          </Text>

          {/* Features List */}
          <View style={styles.featureList}>
            {features.map((feat, idx) => (
              <View key={idx} style={styles.featureItem}>
                <View style={styles.checkIconWrapper}>
                  <FaIcons size={12} color={COLORS.lightBlue} name="check" />
                </View>
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>

          {/* Tier Selection */}
          <View style={styles.tierContainer}>
            {/* Monthly Option */}
            <TouchableOpacity
              onPress={() => setTier('monthly')}
              activeOpacity={0.8}
              style={[
                styles.tierButton,
                tier === 'monthly' ? styles.activeTier : styles.inactiveTier,
              ]}
            >
              <View>
                <Text style={styles.tierName}>Monthly</Text>
                <Text style={styles.tierSub}>Billed every month</Text>
              </View>
              <Text style={styles.price}>$12.99</Text>
            </TouchableOpacity>

            {/* Yearly Option */}
            <TouchableOpacity
              onPress={() => setTier('yearly')}
              activeOpacity={0.8}
              style={[
                styles.tierButton,
                tier === 'yearly' ? styles.activeTier : styles.inactiveTier,
              ]}
            >
              {/* Badge */}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Best Value</Text>
              </View>
              <View>
                <Text style={styles.tierName}>Yearly</Text>
                <Text style={styles.tierSub}>Save 40% vs monthly</Text>
              </View>
              <Text style={styles.price}>$79.99</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={onSubscribe}
            disabled={isSubscribing}
            activeOpacity={0.9}
            style={[styles.submitButton, isSubscribing && { opacity: 0.7 }]}
          >
            {isSubscribing ? (
              <ActivityIndicator color="black" />
            ) : (
              <Text style={styles.submitButtonText}>
                Start 7-Day Free Trial
              </Text>
            )}
          </TouchableOpacity>
          <Text style={styles.disclaimer}>
            Payment will be charged to your account after the trial. Cancel
            anytime in settings. By subscribing you agree to our Terms and
            Privacy Policy.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PaywallScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#09090b', // zinc-950
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    flexGrow: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.lightBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    // Shadow for iOS
    shadowColor: COLORS.mainBlue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    // Elevation for Android
    elevation: 15,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#71717a', // zinc-500
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  featureList: {
    width: '100%',
    maxWidth: 280,
    gap: 16,
    marginBottom: 48,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkIconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    color: '#d4d4d8', // zinc-300
    fontSize: 15,
    fontWeight: '500',
  },
  tierContainer: {
    width: '100%',
    gap: 12,
  },
  tierButton: {
    width: '100%',
    padding: 24,
    borderRadius: 20,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeTier: {
    borderColor: COLORS.mainBlue,
    backgroundColor: 'rgba(6, 182, 212, 0.05)',
  },
  inactiveTier: {
    borderColor: '#27272a', // zinc-800
    backgroundColor: '#18181b', // zinc-900
  },
  tierName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tierSub: {
    color: '#71717a',
    fontSize: 12,
    marginTop: 2,
  },
  price: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  badge: {
    position: 'absolute',
    top: -12,
    left: 24,
    backgroundColor: COLORS.lightBlue,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  badgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  footer: {
    marginTop: 40,
    gap: 16,
  },
  submitButton: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: 10,
    color: '#52525b', // zinc-600
    lineHeight: 16,
    paddingHorizontal: 20,
  },
});
