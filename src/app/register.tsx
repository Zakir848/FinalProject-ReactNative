import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import useUsers from "@/context/UsersProvider";
import { useTranslation } from "react-i18next";
import { client } from "@/api/authContext";

type Form = {
  id: string;
  fullname: string;
  email: string;
  password: string;
  imageUrl: string;
  repeatPassword: string;
};

type Error = {
  errorFullname: string;
  errorEmail: string;
  errorRepeatPassword: string;
  errorPassword: string;
  anyError: string;
};

export default function register() {
  const { handleRegister } = useUsers();
  const { t } = useTranslation();
  const [passOpen, setPassOpen] = useState<boolean>(false);
  const [repPassOpen, setRepPassOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<Error>({
    errorFullname: "",
    errorEmail: "",
    errorRepeatPassword: "",
    errorPassword: "",
    anyError: "",
  });
  const [form, setForm] = useState<Form>({
    id: "",
    fullname: "",
    email: "",
    password: "",
    repeatPassword: "",
    imageUrl: "",
  });

  const handleChangeText = (key: keyof Form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleError = (key: keyof Error, value: string) => {
    setErrors({
      errorEmail: "",
      errorFullname: "",
      errorPassword: "",
      errorRepeatPassword: "",
      anyError: "",
      [key]: value,
    });
  };

  const handleCheck = async () => {
    if (
      !form.fullname.trim() &&
      !form.email.trim() &&
      !form.password &&
      !form.repeatPassword
    ) {
      setErrors({
        errorEmail: " ",
        errorFullname: " ",
        errorPassword: " ",
        errorRepeatPassword: " ",
        anyError: t("validation.fillAll"),
      });
      return;
    }

    if (!form.fullname) {
      handleError("errorFullname", t("validation.enterFullname"));
      return;
    }

    if (!form.email) {
      handleError("errorEmail", t("validation.enterEmail"));
      return;
    }

    if (!form.email.includes("@")) {
      handleError("errorEmail", t("validation.emailAtSymbol"));
      return;
    }

    if (!form.password) {
      handleError("errorPassword", t("validation.enterPassword"));
      return;
    }

    if (form.password !== form.repeatPassword) {
      handleError("errorRepeatPassword", t("validation.passwordMismatch"));
      return;
    }
    const { data: users } = await client.get("/users");
    console.log(Array.isArray(users));

    const user = users.some(
      (user: { email: string }) =>
        user.email.trim().toLowerCase() === form.email.trim().toLowerCase(),
    );

    if (user) {
      handleError("anyError", t("validation.emailTaken"));
      return;
    }

    setErrors({
      errorEmail: "",
      errorFullname: "",
      errorPassword: "",
      errorRepeatPassword: "",
      anyError: "",
    });

    const { repeatPassword, ...data } = form;

    handleRegister(data);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("@/assets/images/Foodora.png")}
          style={styles.logo}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>{t("register.title")}</Text>
            <Text>{t("register.subtitle")}</Text>
          </View>

          <View
            style={[styles.input, !!errors.errorFullname && styles.inputError]}
          >
            <Ionicons name="person-outline" size={20} />
            <TextInput
              placeholder={t("form.fullname")}
              value={form.fullname}
              onChangeText={(value) => handleChangeText("fullname", value)}
              style={styles.textInput}
            />
          </View>
          {errors.errorFullname && (
            <Text
              style={[
                styles.error,
                errors.errorFullname === " " && styles.errorHidden,
              ]}
            >
              {errors.errorFullname}
            </Text>
          )}
          <View
            style={[styles.input, !!errors.errorEmail && styles.inputError]}
          >
            <Ionicons name="mail-outline" size={20} />
            <TextInput
              placeholder={t("form.email")}
              value={form.email}
              onChangeText={(value) => handleChangeText("email", value)}
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
              onChangeText={(value) => handleChangeText("password", value)}
              style={styles.textInput}
              secureTextEntry={passOpen ? false : true}
            />
            <Ionicons
              name={passOpen ? "eye-off" : "eye"}
              size={20}
              onPress={() => setPassOpen(!passOpen)}
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
          <View
            style={[
              styles.input,
              !!errors.errorRepeatPassword && styles.inputError,
            ]}
          >
            <MaterialIcons name="lock-outline" size={22} />
            <TextInput
              placeholder={t("form.repeatPassword")}
              value={form.repeatPassword}
              onChangeText={(value) =>
                handleChangeText("repeatPassword", value)
              }
              style={styles.textInput}
              secureTextEntry={repPassOpen ? false : true}
            />
            <Ionicons
              name={repPassOpen ? "eye-off" : "eye"}
              size={20}
              onPress={() => setRepPassOpen(!repPassOpen)}
              style={styles.eyeIcon}
            />
          </View>
          {(errors.anyError || errors.errorRepeatPassword) && (
            <Text style={styles.error}>
              {errors.anyError ? errors.anyError : errors.errorRepeatPassword}
            </Text>
          )}
          <View style={styles.bottomBox}>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btn} onPress={handleCheck}>
                <Text style={styles.btnText}>{t("register.submit")}</Text>
              </TouchableOpacity>
              <View style={styles.register}>
                <Text style={styles.haveAccountText}>
                  {t("register.haveAccount")}
                </Text>
                <TouchableOpacity onPress={() => router.replace("/login")}>
                  <Text style={styles.linkText}>{t("register.login")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  logo: {
    maxHeight: 200,
    width: "100%",
  },
  content: {
    paddingHorizontal: 20,
    flex: 1,
    alignItems: "center",
  },
  titleBox: {
    paddingVertical: 20,
    width: "100%",
  },
  title: {
    fontWeight: "900",
    fontSize: 30,
  },
  input: {
    backgroundColor: "#FFFFFF",
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
  inputError: {
    borderColor: "red",
  },
  textInput: {
    flex: 1,
  },
  eyeIcon: {
    padding: 5,
    backgroundColor: "#d3d3d369",
    borderRadius: 50,
  },
  error: {
    width: "100%",
    fontWeight: "600",
    color: "red",
  },
  errorHidden: {
    position: "absolute",
  },
  bottomBox: {
    position: "absolute",
    bottom: "10%",
    width: "100%",
    alignItems: "center",
  },
  actions: {
    alignItems: "center",
    width: "100%",
  },
  btn: {
    paddingVertical: 15,
    backgroundColor: "#E90064",
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EAE4E8",
  },
  btnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  register: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  haveAccountText: {
    fontWeight: "500",
  },
  linkText: {
    color: "#E90064",
    fontWeight: "600",
  },
});
