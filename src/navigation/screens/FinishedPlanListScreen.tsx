import React from "react";
import { StyleSheet, Text, View, RefreshControl, FlatList } from "react-native";

import { PlanStatus } from "../../modules/prediction/enums";
import { COLORS } from "../../constants/colors";

import PlanListItem from "../../modules/prediction/components/planListItem";

import { useGetPlansQuery } from "../../redux/plans/slice";

const FinishedPlanListScreen = () => {
  const { data, isFetching, refetch } = useGetPlansQuery({
    status: PlanStatus.ARCHIVED,
  });
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        YOUR <Text style={{ color: COLORS.mainBlue }}>GYM HISTORY</Text>
      </Text>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={COLORS.mainBlue}
          />
        }
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PlanListItem program={item} />}
      />
    </View>
  );
};

export default FinishedPlanListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: "600",
    marginBottom: 16,
    marginTop: 20,
  },
});
