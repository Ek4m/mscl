import { Asset } from 'react-native-image-picker';

export const generateImages = (files: Asset[]) => {
  const formData = new FormData();
  if (__DEV__) {
    const dummyImages = [
      'https://habitatgym.com.au/_astro/hero-home.CCo3jRKF_Z2liPpr.webp',
      'https://www.hussle.com/blog/wp-content/uploads/2020/12/Gym-structure-1080x675.png',
      'https://www.sluisgym.nl/wp-content/uploads/2024/03/Sluisgym-250324-020.jpg',
    ];
    dummyImages.forEach((url, index) => {
      const suffix = url.split('.').pop() || '';
      const filename = `dummy_image_${index}.${suffix}`;
      formData.append('images', {
        uri: url,
        name: filename,
        type: `image/${suffix}`,
      } as any);
    });
  } else {
    files.forEach((img, index) => {
      const filename =
        img.originalPath?.split('/').pop() || `photo_${index}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('images', {
        uri: img.originalPath,
        name: filename,
        type,
      } as any);
    });
  }
  return formData;
};
