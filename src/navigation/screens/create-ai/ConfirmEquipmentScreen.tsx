import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CreateAiPlanParamList } from "./types";
import {
  addToSelected,
  removeFromSelectedPredictions,
  selectAiPlan,
} from "../../../redux/workout/create-ai";
import { useAppDispatch, useAppSelector } from "../../../redux/root";
import { COLORS } from "../../../constants/colors";
import SubmitButton from "../../../UI/components/submitButton";

const ConfirmEquipmentScreen: React.FC<
  NativeStackScreenProps<CreateAiPlanParamList, "confirmEquipments">
> = ({
  navigation,
  route: {
    params: { predictions },
  },
}) => {
  const { selectedPredictions } = useAppSelector(selectAiPlan);
  const dispatch = useAppDispatch();

  const onConfirm = () => {
    navigation.navigate("preferences");
  };

  const toggle = (item: string) => {
    if (selectedPredictions.indexOf(item) === -1) {
      dispatch(addToSelected(item));
    } else {
      dispatch(removeFromSelectedPredictions(item));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>We found {predictions.length} items</Text>
        <Text style={styles.subtitle}>
          Confirm what's available in your gym today.(At least 2)
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          {predictions.map((item) => {
            const isSelected = selectedPredictions.indexOf(item) !== -1;
            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.7}
                onPress={() => toggle(item)}
                style={[
                  styles.card,
                  isSelected ? styles.cardSelected : styles.cardUnselected,
                ]}
              >
                <Text
                  style={[
                    styles.cardText,
                    isSelected ? styles.textSelected : styles.textUnselected,
                  ]}
                >
                  {item}
                </Text>

                {isSelected && (
                  <AntDesign name="check" size={24} color={COLORS.lightBlue} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <SubmitButton
          title="Looks Good"
          bgColor={COLORS.mainBlue}
          disabled={selectedPredictions.length < 2}
          onPress={onConfirm}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("upload")}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Add More Photos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  headerSection: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#71717a", // zinc-500
    fontSize: 16,
    marginBottom: 32,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardSelected: {
    backgroundColor: "rgba(6, 182, 212, 0.1)", // cyan-500/10
    borderColor: COLORS.mainBlue,
  },
  cardUnselected: {
    backgroundColor: "#18181b", // zinc-900
    borderColor: "#27272a", // zinc-800
  },
  cardText: {
    textTransform: "uppercase",
  },
  textSelected: {
    color: "#fff",
  },
  textUnselected: {
    color: "#71717a",
  },
  footer: {
    marginTop: 32,
  },
  primaryButton: {
    backgroundColor: COLORS.mainBlue,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.mainBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  primaryButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#a1a1aa", // zinc-400
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ConfirmEquipmentScreen;
