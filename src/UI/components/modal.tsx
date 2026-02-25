import React, { FC, PropsWithChildren } from "react";
import {
  StyleSheet,
  Modal as RNModal,
  Pressable,
  Dimensions,
} from "react-native";

// Get screen dimensions to ensure full coverage
const { height, width } = Dimensions.get("window");

interface ModalProps {
  isVisible: boolean;
  onRequestClose: () => void;
  overlayClickable?: boolean;
}

const Modal: FC<PropsWithChildren<ModalProps>> = ({
  isVisible,
  children,
  onRequestClose,
  overlayClickable = true,
}) => {
  return (
    <RNModal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onRequestClose}
      // This prop is key for Android to cover the status bar area
      statusBarTranslucent={true}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => {
          if (overlayClickable) onRequestClose();
        }}
      >
        {children}
      </Pressable>
    </RNModal>
  );
};

export default Modal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
