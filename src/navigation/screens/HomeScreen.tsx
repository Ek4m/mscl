import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  RefreshControl,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { COLORS } from "../../constants/colors";
import { useAppSelector } from "../../redux/root";
import { selectUserInfo } from "../../redux/auth/slice";
import { useGetPlansQuery } from "../../redux/plans/slice";
import PlanListItem from "../../modules/prediction/components/planListItem";
import { RootStackParamList } from "../types";
import { clearWorkoutDbDev } from "../../db/services";

const HomeScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, "home">
> = ({ navigation }) => {
  const { data, isFetching, refetch } = useGetPlansQuery();
  const { userInfo } = useAppSelector(selectUserInfo);

  const features = [
    {
      id: "ai",
      title: "AI Architect",
      subtitle: "Build with Gemini AI",
      icon: "auto-fix",
      screen: "upload",
      color: "#3b82f6", // mainBlue
    },
    {
      id: "premade",
      title: "Elite Library",
      subtitle: "Pro-made gym plans",
      icon: "library-shelves",
      screen: "upload",
      color: "#a855f7", // purple
    },
    {
      id: "custom",
      title: "Manual Build",
      subtitle: "Customized precision",
      icon: "plus-box",
      screen: "customPlan",
      color: "#10b981", // green
    },
  ];

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.username}>{userInfo?.username}</Text>
          </View>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CREATE NEW</Text>
            <View style={styles.featureGrid}>
              {features.map((feature) => (
                <TouchableOpacity
                  key={feature.id}
                  style={[
                    styles.featureCard,
                    { borderColor: feature.color + "40" },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate(feature.screen)}
                >
                  <View
                    style={[
                      styles.featureIconContainer,
                      { backgroundColor: feature.color + "20" },
                    ]}
                  >
                    <Icon name={feature.icon} color={feature.color} size={28} />
                  </View>
                  <View style={styles.featureText}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureSubtitle}>
                      {feature.subtitle}
                    </Text>
                  </View>
                  <Icon name="chevron-right" color="#444" size={24} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {__DEV__ ? (
            <Button onPress={clearWorkoutDbDev} title="Clear db" />
          ) : null}
          {/* Programs List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>YOUR PROGRAMS</Text>
              <Text style={styles.badge}>{data?.length}</Text>
            </View>

            {data?.map((program) => (
              <PlanListItem program={program} key={program.id} />
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "web" ? 24 : 12,
    paddingBottom: 24,
  },
  greeting: {
    color: "#71717a",
    fontSize: 14,
    fontWeight: "500",
  },
  username: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    fontFamily: "Oswald",
    textTransform: "uppercase",
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#18181b",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.mainBlue,
    borderWidth: 2,
    borderColor: "#18181b",
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  statsBanner: {
    flexDirection: "row",
    backgroundColor: "#18181b",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statDivider: {
    width: 1,
    height: "60%",
    backgroundColor: "#27272a",
    alignSelf: "center",
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    fontFamily: "Oswald",
    marginTop: 4,
  },
  statLabel: {
    color: "#71717a",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#71717a",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: "#27272a",
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
  },
  featureGrid: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: "#18181b",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  featureIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Oswald",
    textTransform: "uppercase",
  },
  featureSubtitle: {
    color: "#71717a",
    fontSize: 13,
  },
});

export default HomeScreen;
