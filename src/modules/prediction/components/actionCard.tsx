import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import FaIcons from "react-native-vector-icons/FontAwesome5";

const ActionCard: FC<{
  title: string;
  icon: string;
  subtitle: string;
  onPress: () => void;
  color: string;
}> = ({ title, icon, subtitle, onPress, color }) => (
  <TouchableOpacity
    style={styles.actionCard}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
      <FaIcons name={icon} size={20} color={color} />
    </View>
    <View>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

export default ActionCard;

const styles = StyleSheet.create({
  actionCard: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  actionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  actionSubtitle: {
    color: "#71717a",
    fontSize: 12,
  },
});
