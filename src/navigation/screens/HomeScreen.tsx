import React, { FC, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
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
import { useFocusEffect } from "@react-navigation/native";
import { startCustomPlanning } from "../../redux/workout/create-plan";

const HomeScreen: FC<NativeStackScreenProps<RootStackParamList, "home">> = ({
  navigation,
}) => {
  const { data, isFetching, refetch } = useGetPlansQuery();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector(selectUserInfo);
  const isFirstRender = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      refetch();
    }, [refetch]),
  );

  const handleAI = () => {
    dispatch(startAIPlanning());
    setTimeout(() =>
      navigation.navigate("createAiPlan", { screen: "selectGender" }),
    );
  };

  const handleCustom = () => {
    dispatch(startCustomPlanning());
    setTimeout(() => navigation.navigate("customPlan"));
  };

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
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <View style={styles.heroBadge}>
              <View style={styles.line} />
              <Text style={styles.badgeText}>PLAN STATUS: OPTIMAL</Text>
            </View>
            <Text style={styles.username}>
              {userInfo?.username?.toUpperCase() || "OPERATOR"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("profile")}
            style={styles.profileCircle}
          >
            <FeatherIcon name="user" size={20} color={COLORS.mainBlue} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>
            FORGE <Text style={{ color: COLORS.mainBlue }}>NEW PATH</Text>
          </Text>

          {/* New Bento-Style Grid */}
          <View style={styles.bentoContainer}>
            {/* Main AI Hero Card */}
            <TouchableOpacity
              style={[styles.heroCard, { borderColor: COLORS.mainBlue + "40" }]}
              onPress={handleAI}
            >
              <View style={styles.cardHeader}>
                <FeatherIcon name="cpu" size={24} color={COLORS.mainBlue} />
                <View style={styles.aiTag}>
                  <Text style={styles.aiTagText}>GEMINI AI</Text>
                </View>
              </View>
              <Text style={styles.heroTitle}>AI PLANNER</Text>
              <Text style={styles.heroSub}>
                AI-based workout plan generation
              </Text>
            </TouchableOpacity>

            <View style={styles.row}>
              {/* Custom Builder */}
              <TouchableOpacity
                style={[styles.smallCard, { borderColor: "#4ead2540" }]}
                onPress={handleCustom}
              >
                <FeatherIcon name="layers" size={20} color="#4ead25" />
                <Text style={styles.smallCardTitle}>BUILDER</Text>
                <Text style={styles.smallCardSub}>Custom plan building</Text>
              </TouchableOpacity>

              {/* Ready Programs */}
              <TouchableOpacity
                style={[styles.smallCard, { borderColor: "#ff452040" }]}
                onPress={() => navigation.navigate("premadePlans")}
              >
                <FeatherIcon name="award" size={20} color="#ff4520" />
                <Text style={styles.smallCardTitle}>PROGRAMS</Text>
                <Text style={styles.smallCardSub}>Pro Presets</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Programs Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              ACTIVE <Text style={{ color: COLORS.mainBlue }}>PROTOCOLS</Text>
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
              <Text style={styles.devText}>RESET LOCAL ENGINE</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#080808" },
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
    width: 16,
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
  },
  profileCircle: {
    width: 45,
    height: 45,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222",
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { paddingHorizontal: 24 },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 16,
    marginTop: 20,
  },
  /* Bento Grid Styles */
  bentoContainer: { gap: 12, marginBottom: 10 },
  heroCard: {
    backgroundColor: "#121212",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    height: 140,
    justifyContent: "flex-end",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
  },
  aiTag: {
    backgroundColor: COLORS.mainBlue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  aiTagText: { color: "#000", fontSize: 8, fontWeight: "900" },
  heroTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "900",
    fontStyle: "italic",
  },
  heroSub: { color: "#888", fontSize: 12, fontWeight: "500", marginTop: 2 },
  row: { flexDirection: "row", gap: 12 },
  smallCard: {
    flex: 1,
    backgroundColor: "#121212",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    minHeight: 110,
    justifyContent: "center",
  },
  smallCardTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 12,
  },
  smallCardSub: {
    color: "#666",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  countBadge: {
    backgroundColor: COLORS.mainBlue,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  countText: { color: "#000", fontSize: 10, fontWeight: "900" },
  devBtn: {
    marginTop: 40,
    padding: 15,
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 12,
    alignItems: "center",
  },
  devText: { color: "#444", fontSize: 10, fontWeight: "900" },
});

export default HomeScreen;
