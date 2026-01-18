import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { COLORS } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

const ProfileButton = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('profile')}
      style={styles.container}
    >
      <FontAwesome name="user" size={28} color={COLORS.lightBlue} />
    </TouchableOpacity>
  );
};

export default ProfileButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 30,
    borderColor: COLORS.mainBlue,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    shadowColor: COLORS.mainBlue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
});
