import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import FaIcons from "react-native-vector-icons/FontAwesome5";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { WorkoutPlan } from "../types";
import { RootStackParamList } from "../../../navigation/types";
import { COLORS } from "../../../constants/colors";

const PlanListItem: FC<{ item: WorkoutPlan }> = ({ item }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity
      key={item.id}
      onPress={() => navigation.navigate("planDetails", { id: item.id })}
      style={styles.planCard}
    >
      <View style={styles.planCardInfo}>
        <Text style={styles.planTitle}>{item.title}</Text>
        <Text style={styles.planDetails}>
          {item.days?.length} Days • {item.days[0]?.title}
        </Text>
      </View>
      <View style={styles.planStatus}>
        <FaIcons name="chevron-right" size={12} color={COLORS.mainBlue} />
      </View>
    </TouchableOpacity>
  );
};

export default PlanListItem;

const styles = StyleSheet.create({
  planCard: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  planCardInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  planDetails: {
    fontSize: 13,
    color: "#71717a",
    marginTop: 4,
  },
  planStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#18181b",
    justifyContent: "center",
    alignItems: "center",
  },
});
