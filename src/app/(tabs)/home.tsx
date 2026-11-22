import HomeHeader from "@/components/homeHeader";
import RestaurantCard from "@/components/restaurants/restaurantCard";
import { Colors } from "@/constants/theme";
import useFood from "@/context/FoodsProvider";
import useUsers from "@/context/UsersProvider";
import { useUserCart } from "@/hooks/useUserCart";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

export default function home() {
  const { restaurants, clearCart } = useFood();
  const { currentUser } = useUsers();
  const { count } = useUserCart();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <HomeHeader />

      <View style={styles.searchBar}>
        <Ionicons name="search" size={25} />
        <TextInput
          placeholder={t("home.searchPlaceholder")}
          style={styles.searchInput}
        />
      </View>
      <View style={styles.cartWrapper}>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => router.push("/cart")}
          onLongPress={() => clearCart(currentUser.id)}
        >
          <Feather name="shopping-bag" size={25} color={Colors.background} />
        </TouchableOpacity>
        {count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <RestaurantCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
  },
  image: {
    width: "100%",
    minHeight: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  searchBar: {
    borderWidth: 1,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    marginVertical: 10,
    backgroundColor: Colors.background,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  cartWrapper: {
    position: "absolute",
    bottom: "2%",
    zIndex: 10,
    right: "3%",
    padding: 8,
  },
  cartBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 10,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  badge: {
    position: "absolute",
    right: "5%",
    top: "-10%",
    backgroundColor: Colors.primaryLight,
    borderRadius: 50,
    paddingHorizontal: 8,
    padding: 3,
  },
  badgeText: {
    fontWeight: "600",
    fontSize: 15,
  },
});
