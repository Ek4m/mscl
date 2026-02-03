import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FC, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RootStackParamList } from "../types";
import { useAppSelector } from "../../redux/root";
import { selectUserInfo } from "../../redux/auth/slice";

const { width } = Dimensions.get("window");

const SplashScreen: FC<
  NativeStackScreenProps<RootStackParamList, "splash">
> = ({ navigation }) => {
  const { userInfo, isFetching } = useAppSelector(selectUserInfo);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(30)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Parallel entrance animations for content
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(textAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 3500,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!isFetching) {
      navigation.navigate(userInfo ? "home" : "initialInfo");
    }
  }, [userInfo, isFetching]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <View style={styles.content}>
        <Animated.View
          style={[styles.logoContainer, { transform: [{ scale: scaleAnim }] }]}
        >
          <View style={styles.iconCircle}>
            <Icon name="dumbbell" color="#fff" size={54} />
          </View>
        </Animated.View>
        <Animated.View
          style={{
            transform: [{ translateY: textAnim }],
            opacity: textOpacity,
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>
            FORGE <Text style={styles.highlight}>FITNESS</Text>
          </Text>
          <Text style={styles.tagline}>ELITE PERFORMANCE TRAINING</Text>

          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color="#ea580c" />
            <Text style={styles.loadingText}>OPTIMIZING PERFORMANCE...</Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.progressBarBg}>
          <Animated.View
            style={[styles.progressBarFill, { width: progressWidth }]}
          />
        </View>
        <Text style={styles.versionText}>V 2.5.0 • AI POWERED ENGINE</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#ea580c",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ea580c",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 15,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1,
    textAlign: "center",
    fontFamily: "Oswald",
    textTransform: "uppercase",
  },
  highlight: {
    color: "#ea580c",
  },
  tagline: {
    fontSize: 12,
    color: "#71717a",
    letterSpacing: 5,
    marginTop: 8,
    textAlign: "center",
    fontWeight: "800",
  },
  loaderWrapper: {
    marginTop: 40,
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: "#3f3f46",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 8,
  },
  footer: {
    position: "absolute",
    bottom: 60,
    width: width * 0.7,
    alignItems: "center",
  },
  progressBarBg: {
    width: "100%",
    height: 2,
    backgroundColor: "#18181b",
    borderRadius: 1,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#ea580c",
  },
  versionText: {
    color: "#27272a",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
});

export default SplashScreen;
