import Header from "@/components/header";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function Payments() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Header title={t("screens.payments")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 10,
  },
});
