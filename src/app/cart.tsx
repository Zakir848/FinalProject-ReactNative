import CartItem from "@/components/cartItem";
import Header from "@/components/header";
import { Colors } from "@/constants/theme";
import useFood from "@/context/FoodsProvider";
import useUsers from "@/context/UsersProvider";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";

export default function Cart() {
  const { carts, restaurants } = useFood();
  const { currentUser } = useUsers();
  const { t } = useTranslation();
  const [collapsedSection, setCollapsedSection] = useState<string[]>([]);
  console.log(currentUser);

  const userCart = carts?.filter((f) => f.userId == currentUser?.id) || [];

  const sectionData = (restaurants || [])
    .map((restaurant) => {
      const restaurantItems = userCart.filter(
        (m) => m.restaurantId == restaurant.id,
      );

      const totalPrice = restaurantItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const isCollapsed = collapsedSection?.includes(restaurant.name.trim());

      return {
        title: restaurant.name,
        sum: totalPrice,
        data: isCollapsed ? [] : restaurantItems,
      };
    })
    .filter((section) => section.sum > 0);

  const totalPrice = userCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleShowRestaurantCard = (title: string) => {
    setCollapsedSection((prev) =>
      prev.includes(title.trim())
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  return (
    <View style={styles.container}>
      <Header title={t("screens.cart")} />

      <SectionList
        sections={sectionData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => <CartItem items={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderSectionHeader={({ section: { title, sum } }) => {
          const has = collapsedSection?.includes(title.trim());
          return (
            <TouchableOpacity
              style={styles.sectionHeaderRow}
              onPress={() => handleShowRestaurantCard(title)}
            >
              <Text style={styles.sectionHeader}>{title}</Text>
              <View style={styles.sectionTotalRow}>
                <Text style={styles.sectionHeader}>
                  {t("cart.sectionTotal", { amount: sum.toFixed(2) })}
                </Text>
                <MaterialIcons
                  name={has ? "keyboard-arrow-down" : "keyboard-arrow-up"}
                  size={25}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
      {userCart.length > 0 && (
        <View style={styles.footer}>
          <View>
            <Text style={styles.totalLabel}>{t("cart.totalPrice")}</Text>
            <Text style={styles.totalValue}>{totalPrice.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.orderButton}
            onPress={() =>
              router.push({
                pathname: "/orders/currentOrder",
              })
            }
          >
            <Text style={styles.orderButtonText}>{t("cart.order")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTotalRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
  },
  footer: {
    paddingBottom: StatusBar.currentHeight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  totalLabel: {
    fontSize: 13,
    color: "gray",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text || "#000",
  },
  orderButton: {
    backgroundColor: Colors.primary || "#FF6347",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  orderButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
