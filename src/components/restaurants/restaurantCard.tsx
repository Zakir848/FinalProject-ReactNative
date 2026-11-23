import { Colors } from "@/constants/theme";
import useFavorites from "@/context/FavoritesProvider";
import { Restaurant } from "@/models/restaurants.models";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  item: Restaurant;
};

export default function RestaurantCard({ item }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(item.id);

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/restaurants/[id]",
          params: { id: item.id },
        })
      }
    >
      {item.imageUrl !== undefined ? (
        <Image source={{ uri: item?.imageUrl }} style={styles.image} />
      ) : (
        <Ionicons name="image" size={25} />
      )}
      <Pressable
        style={styles.heartBtn}
        hitSlop={10}
        onPress={() => toggleFavorite(item.id)}
      >
        <Ionicons
          name={favorite ? "heart" : "heart-outline"}
          size={22}
          color={favorite ? Colors.favorite : Colors.text}
        />
      </Pressable>
      <View style={styles.content}>
        <Text style={styles.name}>{item?.name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: Colors.border,
    marginVertical: 10,
    backgroundColor: Colors.surface,
  },
  image: {
    width: "100%",
    minHeight: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  heartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 7,
  },
  content: {
    padding: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 20,
  },
  row: {
    flexDirection: "row",
  },
});
