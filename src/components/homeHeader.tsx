import LanguageSelect from "@/components/languageSelect";
import { Colors } from "@/constants/theme";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function HomeHeader() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Ionicons
        name="location"
        color={"#E90064"}
        size={22}
        style={styles.locationIcon}
      />

      <View style={styles.addressBox}>
        <Text style={styles.addressLabel}>{t("home.deliveryAddress")}</Text>
        <View style={styles.addressRow}>
          <Text style={styles.addressText}>Bakı, Azadlıq</Text>
          <Entypo name="chevron-down" size={18} />
        </View>
      </View>
      <View style={styles.actions}>
        <LanguageSelect />
        <Ionicons name="notifications-outline" size={22} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    zIndex: 20,
  },
  locationIcon: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 50,
    padding: 8,
  },
  addressBox: {
    flex: 1,
  },
  addressLabel: {
    color: Colors.textSecondary,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addressText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    padding: 5,
  },
});
