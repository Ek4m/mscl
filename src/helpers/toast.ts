import Toast from "react-native-toast-message";

export const successToast = (message: string | string[]) => {
  const messages = Array.isArray(message) ? message : [message];
  messages.forEach((msg) => {
    Toast.show({
      type: "success",
      text1: msg,
    });
  });
};

export const errorToast = (message: string | string[]) => {
  const messages = Array.isArray(message) ? message : [message];
  messages.forEach((msg) => {
    Toast.show({
      type: "error",
      text1: "Failure!",
      text2: msg,
    });
  });
};
