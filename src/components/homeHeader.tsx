import { Colors } from "@/constants/theme";
import { changeLanguage, Language } from "@/i18n";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function HomeHeader() {
  const [open, setOpen] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const selectLanguage = i18n.language.toUpperCase();
  const languages = [{ title: "AZ" }, { title: "EN" }, { title: "RU" }];

  const handleSelectLanguage = (value: string) => {
    changeLanguage(value.toLowerCase() as Language);
  };

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
        <View>
          <Pressable style={styles.languageBox} onPress={() => setOpen(!open)}>
            <View style={styles.languageRow}>
              <Text style={styles.selectText}>{selectLanguage}</Text>
              <Entypo name={open ? "chevron-up" : "chevron-down"} size={18} />
            </View>
          </Pressable>
          <View style={[styles.selectBox, !open && styles.hidden]}>
            {languages.map((item) => (
              <Pressable
                key={item.title}
                style={styles.selectBtn}
                onPress={() => (
                  handleSelectLanguage(item.title),
                  setOpen(false)
                )}
              >
                <Text style={styles.selectText}>{item.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>
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
  languageBox: {
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 50,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  languageRow: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  selectBox: {
    position: "absolute",
    top: 30,
    zIndex: 20,
    width: 55,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.black,
  },
  hidden: {
    display: "none",
  },
  selectBtn: {
    marginVertical: 8,
    width: "80%",
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 50,
    alignItems: "center",
  },
  selectText: {
    fontWeight: "600",
    fontSize: 15,
  },
});
