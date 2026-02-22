import React, { FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import FeatherIcon from "react-native-vector-icons/Feather";

import { COLORS } from "../../constants/colors";
import PlanListItem from "../../modules/prediction/components/planListItem";
import { clearWorkoutDbDev } from "../../db/services";

import { useGetPlansQuery } from "../../redux/plans/slice";
import { startAIPlanning } from "../../redux/workout/create-ai";
import { useAppDispatch, useAppSelector } from "../../redux/root";
import { selectUserInfo } from "../../redux/auth/slice";

import { RootStackParamList } from "../types";

const HomeScreen: FC<NativeStackScreenProps<RootStackParamList, "home">> = ({
  navigation,
}) => {
  const { data, isFetching, refetch } = useGetPlansQuery();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector(selectUserInfo);

  const features = [
    {
      id: "ai",
      title: "AI Planner",
      subtitle: "Powered by Gemini",
      icon: require("../../../assets/ai.png"),
      color: COLORS.mainBlue,
      onPress: () => {
        dispatch(startAIPlanning());
        setTimeout(() => {
          navigation.navigate("createAiPlan", { screen: "selectGender" });
        });
      },
    },
    {
      id: "customPlan",
      title: "Plan Builder",
      subtitle: "Design custom volume",
      icon: require("../../../assets/custom.png"),
      color: "#63ff20",
      onPress: () => navigation.navigate("customPlan"),
    },
    {
      id: "premade",
      title: "Ready Programs",
      subtitle: "Browse professional plans",
      icon: require("../../../assets/premade.png"),
      color: "#ff4520",
      onPress: () => navigation.navigate("premadePlans"),
    },
  ];

  return (
    <View style={styles.safeArea}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={COLORS.mainBlue}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Elite Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.heroBadge}>
              <View style={styles.line} />
              <Text style={styles.badgeText}>ELITE STATUS: ACTIVE</Text>
            </View>
            <Text style={styles.username}>
              {userInfo?.username?.toUpperCase() || "OPERATOR"}
            </Text>
          </View>
          <TouchableOpacity style={styles.profileCircle}>
            <FeatherIcon name="user" size={20} color={COLORS.mainBlue} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Feature Row - Matching the "Elite Ecosystem" cards */}
          <Text style={styles.sectionTitle}>
            FORGE <Text style={{ color: COLORS.mainBlue }}>NEW PATH</Text>
          </Text>
          <View style={styles.featureGrid}>
            {features.map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[styles.featureCard, { borderColor: f.color + "40" }]}
                onPress={f.onPress}
              >
                <View
                  style={[styles.iconBox, { backgroundColor: f.color + "15" }]}
                >
                  <Image source={f.icon} style={styles.featureIcon} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureSub}>{f.subtitle}</Text>
                </View>
                <FeatherIcon name="arrow-right" size={16} color={f.color} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Programs Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              YOUR <Text style={{ color: COLORS.mainBlue }}>PROGRAMS</Text>
            </Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{data?.length || 0}</Text>
            </View>
          </View>

          {data?.map((program) => (
            <PlanListItem program={program} key={program.id} />
          ))}

          {__DEV__ && (
            <TouchableOpacity style={styles.devBtn} onPress={clearWorkoutDbDev}>
              <Text style={styles.devText}>CLEAR DB CACHE</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0a0a0a" },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroBadge: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  line: {
    width: 20,
    height: 2,
    backgroundColor: COLORS.mainBlue,
    marginRight: 8,
  },
  badgeText: {
    color: COLORS.mainBlue,
    fontWeight: "900",
    fontSize: 10,
    letterSpacing: 1.5,
  },
  username: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: "900",
    fontStyle: "italic",
    letterSpacing: -1,
  },
  profileCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "#222",
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { paddingHorizontal: 24 },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 16,
    marginTop: 20,
  },
  featureGrid: { gap: 12 },
  featureCard: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  featureIcon: {
    width: 45,
    height: 45,
    resizeMode: "contain",
    borderRadius: 10,
  },
  featureTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
    fontStyle: "italic",
  },
  featureSub: { color: "#666", fontSize: 11, fontWeight: "600" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 15,
  },
  countBadge: {
    backgroundColor: COLORS.mainBlue,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
  },
  countText: { color: "#000", fontSize: 10, fontWeight: "900" },
  devBtn: {
    marginTop: 40,
    padding: 15,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    alignItems: "center",
  },
  devText: { color: "#444", fontSize: 10, fontWeight: "900" },
});

export default HomeScreen;
