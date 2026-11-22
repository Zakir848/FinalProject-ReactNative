import { Colors } from "@/constants/theme";
import useFood from "@/context/FoodsProvider";
import { Cart } from "@/models/foods.models";
import { FontAwesome5 } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  items: Cart;
};

export default function CartItem({ items }: Props) {
  const { addCart, decreaseFood } = useFood();

  return (
    <View style={styles.container}>
      <View>
        <Image source={{ uri: items.imageUrl }} style={styles.image} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{items.name}</Text>
        <Text style={styles.price}>$ {items.price.toFixed(2)}</Text>
      </View>
      <View style={styles.btnContent}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => decreaseFood(items.id)}
        >
          <FontAwesome5 name="minus" size={20} color="gray" />
        </TouchableOpacity>
        <Text style={styles.quantity}>{items.quantity}</Text>
        <TouchableOpacity style={styles.btn} onPress={() => addCart(items)}>
          <FontAwesome5 name="plus" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 110,
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginHorizontal: 10,
    gap: 10,
    justifyContent: "space-between",
  },
  name: {
    fontWeight: "900",
    fontSize: 18,
  },
  price: {
    fontWeight: "bold",
    fontSize: 18,
  },
  quantity: {
    fontWeight: "600",
    fontSize: 18,
  },
  btn: {
    borderRadius: 50,
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderRadius: 10,
    borderColor: Colors.border,
    borderWidth: 1,
    padding: 5,
  },
});
