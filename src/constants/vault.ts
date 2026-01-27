import { Dimensions } from "react-native";

export const ACCESS_TOKEN = "@access_token";
export const API_BASE_URL = __DEV__
  ? "http://10.0.2.2:3000/"
  : "https://api.yourproductionurl.com/";

export const IS_SMALL = Dimensions.get("window").width <= 360;
