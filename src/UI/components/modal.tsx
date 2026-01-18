import { StyleSheet, Modal as RNModal, Pressable } from "react-native";
import React, { FC, PropsWithChildren } from "react";

const Modal: FC<
  PropsWithChildren<{ isVisible: boolean; onRequestClose(): void }>
> = ({ isVisible, children, onRequestClose }) => {
  return (
    <RNModal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onRequestClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onRequestClose}>
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
