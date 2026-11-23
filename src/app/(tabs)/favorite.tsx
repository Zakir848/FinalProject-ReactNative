import Header from "@/components/header";
import RestaurantCard from "@/components/restaurants/restaurantCard";
import { Colors } from "@/constants/theme";
import useFavorites from "@/context/FavoritesProvider";
import useFood from "@/context/FoodsProvider";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function favorite() {
  const { t } = useTranslation();
  const { restaurants } = useFood();
  const { favoriteIds } = useFavorites();

  const favoriteRestaurants = restaurants.filter((r) =>
    favoriteIds.includes(r.id),
  );

  return (
    <View style={styles.container}>
      <Header title={t("screens.favorite")} />

      <FlatList
        data={favoriteRestaurants}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          favoriteRestaurants.length === 0 ? styles.emptyContainer : undefined
        }
        renderItem={({ item }) => <RestaurantCard item={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={60} color={Colors.primary} />
            <Text style={styles.emptyTitle}>{t("favorite.emptyTitle")}</Text>
            <Text style={styles.emptyMessage}>
              {t("favorite.emptyMessage")}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 10,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  empty: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  emptyMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
