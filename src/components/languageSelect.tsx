import { Colors } from "@/constants/theme";
import { changeLanguage, Language, SUPPORTED_LANGUAGES } from "@/i18n";
import { LanguageSelectProps } from "@/types/types";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function LanguageSelect({ style }: LanguageSelectProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { i18n } = useTranslation();
  const current = i18n.language;

  const handleSelect = (language: Language) => {
    changeLanguage(language);
    setOpen(false);
  };

  return (
    <View style={[styles.wrapper, style]}>
      <Pressable style={styles.languageBox} onPress={() => setOpen(!open)}>
        <Text style={styles.selectText}>{current.toUpperCase()}</Text>
        <Entypo name={open ? "chevron-up" : "chevron-down"} size={18} />
      </Pressable>

      {open && (
        <View style={styles.selectBox}>
          {SUPPORTED_LANGUAGES.map((language) => {
            const active = language === current;
            return (
              <Pressable
                key={language}
                style={[styles.selectBtn, active && styles.selectBtnActive]}
                onPress={() => handleSelect(language)}
              >
                <Text
                  style={[styles.selectText, active && styles.selectTextActive]}
                >
                  {language.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 20,
  },
  languageBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  selectBox: {
    position: "absolute",
    top: 34,
    right: 0,
    zIndex: 20,
    width: 60,
    paddingVertical: 4,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  selectBtn: {
    width: "80%",
    marginVertical: 4,
    paddingVertical: 3,
    borderRadius: 50,
    alignItems: "center",
  },
  selectBtnActive: {
    backgroundColor: Colors.primaryLight,
  },
  selectText: {
    fontWeight: "600",
    fontSize: 15,
    color: Colors.text,
  },
  selectTextActive: {
    color: Colors.primary,
  },
});
