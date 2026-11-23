import Header from "@/components/header";
import { Colors } from "@/constants/theme";
import useUsers from "@/context/UsersProvider";
import { ProfileErrors, ProfileFieldProps } from "@/types/types";
import {
  EMAIL_REGEX,
  FULLNAME_REGEX,
  IMAGE_EXT_REGEX,
  IMAGE_MIME_REGEX,
  MAX_IMAGE_SIZE,
} from "@/utils/validation";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function Field({
  icon,
  label,
  value,
  error,
  placeholder,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  onChangeText,
}: ProfileFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error && styles.inputRowError]}>
        <Ionicons
          name={icon}
          size={20}
          color={error ? Colors.error : Colors.textSecondary}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textDisabled}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

export default function EditProfile() {
  const { t } = useTranslation();
  const { currentUser, updateProfile } = useUsers();

  const [fullname, setFullname] = useState(currentUser?.fullname ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [imageUrl, setImageUrl] = useState(currentUser?.imageUrl ?? "");
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t("common.error"), t("editProfile.permissionDenied"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    const validType = asset.mimeType
      ? IMAGE_MIME_REGEX.test(asset.mimeType)
      : IMAGE_EXT_REGEX.test(asset.fileName ?? asset.uri);

    if (!validType) {
      setErrors((prev) => ({ ...prev, image: t("validation.imageInvalid") }));
      return;
    }
    if (asset.fileSize && asset.fileSize > MAX_IMAGE_SIZE) {
      setErrors((prev) => ({ ...prev, image: t("validation.imageTooLarge") }));
      return;
    }

    setErrors((prev) => ({ ...prev, image: undefined }));
    setImageUrl(asset.uri);
  };

  const validate = (): boolean => {
    const next: ProfileErrors = {};
    const name = fullname.trim();
    const mail = email.trim();

    if (!name) next.fullname = t("validation.enterFullname");
    else if (!FULLNAME_REGEX.test(name))
      next.fullname = t("validation.fullnameInvalid");

    if (!mail) next.email = t("validation.enterEmail");
    else if (!EMAIL_REGEX.test(mail)) next.email = t("validation.emailInvalid");

    setErrors(next);
    return !next.fullname && !next.email && !next.image;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    const ok = await updateProfile({ fullname, email, imageUrl });
    setSaving(false);

    if (ok) {
      Alert.alert(t("editProfile.savedTitle"), t("editProfile.savedMessage"), [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header title={t("editProfile.title")} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <Pressable onPress={pickImage} style={styles.avatarWrapper}>
            <View
              style={[styles.avatar, errors.image && styles.avatarError]}
            >
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={48} color={Colors.textDisabled} />
              )}
            </View>
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color={Colors.white} />
            </View>
          </Pressable>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.changePhoto}>
              {t("editProfile.changePhoto")}
            </Text>
          </TouchableOpacity>
          {errors.image && (
            <Text style={styles.errorText}>{errors.image}</Text>
          )}
        </View>

        <Field
          icon="person-outline"
          label={t("editProfile.fullname")}
          value={fullname}
          error={errors.fullname}
          onChangeText={(v) => {
            setFullname(v);
            if (errors.fullname) setErrors((p) => ({ ...p, fullname: undefined }));
          }}
          placeholder={t("editProfile.fullnamePlaceholder")}
          autoCapitalize="words"
        />

        <Field
          icon="mail-outline"
          label={t("editProfile.email")}
          value={email}
          error={errors.email}
          onChangeText={(v) => {
            setEmail(v);
            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
          }}
          placeholder="ad@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.saveText}>{t("editProfile.save")}</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  content: {
    gap: 18,
    paddingTop: 12,
    paddingBottom: 24,
  },
  avatarSection: {
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: Colors.primaryLight,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarError: {
    borderColor: Colors.error,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  cameraBadge: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  changePhoto: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  inputRowError: {
    borderColor: Colors.error,
    backgroundColor: `${Colors.error}0D`,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 12,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
  },
  footer: {
    paddingTop: 12,
    paddingBottom: (StatusBar.currentHeight ?? 0) + 10,
  },
  saveButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveText: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.white,
  },
});
