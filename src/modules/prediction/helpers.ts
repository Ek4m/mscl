import { ImagePickerAsset } from "expo-image-picker";

export const generateImages = (files: ImagePickerAsset[]) => {
  const formData = new FormData();
  if (__DEV__) {
    const dummyImages = [
      "https://www.hussle.com/blog/wp-content/uploads/2020/12/Gym-structure-1080x675.png",
      "https://www.sluisgym.nl/wp-content/uploads/2024/03/Sluisgym-250324-020.jpg",
    ];
    dummyImages.forEach((url, index) => {
      const suffix = url.split(".").pop() || "";
      const filename = `dummy_image_${index}.${suffix}`;
      formData.append("images", {
        uri: url,
        name: filename,
        type: `image/${suffix}`,
      } as any);
    });
  } else {
    files.forEach((img, index) => {
      const filename = img.uri?.split("/").pop() || `photo_${index}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("images", {
        uri: img.uri,
        name: filename,
        type,
      } as any);
    });
  }
  return formData;
};

export const formatTime = (totalSeconds: number) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};
