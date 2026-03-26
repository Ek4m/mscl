import React, { FC, useState } from "react";
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

import { useGetPremadePlansQuery } from "../../redux/plans/slice";
import { COLORS } from "../../constants/colors";
import { RootStackParamList } from "../types";
import { PremadePlan } from "../../modules/workout/types";
import { Gender } from "../../modules/prediction/enums";
import NoData from "../../modules/prediction/components/noData";

// Define the filter types
type GenderFilter = "all" | Gender;

const PreMadePlansScreen: FC<
  NativeStackScreenProps<RootStackParamList, "premadePlans">
> = ({ navigation }) => {
  const [selectedGender, setSelectedGender] = useState<GenderFilter>("all");
  const { data, isFetching, refetch } = useGetPremadePlansQuery({
    gender: selectedGender,
  });
console.log(selectedGender)
  const handlePlanSelect = (plan: PremadePlan) => {
    navigation.navigate("premadePlanDetails", { plan });
  };

  const FilterChip = ({
    type,
    label,
  }: {
    type: GenderFilter;
    label: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        selectedGender === type && styles.filterChipActive,
      ]}
      onPress={() => setSelectedGender(type)}
    >
      <Text
        style={[
          styles.filterChipText,
          selectedGender === type && styles.filterChipTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

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

          {/* Gender Filter Row */}
          <View style={styles.filterRow}>
            <FilterChip type="all" label="ALL" />
            <FilterChip type={Gender.MALE} label="MALE" />
            <FilterChip type={Gender.FEMALE} label="FEMALE" />
          </View>

          <Text style={styles.description}>
            Scientifically backed programs designed by elite coaches to
            transform your physique and performance.
          </Text>
        </View>
        {!isFetching && (!data || !data.length) && (
          <NoData message="Check back later for new programs!" />
        )}
        {data?.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={styles.planCard}
            onPress={() => handlePlanSelect(plan)}
          >
            <Image source={{ uri: plan.thumbnail }} style={styles.cardImage} />
            <View style={styles.cardOverlay}>
              <View style={styles.badgeRow}>
                <View style={styles.intensityBadge}>
                  <Text style={styles.intensityText}>
                    {plan.weeks[0]?.days?.length} Days/Week
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
                      {plan.weeks[0]?.days.length} Days/Week
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
  container: { flex: 1, backgroundColor: COLORS.black, paddingTop: 40 },
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
    backgroundColor: COLORS.black1,
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
    marginTop: 15,
    lineHeight: 20,
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.black1,
    borderWidth: 1,
    borderColor: "#333",
  },
  filterChipActive: {
    backgroundColor: COLORS.mainBlue,
    borderColor: COLORS.mainBlue,
  },
  filterChipText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "bold",
  },
  filterChipTextActive: {
    color: "white",
  },
  planCard: {
    width: "100%",
    height: 240,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: COLORS.black1,
  },
  cardImage: { width: "100%", height: "100%", opacity: 0.7 },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  badgeRow: { flexDirection: "row", gap: 8 },
  intensityBadge: {
    backgroundColor: COLORS.mainBlue,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  intensityText: { color: "white", fontSize: 10, fontWeight: "800" },
  planName: { color: "white", fontSize: 24, fontWeight: "bold" },
  statsRow: { flexDirection: "row", gap: 20, marginTop: 12 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  statText: { color: "white", fontSize: 12, fontWeight: "600" },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.black1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 8,
  },
  message: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default PreMadePlansScreen;
