import useFood from "@/context/FoodsProvider";
import { useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";
import { Colors } from "@/constants/theme";
import FoodCard from "@/components/foods/foodCard";

export default function FoodList() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { restaurants } = useFood();
  const restaurant = restaurants.find((f) => f.id == id);
  const foods = restaurant?.foods ?? [];
  return (
    <FlatList
      data={foods}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => <FoodCard id={id} items={item} />}
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    width: "100%",
  },
});
