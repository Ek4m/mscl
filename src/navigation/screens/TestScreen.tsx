import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import SplashScreen from "./SplashScreen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../constants/colors";
import { useAppSelector } from "../../redux/root";
import { selectUserInfo } from "../../redux/auth/slice";

const TestScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { userInfo } = useAppSelector(selectUserInfo);
  console.log(userInfo)
  const features = [
    {
      id: "ai",
      title: "AI Architect",
      subtitle: "Build with Gemini AI",
      icon: "auto-fix",
      color: "#3b82f6", // mainBlue
    },
    {
      id: "premade",
      title: "Elite Library",
      subtitle: "Pro-made gym plans",
      icon: "library-shelves",
      color: "#a855f7", // purple
    },
    {
      id: "custom",
      title: "Manual Build",
      subtitle: "Customized precision",
      icon: "plus-box",
      color: "#10b981", // green
    },
  ];

  const myPrograms = [
    {
      id: "p1",
      title: "Hypertrophy Phase 1",
      description: "Focus on maximum muscle volume",
      sessions: 24,
      completed: 18,
      lastActive: "Today",
      intensity: "High",
      tag: "Strength",
    },
    {
      id: "p2",
      title: "Morning Shred",
      description: "High-intensity fat loss protocol",
      sessions: 12,
      completed: 4,
      lastActive: "Yesterday",
      intensity: "Medium",
      tag: "Cardio",
    },
    {
      id: "p3",
      title: "Mobility Foundations",
      description: "Joint health and flexibility",
      sessions: 8,
      completed: 8,
      lastActive: "3 days ago",
      intensity: "Low",
      tag: "Recovery",
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

          {/* Programs List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>YOUR PROGRAMS</Text>
              <Text style={styles.badge}>{myPrograms.length}</Text>
            </View>

            {myPrograms.map((program) => (
              <TouchableOpacity
                key={program.id}
                style={styles.programCard}
                activeOpacity={0.9}
              >
                <View style={styles.programContent}>
                  <View style={styles.programLeft}>
                    <View style={styles.programIconBox}>
                      <Icon name="dumbbell" color={COLORS.mainBlue} size={24} />
                    </View>
                    <View>
                      <View style={styles.programHeaderRow}>
                        <Text style={styles.programTitle}>{program.title}</Text>
                        <View
                          style={[
                            styles.intensityChip,
                            {
                              backgroundColor:
                                program.intensity === "High"
                                  ? "#ef444420"
                                  : "#eab30820",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.intensityText,
                              {
                                color:
                                  program.intensity === "High"
                                    ? "#ef4444"
                                    : "#eab308",
                              },
                            ]}
                          >
                            {program.intensity}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.programDesc}>
                        {program.description}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.programFooter}>
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressTextRow}>
                      <Text style={styles.progressLabel}>Progress</Text>
                      <Text style={styles.progressPercent}>
                        {Math.round(
                          (program.completed / program.sessions) * 100,
                        )}
                        %
                      </Text>
                    </View>
                    <View style={styles.progressRail}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${(program.completed / program.sessions) * 100}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.programMeta}>
                    <Text style={styles.lastActive}>
                      Active: {program.lastActive}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
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
  programCard: {
    backgroundColor: "#18181b",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  programContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  programLeft: {
    flexDirection: "row",
    flex: 1,
  },
  programIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#27272a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  programHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  programTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Oswald",
    textTransform: "uppercase",
  },
  programDesc: {
    color: "#71717a",
    fontSize: 13,
    lineHeight: 18,
  },
  intensityChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  intensityText: {
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  programFooter: {
    borderTopWidth: 1,
    borderTopColor: "#27272a",
    paddingTop: 16,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressLabel: {
    color: "#71717a",
    fontSize: 11,
    fontWeight: "600",
  },
  progressPercent: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },
  progressRail: {
    height: 6,
    backgroundColor: "#27272a",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.mainBlue,
    borderRadius: 3,
  },
  programMeta: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  lastActive: {
    color: "#52525b",
    fontSize: 11,
    fontWeight: "600",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12, // Gap works in modern React Native versions
  },
});

export default TestScreen;
