import React, { FC } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from "react-native";

import { RootStackParamList } from "../types";
import { COLORS } from "../../constants/colors";
import { useGetPlansQuery } from "../../redux/plans/slice";
import { WorkoutPlan } from "../../modules/prediction/types";
import ActionCard from "../../modules/prediction/components/actionCard";
import PlanListItem from "../../modules/prediction/components/planListItem";

const HomeScreenv2: FC<NativeStackScreenProps<RootStackParamList, "home">> = ({
  navigation,
}) => {
  const { data, isFetching, refetch } = useGetPlansQuery();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>
          Workout <Text style={styles.highlight}>Hub</Text>
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={COLORS.mainBlue}
          />
        }
      >
        <Text style={styles.sectionLabel}>Create New</Text>
        <View style={styles.hubGrid}>
          <ActionCard
            title="AI Architect"
            subtitle="Build gym plan with AI"
            icon="magic"
            color={COLORS.mainBlue}
            onPress={() => navigation.navigate("upload")}
          />
          <ActionCard
            title="Premade"
            subtitle="Pro-made gym plans"
            icon="layer-group"
            color={COLORS.purple}
            onPress={() => {
              /* Navigate to new Library Screen */
            }}
          />
          <ActionCard
            title="Custom"
            subtitle="Manual Build"
            icon="pen-nib"
            color={COLORS.green}
            onPress={() => navigation.navigate("customPlan")}
          />
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.sectionLabel}>Your Programs</Text>
          <Text style={styles.countBadge}>{data?.length || 0}</Text>
        </View>

        {data?.map((item: WorkoutPlan) => (
          <PlanListItem item={item} key={item.id} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 60,
    marginBottom: 24,
  },
  heading: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
  },
  highlight: {
    color: COLORS.mainBlue,
  },
  sectionLabel: {
    color: "#71717a",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  hubGrid: {
    gap: 12,
    marginTop: 16,
    marginBottom: 32,
  },

  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  countBadge: {
    backgroundColor: "#27272a",
    color: "#fff",
    fontSize: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default HomeScreenv2;
