import { Colors } from "@/constants/theme";
import useFood from "@/context/FoodsProvider";
import useUsers from "@/context/UsersProvider";
import { Food } from "@/models/foods.models";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
  id: string;
  items: Food;
};

export default function FoodCard({ id, items }: Props) {
  const { carts, addCart, decreaseFood } = useFood();
  const { currentUser } = useUsers();

  const findCart = carts.find(
    (f) => f.foodId === items.id && f.userId === currentUser?.id,
  );

  const quantity = findCart?.quantity ?? 0;

  const newCart: any = {
    userId: currentUser.id,
    restaurantId: id,
    foodId: items.id,
    name: items.name,
    category: items.category,
    imageUrl: items.imageUrl,
    price: items.price,
    quantity: 1,
  };

  return (
    <View style={styles.container}>
      {items?.imageUrl !== undefined ? (
        <Image source={{ uri: items?.imageUrl }} style={styles.image} />
      ) : (
        <Entypo name="image-inverted" size={25} />
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{items?.name}</Text>
        <Text style={styles.price}>$ {items.price}</Text>
      </View>
      {quantity > 0 ? (
        <View style={styles.counter}>
          <FontAwesome5
            name="minus"
            color={"#fff"}
            size={16}
            style={styles.iconBtn}
            onPress={() => decreaseFood(findCart!.id)}
          />
          <Text style={styles.quantity}>{quantity}</Text>
          <FontAwesome5
            name="plus"
            color={"#fff"}
            size={16}
            style={styles.iconBtn}
            onPress={() => addCart(newCart)}
          />
        </View>
      ) : (
        <View style={styles.addWrapper}>
          <FontAwesome5
            name="plus"
            color={"#fff"}
            size={16}
            style={styles.iconBtn}
            onPress={() => addCart(newCart)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 60,
    minHeight: 60,
    borderRadius: 10,
  },
  info: {
    padding: 10,
    flex: 3,
  },
  name: {
    fontWeight: "bold",
    fontSize: 20,
  },
  price: {
    fontWeight: "600",
    fontSize: 16,
  },
  counter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    width: 100,
  },
  quantity: {
    fontWeight: "600",
    fontSize: 16,
  },
  addWrapper: {
    width: 100,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  iconBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
});
