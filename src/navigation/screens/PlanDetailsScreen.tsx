import React, { FC, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AntDesignIcons from "react-native-vector-icons/AntDesign";

import { useAppSelector } from "../../redux/root";
import {
  selectPlans,
  useGetUserCustomPlanByIdQuery,
} from "../../redux/plans/slice";

import { COLORS } from "../../constants/colors";
import SubmitButton from "../../UI/components/submitButton";
import { RootStackParamList } from "../types";
import Modal from "../../UI/components/modal";
import PlanUsageHistory from "../../modules/prediction/components/history";

const PlanDetailsScreen: FC<
  NativeStackScreenProps<RootStackParamList, "planDetails">
> = ({ route, navigation }) => {
  const id = route.params?.id || 1;
  const { data: plan } = useGetUserCustomPlanByIdQuery(id);

  const [activeIdx, setActiveIdx] = useState(0);
  const currentDay = plan?.days[activeIdx];
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const onStartSession = () => {
    currentDay &&
      navigation.navigate("workoutTracker", { id: currentDay.id, plan });
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>My Gym Plan</Text>
            <Text style={styles.subtitle}>
              Ready for day 1{currentDay?.dayIndex}?
            </Text>
          </View>
          <TouchableOpacity onPress={() => setIsHistoryModalOpen(true)}>
            <AntDesignIcons name="history" size={20} color={"#fff"} />
          </TouchableOpacity>
        </View>
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabs}
          >
            {plan?.days?.map((day, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setActiveIdx(idx)}
                style={[styles.tab, activeIdx === idx && styles.activeTab]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeIdx === idx && styles.activeTabText,
                  ]}
                >
                  Day {idx + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          style={styles.exerciseList}
          contentContainerStyle={styles.exerciseContent}
        >
          {currentDay?.exercises.map((ex, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.indexBox}>
                <Text style={styles.indexText}>{idx + 1}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.exName}>{ex.exercise.title}</Text>
                <Text style={styles.exDetails}>
                  {ex.targetSets} Sets × {ex.targetReps} Reps
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.footer}>
          <SubmitButton
            title="Start Session"
            bgColor={COLORS.lightBlue}
            onPress={onStartSession}
          />
        </View>
      </View>
      <Modal
        isVisible={isHistoryModalOpen}
        onRequestClose={() => setIsHistoryModalOpen(false)}
      >
        <PlanUsageHistory plan={plan!} />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 24,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitles: {
    paddingTop: 40,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  refreshBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  refreshIcon: {
    fontSize: 18,
  },
  tabs: {
    overflow: "hidden",
    paddingBottom: 24,
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: "#111",
    marginRight: 12,
  },
  activeTab: {
    backgroundColor: COLORS.lightBlue,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  activeTabText: {
    color: "#000",
  },
  exerciseList: {
    flex: 1,
  },
  exerciseContent: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  indexBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  indexText: {
    color: "#444",
    fontSize: 18,
    fontWeight: "900",
  },
  cardInfo: {
    marginHorizontal: 16,
    paddingRight: 20,
  },
  exName: {
    fontSize: 16,
    fontWeight: "bold",
    flexShrink: 1,
    color: "#fff",
  },
  exDetails: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  restBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    opacity: 0.5,
  },
  restEmoji: {
    fontSize: 64,
  },
  restTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 16,
  },
  restSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    maxWidth: 240,
  },
  footer: {
    padding: 24,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default PlanDetailsScreen;
