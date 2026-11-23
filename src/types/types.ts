import { Ionicons } from "@expo/vector-icons";
import { KeyboardTypeOptions, StyleProp, ViewStyle } from "react-native";

export type OrderStatus = "pending" | "delivering" | "delivered" | "cancel";

export type Address = {
  id?: string;
  userId: string;
  title: string;
  street: string;
  details?: string;
  latitude: number;
  longitude: number;
};

export type IoniconName = keyof typeof Ionicons.glyphMap;

export type LanguageSelectProps = {
  style?: StyleProp<ViewStyle>;
};

export type ProfileUpdate = {
  fullname: string;
  email: string;
  imageUrl: string;
};

export type ProfileErrors = {
  fullname?: string;
  email?: string;
  image?: string;
};

export type ProfileFieldProps = {
  icon: IoniconName;
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  onChangeText: (value: string) => void;
};
