import React, { FC } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';

import { RootStackParamList } from '../types';
import SubmitButton from '../../UI/components/submitButton';
import { COLORS } from '../../constants/colors';
import { useGetPlansQuery } from '../../redux/plans/slice';
import { WorkoutPlan } from '../../modules/prediction/types';

const HomeScreen: FC<NativeStackScreenProps<RootStackParamList, 'home'>> = ({
  navigation,
}) => {
  const { data, isFetching, refetch } = useGetPlansQuery();

  const handleCreatePlan = () => {
    navigation.navigate('upload');
  };

  const handleOpenPlanDetails = (id: number) => {
    navigation.navigate('planDetails', { id });
  };

  const renderItem = ({ item }: { item: WorkoutPlan }) => (
    <TouchableOpacity
      onPress={() => handleOpenPlanDetails(item.id)}
      style={styles.planCard}
      activeOpacity={0.7}
    >
      <View style={styles.planCardTitle}>
        <Text style={styles.planTitle}>{item.title}</Text>
        <Text style={styles.planDetails}>{item.days[0].title},....</Text>
      </View>
      <View style={styles.planStatus}>
        <Text style={styles.statusText}>Active</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>
          Your <Text style={styles.highlight}>Plans</Text>
        </Text>
        <Text style={styles.subheading}>
          Select a plan or create a new one.
        </Text>
      </View>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            tintColor={COLORS.mainBlue}
            colors={[COLORS.mainBlue]}
            onRefresh={refetch}
          />
        }
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      <SubmitButton
        bgColor={COLORS.mainBlue}
        onPress={handleCreatePlan}
        title="Create New Plan"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    backgroundColor: '#000',
    paddingBottom: 30,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  heading: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
  },
  highlight: {
    color: COLORS.mainBlue,
  },
  subheading: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },
  listContainer: {
    paddingBottom: 120,
  },
  planCard: {
    backgroundColor: '#111',
    padding: 24,
    borderRadius: 24,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  planCardTitle: {
    width: Dimensions.get('screen').width * 0.5,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  planDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  planStatus: {
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: COLORS.mainBlue,
    fontSize: 12,
    fontWeight: '700',
  },
});

export default HomeScreen;
