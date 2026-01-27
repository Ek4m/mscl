import React, { FC, ReactNode } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  NavigationHelpers,
  StackNavigationState,
} from "@react-navigation/native";

import { RootStackParamList } from "../../navigation/types";
import { COLORS } from "../../constants/colors";

interface MainLayoutProps {
  navigation: NavigationHelpers<RootStackParamList>;
  state: StackNavigationState<RootStackParamList>;
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ navigation, children, state }) => {
  const activeRouteName = state.routes[state.index].name;
  return (
    <View style={styles.container}>
      <View style={styles.main}>{children}</View>

      <View style={styles.tabBarWrapper}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("home")}
          >
            <IonIcons
              name={activeRouteName === "home" ? "home" : "home-outline"}
              size={24}
              color={activeRouteName === "home" ? COLORS.mainBlue : "#71717a"}
            />
            <Text
              style={[
                styles.tabLabel,
                activeRouteName === "home" && styles.activeLabel,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("profile")}
          >
            <IonIcons
              name={activeRouteName === "profile" ? "person" : "person-outline"}
              size={24}
              color={
                activeRouteName === "profile" ? COLORS.mainBlue : "#71717a"
              }
            />
            <Text
              style={[
                styles.tabLabel,
                activeRouteName === "profile" && styles.activeLabel,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MainLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  main: {
    flex: 1,
  },
  tabBarWrapper: {
    backgroundColor: "#18181b",
    borderTopWidth: 1,
    borderTopColor: "#27272a",
    paddingBottom: Platform.OS === "ios" ? 25 : 10,
  },
  tabBar: {
    flexDirection: "row",
    height: 60,
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabItem: {
    flex: 1, // Equal width for both buttons
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: "#71717a",
    fontWeight: "500",
  },
  activeLabel: {
    color: COLORS.mainBlue,
    fontWeight: "700",
  },
});
