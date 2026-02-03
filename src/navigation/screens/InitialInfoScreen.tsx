import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import FearherIcon from "react-native-vector-icons/Feather";
import OctiIcon from "react-native-vector-icons/Octicons";
import { COLORS } from "../../constants/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
const { width } = Dimensions.get("window");

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Stat {
  label: string;
  value: string;
}

interface WorkoutSession {
  id: string;
  name: string;
  duration: string;
  difficulty: string;
  calories: number;
  imageUrl: string;
}

const InitialInfoScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, "initialInfo">
> = ({ navigation }) => {
  const features: Feature[] = [
    {
      id: "1",
      title: "AI Personal Coach",
      description: "Dynamic workout adjustments powered by Gemini AI.",
      icon: <FearherIcon name="zap" size={24} color={COLORS.mainBlue} />,
    },
    {
      id: "2",
      title: "Elite Equipment",
      description: "Access to world-class strength and conditioning gear.",
      icon: (
        <FontAwesome5Icon name="dumbbell" size={24} color={COLORS.mainBlue} />
      ),
    },
    {
      id: "3",
      title: "Analytics",
      description: "Track every lift and heart beat with our ecosystem.",
      icon: <FearherIcon name="activity" size={24} color={COLORS.mainBlue} />,
    },
  ];

  const workouts: WorkoutSession[] = [
    {
      id: "w1",
      name: "Forge Strength",
      duration: "45 min",
      difficulty: "Intermediate",
      calories: 450,
      imageUrl:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400",
    },
    {
      id: "w2",
      name: "High Octane HIIT",
      duration: "30 min",
      difficulty: "Advanced",
      calories: 600,
      imageUrl:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000",
          }}
          style={styles.hero}
        >
          <View style={styles.overlay}>
            <View>
              <View style={styles.heroBadge}>
                <View style={styles.line} />
                <Text style={styles.badgeText}>FORGE YOUR FUTURE</Text>
              </View>
              <Text style={styles.heroTitle}>
                BUILD THE{"\n"}
                <Text style={styles.highlightText}>ULTIMATE YOU</Text>
              </Text>
              <Text style={styles.heroSub}>
                Experience elite training with AI-personalized programs and a
                community of high-performers.
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("auth")}
                style={styles.primaryBtn}
              >
                <Text style={styles.primaryBtnText}>START YOUR JOURNEY</Text>
                <FearherIcon name="chevron-right" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            ELITE <Text style={{ color: COLORS.mainBlue }}>ECOSYSTEM</Text>
          </Text>
          <View style={styles.featureGrid}>
            {features.map((f) => (
              <View key={f.id} style={styles.featureCard}>
                <View style={styles.iconWrapper}>{f.icon}</View>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.description}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              POPULAR <Text style={{ color: COLORS.mainBlue }}>WORKOUTS</Text>
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.workoutList}
          >
            {workouts.map((w) => (
              <View key={w.id} style={styles.workoutCard}>
                <Image source={{ uri: w.imageUrl }} style={styles.workoutImg} />
                <View style={styles.workoutOverlay}>
                  <View style={styles.diffBadge}>
                    <Text style={styles.diffText}>{w.difficulty}</Text>
                  </View>
                  <Text style={styles.workoutName}>{w.name}</Text>
                  <View style={styles.row}>
                    <FearherIcon
                      name="clock"
                      size={12}
                      color={COLORS.mainBlue}
                    />
                    <Text style={styles.workoutMeta}>{w.duration}</Text>
                    <OctiIcon
                      name="flame"
                      size={12}
                      color={COLORS.mainBlue}
                      style={{ marginLeft: 10 }}
                    />
                    <Text style={styles.workoutMeta}>{w.calories} Cal</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.aiCard}>
          <View style={styles.aiBadge}>
            <FearherIcon name="zap" size={12} color={COLORS.mainBlue} />
            <Text style={styles.aiBadgeText}>POWERED BY GEMINI</Text>
          </View>
          <Text style={styles.aiTitle}>
            YOUR GUIDE,{"\n"}
            <Text style={{ color: COLORS.mainBlue }}>EVOLVED.</Text>
          </Text>
          <Text style={styles.aiDesc}>
            Create plans by uploading gym equipment images
          </Text>
          <TouchableOpacity style={styles.whiteBtn}>
            <Text style={styles.whiteBtnText}>TRY WITH AI</Text>
            <FearherIcon
              name="message-square"
              size={18}
              color={COLORS.mainBlue}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.planSection}>
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <View style={styles.iconCircle}>
                <FearherIcon
                  name="settings"
                  size={20}
                  color={COLORS.lightBlue}
                />
              </View>
              <View>
                <Text style={styles.planTitle}>PLAN BUILDER</Text>
                <Text style={styles.planSub}>
                  Tailor your intensity and volume
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.openDesignerBtn} onPress={() => {}}>
              <Text style={styles.openDesignerBtnText}>DESIGN CUSTOM PLAN</Text>
              <FearherIcon name="plus" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoIcon: {
    backgroundColor: COLORS.mainBlue,
    padding: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  logoText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    fontStyle: "italic",
  },
  joinBtn: {
    backgroundColor: COLORS.mainBlue,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  joinBtnText: { color: "white", fontWeight: "bold", fontSize: 12 },

  hero: { height: 500, width: width },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  heroBadge: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  line: {
    width: 30,
    height: 2,
    backgroundColor: COLORS.mainBlue,
    marginRight: 10,
  },
  badgeText: {
    color: COLORS.mainBlue,
    fontWeight: "bold",
    letterSpacing: 2,
    fontSize: 12,
  },
  heroTitle: {
    color: "white",
    fontSize: 42,
    fontWeight: "900",
    fontStyle: "italic",
  },
  highlightText: { color: COLORS.mainBlue },
  heroSub: { color: "#ccc", fontSize: 16, marginTop: 15, lineHeight: 24 },
  primaryBtn: {
    backgroundColor: COLORS.mainBlue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginTop: 30,
  },
  primaryBtnText: {
    color: "white",
    fontWeight: "bold",
    letterSpacing: 1,
    marginRight: 8,
  },
  section: { padding: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  featureGrid: { gap: 15 },
  featureCard: {
    backgroundColor: "#141414",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222",
  },
  iconWrapper: { marginBottom: 15 },
  featureTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  featureDesc: { color: "#888", fontSize: 14 },

  workoutList: { flexDirection: "row" },
  workoutCard: {
    width: width * 0.7,
    height: 350,
    marginRight: 15,
    borderRadius: 15,
    overflow: "hidden",
  },
  workoutImg: { width: "100%", height: "100%" },
  workoutOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  workoutName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  workoutMeta: { color: "#ccc", fontSize: 12, marginLeft: 5 },
  diffBadge: {
    backgroundColor: COLORS.mainBlue,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 10,
  },
  diffText: { color: "white", fontSize: 10, fontWeight: "bold" },
  row: { flexDirection: "row", alignItems: "center" },
  aiCard: {
    margin: 20,
    padding: 30,
    backgroundColor: "#0b1a19",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#113331",
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(182, 255, 243, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  aiBadgeText: {
    color: COLORS.mainBlue,
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 5,
  },
  aiTitle: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 15,
  },
  aiDesc: { color: "#aaa", fontSize: 16, marginBottom: 25 },
  whiteBtn: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 8,
  },
  whiteBtnText: {
    color: COLORS.mainBlue,
    fontWeight: "bold",
    marginRight: 10,
  },
  planSection: { marginBottom: 30, padding: 20 },
  planCard: {
    backgroundColor: "#111",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#222",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.lightBlue,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: { elevation: 5 },
    }),
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 25,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0f191a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#16f5f930",
  },
  planTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1,
  },
  planSub: { color: "#666", fontSize: 12, marginTop: 2 },
  openDesignerBtn: {
    backgroundColor: COLORS.mainBlue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    gap: 10,
  },
  openDesignerBtnText: {
    color: "white",
    fontWeight: "800",
    fontSize: 13,
    letterSpacing: 1,
  },
});

export default InitialInfoScreen;
