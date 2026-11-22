import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
};

export default function Header({ title }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        <FontAwesome5
          name="chevron-left"
          size={20}
          onPress={() => router.back()}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.side} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 10,
    flexDirection: "row",
  },
  side: {
    flexGrow: 1,
  },
  title: {
    fontWeight: "900",
    fontSize: 20,
    flexGrow: 2,
    textAlign: "center",
  },
});
