import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS } from '../../constants/colors';
import { RootStackParamList } from '../types';
import { useAppDispatch, useAppSelector } from '../../redux/root';
import { logout, selectUserInfo } from '../../redux/auth/slice';
import { ACCESS_TOKEN } from '../../constants/vault';

const ProfileScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'profile'>
> = ({ navigation }) => {
  const { userInfo } = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();

  const onLogout = async () => {
    await AsyncStorage.removeItem(ACCESS_TOKEN);
    dispatch(logout());
    navigation.navigate('auth');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <FontAwesome name="user" size={28} color="#fff" />
        </View>

        <Text style={styles.emailText}>{userInfo?.email || 'Guest User'}</Text>

        <View style={styles.badgeRow}>
          <View style={styles.statusDot} />
          <Text style={styles.badgeText}>Pro Member</Text>
        </View>
      </View>

      {/* Settings Card */}
      <View style={styles.card}>
        {/* Subscription Row */}
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Subscription</Text>
          <TouchableOpacity>
            <Text style={styles.manageText}>Manage</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications Row */}
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Notifications</Text>
          <View style={styles.switchBg}>
            <View style={styles.switchCircle} />
          </View>
        </View>

        {/* Unit System Row */}
        <View style={[styles.row, { marginBottom: 0 }]}>
          <Text style={styles.rowLabel}>Unit System</Text>
          <Text style={styles.unitText}>Metric (kg)</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#18181b',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  emailText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: COLORS.mainBlue,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  card: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 32,
    padding: 24,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  rowLabel: {
    fontSize: 16,
    color: '#a1a1aa',
    fontWeight: '500',
  },
  manageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.lightBlue,
  },
  switchBg: {
    width: 48,
    height: 24,
    backgroundColor: COLORS.mainBlue,
    borderRadius: 12,
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  switchCircle: {
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  unitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 24,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  logoutButtonText: {
    color: '#a1a1aa',
    fontWeight: 'bold',
    fontSize: 18,
  },
  deleteButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'rgba(127, 29, 29, 0.5)',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
