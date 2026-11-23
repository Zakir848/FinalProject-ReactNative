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
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
        restaurantId: restaurant.id,
        title: restaurant.name,
        sum: totalPrice,
        data: isCollapsed ? [] : restaurantItems,
      };
    })
    .filter((section) => section.sum > 0);

  // Səbətdə tək restoran varsa avtomatik seçilir
  const selectedSection =
    sectionData.find((s) => s.restaurantId === selectedId) ??
    (sectionData.length === 1 ? sectionData[0] : undefined);

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
        renderSectionHeader={({ section: { restaurantId, title, sum } }) => {
          const has = collapsedSection?.includes(title.trim());
          const selected = selectedSection?.restaurantId === restaurantId;
          return (
            <View
              style={[
                styles.sectionHeaderRow,
                selected && styles.sectionHeaderSelected,
              ]}
            >
              <TouchableOpacity
                style={styles.sectionSelect}
                onPress={() => setSelectedId(restaurantId)}
              >
                <Ionicons
                  name={selected ? "radio-button-on" : "radio-button-off"}
                  size={22}
                  color={selected ? Colors.primary : Colors.textDisabled}
                />
                <Text style={styles.sectionHeader} numberOfLines={1}>
                  {title}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sectionTotalRow}
                onPress={() => handleShowRestaurantCard(title)}
              >
                <Text style={styles.sectionHeader}>
                  {t("cart.sectionTotal", { amount: sum.toFixed(2) })}
                </Text>
                <MaterialIcons
                  name={has ? "keyboard-arrow-down" : "keyboard-arrow-up"}
                  size={25}
                />
              </TouchableOpacity>
            </View>
          );
        }}
      />
      {userCart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.footerInfo}>
            <Text style={styles.totalLabel} numberOfLines={1}>
              {selectedSection
                ? selectedSection.title
                : t("cart.selectRestaurant")}
            </Text>
            <Text style={styles.totalValue}>
              {(selectedSection?.sum ?? 0).toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.orderButton,
              !selectedSection && styles.orderButtonDisabled,
            ]}
            disabled={!selectedSection}
            onPress={() =>
              selectedSection &&
              router.push({
                pathname: "/orders/currentOrder",
                params: { restaurantId: selectedSection.restaurantId },
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
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  sectionHeaderSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  sectionSelect: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTotalRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 16,
    flexShrink: 1,
  },
  footerInfo: {
    flex: 1,
    marginRight: 12,
  },
  orderButtonDisabled: {
    opacity: 0.4,
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
