import React, { FC, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import FeatherIcon from "react-native-vector-icons/Feather";
import OctiIcon from "react-native-vector-icons/Octicons";

import { useGetUserCustomPlanByIdQuery } from "../../redux/plans/slice";

import { COLORS } from "../../constants/colors";
import { RootStackParamList } from "../types";
import { PlanStatus } from "../../modules/prediction/enums";

import NoData from "../../modules/prediction/components/noData";
import ActivePlanDetails from "../../modules/prediction/components/activePlanDetails";
import ArchivedPlanDetails from "../../modules/prediction/components/archivedPlanDetails";

const { width } = Dimensions.get("window");

const PlanDetailsScreen: FC<
  NativeStackScreenProps<RootStackParamList, "planDetails">
> = ({ route, navigation }) => {
  const { id, sessions, status } = route.params;
  const {
    data: plan,
    refetch,
    isFetching,
  } = useGetUserCustomPlanByIdQuery({ id, sessions, status });

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

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri:
            plan?.template?.thumbnail ||
            "https://img.freepik.com/premium-photo/dumbbells-kettlebell-gym-floor_1205263-196404.jpg",
        }}
        style={styles.hero}
      >
        <View style={styles.heroOverlay}>
          <View style={styles.safeHeader}>
            <View style={styles.navRow}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backCircle}
              >
                <FeatherIcon name="arrow-left" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.heroContent}>
              <View style={styles.heroBadge}>
                <OctiIcon name="flame" size={12} color={COLORS.mainBlue} />
                <Text style={styles.heroBadgeText}>ELITE PROGRAM</Text>
              </View>
              <Text style={styles.heroTitle}>{plan?.title}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
      {!plan && isFetching && (
        <ActivityIndicator size={30} color={COLORS.mainBlue} />
      )}
      {!plan && !isFetching && <NoData message="Plan was not found" />}
      {plan && plan.status === PlanStatus.ACTIVE && (
        <ActivePlanDetails plan={plan} />
      )}
      {plan && plan.status === PlanStatus.ARCHIVED && (
        <ArchivedPlanDetails plan={plan} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  hero: { height: 380, width: width },
  heroOverlay: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  safeHeader: { flex: 1, justifyContent: "space-between" },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 0 : 20,
  },
  backCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  heroContent: { marginBottom: 10 },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: COLORS.mainBlue,
    fontWeight: "900",
    fontSize: 11,
    letterSpacing: 2,
  },
  heroTitle: {
    color: "white",
    fontSize: 38,
    fontWeight: "900",
    fontStyle: "italic",
    textTransform: "uppercase",
    lineHeight: 40,
  },
});

export default PlanDetailsScreen;
