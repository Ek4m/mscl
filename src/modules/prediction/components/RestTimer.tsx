import React, { Dispatch, FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesignIcons from "react-native-vector-icons/AntDesign";
import IonIcons from "react-native-vector-icons/Ionicons";

import { COLORS } from "../../../constants/colors";
import { formatTime } from "../helpers";
import Modal from "../../../UI/components/modal";

interface RestTimerProps {
  restSeconds: number;
  setRestSeconds: Dispatch<React.SetStateAction<number>>;
  setIsResting(val: boolean): void;
  isVisible: boolean;
}

const RestTimer: FC<RestTimerProps> = ({
  restSeconds,
  setRestSeconds,
  setIsResting,
  isVisible,
}) => {
  return (
    <Modal onRequestClose={() => setIsResting(false)} isVisible={isVisible}>
      <View style={styles.restCard}>
        <View style={styles.restInfo}>
          <View style={styles.restIcon}>
            <IonIcons name="timer-outline" size={50} color="#ffffff" />
          </View>
          <View>
            <Text style={styles.restLabel}>Rest Timer</Text>
            <Text style={styles.restTime}>{formatTime(restSeconds)}</Text>
          </View>
        </View>

        <View style={styles.restActions}>
          <TouchableOpacity
            style={styles.restAdd}
            onPress={() => setRestSeconds((s) => s + 30)}
          >
            <Text style={styles.restAddText}>+30s</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restSkip}
            onPress={() => setIsResting(false)}
          >
            <AntDesignIcons
              name="fast-forward"
              size={20}
              color={COLORS.mainBlue}
            />
            <Text style={styles.restSkipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RestTimer;

const styles = StyleSheet.create({
  restCard: {
    backgroundColor: COLORS.mainBlue,
    borderRadius: 20,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  restInfo: {
    alignItems: "center",
    gap: 12,
  },
  restIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 8,
    borderRadius: 12,
  },
  restLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  restTime: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
  },
  restActions: {
    flexDirection: "row",
    marginTop: 20,
    gap: 8,
  },
  restAdd: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  restAddText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  restSkip: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  restSkipText: {
    color: COLORS.mainBlue,
    fontSize: 15,
    fontWeight: "700",
  },
});
