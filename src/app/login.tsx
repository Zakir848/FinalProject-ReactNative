import { client } from "@/api/authContext";
import LanguageSelect from "@/components/languageSelect";
import useUsers from "@/context/UsersProvider";
import {
  FontAwesome5,
  Fontisto,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

type Form = {
  email: string;
  password: string;
};

type Error = {
  errorEmail: string;
  errorPassword: string;
  anyError: string;
};

export default function login() {
  const { handleLogin } = useUsers();
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<Error>({
    errorEmail: "",
    errorPassword: "",
    anyError: "",
  });
  const [form, setForm] = useState<Form>({
    email: "",
    password: "",
  });

  const handleCheck = async () => {
    if (!form.email && !form.password) {
      handleError("anyError", t("validation.fillAll"));
      setErrors({
        errorEmail: " ",
        errorPassword: " ",
        anyError: t("validation.fillAll"),
      });
      return;
    }

    if (!form.email) {
      handleError("errorEmail", t("validation.enterEmail"));
      return;
    }
    if (!form.password) {
      handleError("errorPassword", t("validation.enterPassword"));
      return;
    }

    if (!form.email.includes("@")) {
      handleError("errorEmail", t("validation.emailAtSymbol"));
      return;
    }

    const user = await client.get("/users", {
      params: {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      },
    });

    if (!user) {
      handleError("anyError", t("validation.invalidCredentials"));
      return;
    }

    setErrors({
      errorEmail: "",
      errorPassword: "",
      anyError: "",
    });

    handleLogin(form);
  };

  const handleError = (key: keyof Error, value: string) => {
    setErrors({
      errorEmail: "",
      errorPassword: "",
      anyError: "",
      [key]: value,
    });
  };

  const handleChangeText = (key: keyof Form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/Foodora.png")}
        style={styles.logo}
        resizeMode="cover"
      />
      <LanguageSelect style={styles.languageSelect} />
      <View style={styles.content}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>{t("login.title")}</Text>
          <Text>{t("login.subtitle")}</Text>
        </View>

        <View style={[styles.input, !!errors.errorEmail && styles.inputError]}>
          <Ionicons name="mail-outline" size={22} />
          <TextInput
            placeholder={t("form.email")}
            value={form.email}
            onChangeText={(value) => handleChangeText("email", value.trim())}
            style={styles.textInput}
          />
        </View>
        {errors.errorEmail && (
          <Text
            style={[
              styles.error,
              errors.errorEmail === " " && styles.errorHidden,
            ]}
          >
            {errors.errorEmail}
          </Text>
        )}
        <View
          style={[styles.input, !!errors.errorPassword && styles.inputError]}
        >
          <MaterialIcons name="lock-outline" size={22} />
          <TextInput
            placeholder={t("form.password")}
            value={form.password}
            onChangeText={(value) => handleChangeText("password", value.trim())}
            style={styles.textInput}
            secureTextEntry={open ? false : true}
          />
          <Ionicons
            name={open ? "eye-off" : "eye"}
            size={20}
            onPress={() => setOpen(!open)}
            style={styles.eyeIcon}
          />
        </View>
        {errors.errorPassword && (
          <Text
            style={[
              styles.error,
              errors.errorPassword === " " && styles.errorHidden,
            ]}
          >
            {errors.errorPassword}
          </Text>
        )}
        {errors.anyError && <Text style={styles.error}>{errors.anyError}</Text>}
        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.linkText}>{t("login.forgotPassword")}</Text>
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btn} onPress={handleCheck}>
            <Text style={styles.btnText}>{t("login.submit")}</Text>
          </TouchableOpacity>
          <View style={styles.divider}>
            <Text style={styles.dividerText}>{t("common.or")}</Text>
          </View>
          <View style={styles.platformBox}>
            <TouchableOpacity style={styles.platform}>
              <FontAwesome5 name="google" size={20} />
              <Text style={styles.platformText}>{t("login.withGoogle")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.platform}>
              <Fontisto name="apple" size={20} />
              <Text style={styles.platformText}>{t("login.withApple")}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.register}>
            <Text>{t("login.noAccount")}</Text>
            <TouchableOpacity onPress={() => router.replace("/register")}>
              <Text style={styles.linkText}>{t("login.register")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#ffffff",
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#EAE4E8",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 5,
  },
  btn: {
    paddingVertical: 15,
    backgroundColor: "#E90064",
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 10,
  },
  platformBox: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  platform: {
    flexDirection: "row",
    borderRadius: 10,
    borderColor: "#EAE4E8",
    borderWidth: 1,
    gap: 10,
    alignItems: "center",
    paddingHorizontal: 30,
    minHeight: 55,
  },
  title: {
    fontWeight: "900",
    fontSize: 30,
  },
  register: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  divider: {
    height: 2,
    backgroundColor: "#EAE4E8",
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerText: {
    position: "absolute",
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    marginTop: -10,
    fontWeight: "600",
  },
  error: {
    color: "red",
  },
  logo: {
    maxHeight: 200,
    width: "100%",
  },
  languageSelect: {
    position: "absolute",
    top: (StatusBar.currentHeight ?? 0) + 10,
    right: 16,
  },
  textInput: {
    flex: 1,
  },
  inputError: {
    borderColor: "red",
  },
  eyeIcon: {
    padding: 5,
    backgroundColor: "#d3d3d369",
    borderRadius: 50,
  },
  errorHidden: {
    position: "absolute",
  },
  linkText: {
    color: "#E90064",
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 20,
    flex: 1,
  },
  titleBox: {
    paddingVertical: 20,
  },
  forgotBtn: {
    alignItems: "flex-end",
    marginVertical: 20,
  },
  actions: {
    alignItems: "center",
    width: "100%",
  },
  btnText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  platformText: {
    fontWeight: "600",
  },
});
