import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "react-native";
import { useTranslation } from "react-i18next";

export default function _layout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        header: () => {
          StatusBar.setBarStyle("dark-content");
        },
        tabBarInactiveTintColor: "gray",
        tabBarActiveTintColor: "#E90064",
        tabBarStyle: {
          height: 100,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={focused ? "#E90064" : "gray"}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: t("tabs.favorite"),
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              color={focused ? "#E90064" : "gray"}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t("tabs.orders"),
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              color={focused ? "#E90064" : "gray"}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="person-outline"
              color={focused ? "#E90064" : "gray"}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
