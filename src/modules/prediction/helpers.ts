export const formatTime = (totalSeconds: number) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export const getImageUrl = (slug: string) =>
  `https://res.cloudinary.com/dx15pr9xn/image/upload/v1769200908/${slug}.jpg`;
