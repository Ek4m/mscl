import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Alert,
} from "react-native";
import { CameraOptions, launchCamera } from "react-native-image-picker";
import ImagePicker from "expo-image-picker";
import { RootStackParamList } from "../types";
import {
  addFile,
  removeFile,
  selectPredictions,
  useSendImagesMutation,
} from "../../redux/workout/create-ai";
import { useAppDispatch, useAppSelector } from "../../redux/root";
import { generateImages } from "../../modules/prediction/helpers";

const UploadScreen: FC<
  NativeStackScreenProps<RootStackParamList, "upload">
> = ({ navigation }) => {
  const { files } = useAppSelector(selectPredictions);
  const [sendImages] = useSendImagesMutation();
  const dispatch = useAppDispatch();

  const requestCameraPermission = async () => {
    const settings = await ImagePicker.getCameraPermissionsAsync();
    if (settings.granted) return true;
    if (settings.canAskAgain) {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      return granted;
    }

    // 4. Return false if permission was denied and cannot be asked again
    return false;
  };

  const onUpload = () => {
    const formData = generateImages(files);
    sendImages(formData).unwrap();
    setTimeout(() => {
      navigation.navigate("analyzing");
    }, 100);
  };
  const pickImage = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert("Permission denied", "Camera permission is required.");
      return;
    }

    const options: CameraOptions = {
      mediaType: "photo",
      saveToPhotos: true,
    };
    launchCamera(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert("Error", response.errorMessage || "Unknown error");
        return;
      }
      const assets = response.assets;
      if (
        typeof assets !== "undefined" &&
        Array.isArray(assets) &&
        assets.length
      ) {
        dispatch(addFile(assets[0]));
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>Show us your gym</Text>
        <Text style={styles.subtitle}>
          Upload 3–5 photos of the equipment available to you.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {files.map((img, index) => (
          <View key={index} style={styles.imageBox}>
            <Image source={{ uri: img.uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => dispatch(removeFile(index))}
            >
              <Text style={styles.removeIcon}>×</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={pickImage}>
          <Text style={styles.plus}>+</Text>
          <Text style={styles.addText}>Add Photos</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.mainButton, files.length === 0 && styles.disabled]}
          onPress={() => files.length > 0 && onUpload()}
          disabled={files.length === 0}
        >
          <Text
            style={[
              styles.mainButtonText,
              files.length === 0 && styles.disabledText,
            ]}
          >
            {files.length === 0
              ? "Upload Photos"
              : `Analyze ${files.length} Photos`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#000",
  },
  top: {
    marginTop: 40,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageBox: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 16,
    borderRadius: 20,
    borderColor: "grey",
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  removeIcon: {
    color: "#fff",
    fontSize: 16,
  },
  addBtn: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "gray",
  },
  plus: {
    fontSize: 32,
    color: "#333",
  },
  addText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#444",
    textTransform: "uppercase",
  },
  footer: {
    paddingVertical: 24,
  },
  mainButton: {
    backgroundColor: "#22d3ee",
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  mainButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabled: {
    backgroundColor: "#111",
  },
  disabledText: {
    color: "#444",
  },
});

export default UploadScreen;
