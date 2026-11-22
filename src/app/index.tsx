import { useEffect, useRef } from "react";
import { View, Text, Animated, StatusBar, StyleSheet } from "react-native";
import { router } from "expo-router";
import useUsers from "@/context/UsersProvider";
import { useTranslation } from "react-i18next";

export default function SplashScreen() {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const { currentUser } = useUsers();
  const { t } = useTranslation();

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace(currentUser ? "/home" : "/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [scale, opacity]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View
        style={[styles.content, { opacity, transform: [{ scale }] }]}
      >
        <Text style={styles.logo}>Foodora</Text>
        <Text style={styles.subtitle}>{t("splash.subtitle")}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#21000F",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 52,
    fontWeight: "900",
    letterSpacing: -2,
  },
  subtitle: {
    color: "#F5C5D8",
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 10,
  },
});
