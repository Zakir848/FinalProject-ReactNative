import Header from "@/components/header";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import OrderHistory from "../orders/orderHistory";

export default function Orders() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Header title={t("screens.orders")} />
      <OrderHistory/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 10,
  },
});
