import useFood from "@/context/FoodsProvider";
import { Entypo } from "@expo/vector-icons";
import { router, Slot, useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

export default function RestaurantDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { restaurants } = useFood();

  const restaurant = restaurants.find((f) => f.id == id);

  return (
    <View style={styles.header}>
      <View>
        <Image source={{ uri: restaurant?.imageUrl }} style={styles.image} />
        <View style={styles.backBtnWrapper}>
          <Entypo
            name="chevron-left"
            color={"#FFF"}
            size={30}
            onPress={() => router.back()}
            style={styles.backBtn}
          />
        </View>
      </View>
      <View style={styles.container}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 250,
  },
  backBtnWrapper: {
    position: "absolute",
    top: "20%",
    paddingHorizontal: 20,
  },
  backBtn: {
    backgroundColor: "#d3d3d35d",
    borderRadius: 50,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
  },
});
