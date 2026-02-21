import React, { FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import FeatherIcon from "react-native-vector-icons/Feather";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

import { COLORS } from "../../constants/colors";
import { RootStackParamList } from "../types";
import { useGetPremadePlansQuery } from "../../redux/plans/slice";
import { PremadePlan } from "../../modules/workout/types";

const PreMadePlansScreen: FC<
  NativeStackScreenProps<RootStackParamList, "premadePlans">
> = ({ navigation }) => {
  const { data, isFetching, refetch } = useGetPremadePlansQuery();

  const handlePlanSelect = (plan: PremadePlan) => {
    navigation.navigate("premadePlanDetails", { plan });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <FeatherIcon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ELITE PROGRAMS</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      >
        <View style={styles.introSection}>
          <Text style={styles.mainTitle}>
            CHOOSE YOUR{"\n"}
            <Text style={styles.highlight}>DESTINY</Text>
          </Text>
          <Text style={styles.description}>
            Scientifically backed programs designed by elite coaches to
            transform your physique and performance.
          </Text>
        </View>

        {data?.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={styles.planCard}
            onPress={() => handlePlanSelect(plan)}
          >
            <Image source={{ uri: plan.thumbnail }} style={styles.cardImage} />
            <View style={styles.cardOverlay}>
              <View style={styles.badgeRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>Strength</Text>
                </View>
                <View style={styles.intensityBadge}>
                  <Text style={styles.intensityText}>
                    {plan.daysPerWeek} Days/Week
                  </Text>
                </View>
              </View>

              <View>
                <Text style={styles.planName}>{plan.title}</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <FeatherIcon
                      name="calendar"
                      size={14}
                      color={COLORS.mainBlue}
                    />
                    <Text style={styles.statText}>
                      {plan.weeks.length} Weeks
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <FontAwesome5Icon
                      name="bolt"
                      size={14}
                      color={COLORS.mainBlue}
                    />
                    <Text style={styles.statText}>
                      {plan.daysPerWeek} Days/Week
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingTop: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  content: { padding: 20 },
  introSection: { marginBottom: 30 },
  mainTitle: {
    color: "white",
    fontSize: 36,
    fontWeight: "900",
    fontStyle: "italic",
    lineHeight: 40,
  },
  highlight: { color: COLORS.mainBlue },
  description: {
    color: "#888",
    fontSize: 14,
    marginTop: 10,
    lineHeight: 20,
  },
  planCard: {
    width: "100%",
    height: 240,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#111",
  },
  cardImage: { width: "100%", height: "100%", opacity: 0.7 },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  badgeRow: { flexDirection: "row", gap: 8 },
  categoryBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  categoryText: { color: "white", fontSize: 10, fontWeight: "800" },
  intensityBadge: {
    backgroundColor: COLORS.mainBlue,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  intensityText: { color: "white", fontSize: 10, fontWeight: "800" },
  planName: { color: "white", fontSize: 24, fontWeight: "bold" },
  planSub: { color: "#ccc", fontSize: 14, marginTop: 4 },
  statsRow: { flexDirection: "row", gap: 20, marginTop: 12 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  statText: { color: "white", fontSize: 12, fontWeight: "600" },
});

export default PreMadePlansScreen;
