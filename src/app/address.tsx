import { client } from "@/api/authContext";
import Header from "@/components/header";
import { Colors } from "@/constants/theme";
import useUsers from "@/context/UsersProvider";
import { getCurrentAddress } from "@/models/user.models";
import { Address } from "@/types/types";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Button,
  Dialog,
  Divider,
  RadioButton,
  Text,
} from "react-native-paper";
import {
  Alert,
  FlatList,
  Linking,
  Pressable,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddAddress() {
  const { currentUser, address, setAddress } = useUsers();
  const { t } = useTranslation();
  const [select, setSelect] = useState<string>("");
  const [form, setForm] = useState({ title: "", street: "", details: "" });
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  const userAddress = address.filter((f) => f.userId === currentUser?.id);
  const inputs = [
    {
      placeholder: t("address.titlePlaceholder"),
      value: form.title,
      onChangeText: (value: string) =>
        setForm((prev) => ({
          ...prev,
          title: value,
        })),
    },
    {
      placeholder: t("address.detailsPlaceholder"),
      value: form.details,
      onChangeText: (value: string) =>
        setForm((prev) => ({
          ...prev,
          details: value,
        })),
    },
    {
      placeholder: t("address.streetPlaceholder"),
      value: form.street,
      onChangeText: (value: string) =>
        setForm((prev) => ({
          ...prev,
          street: value,
        })),
    },
  ];
  useEffect(() => {
    const loadSelectAddress = async () => {
      const loadAddress = await AsyncStorage.getItem("address");
      if (loadAddress) {
        setSelect(loadAddress);
      }
    };
    loadSelectAddress();
  }, []);

  const handleSelectAddress = async (id: string) => {
    await AsyncStorage.setItem("address", id);
    setSelect(id);
  };

  const clearForm = () => {
    setForm({
      title: "",
      street: "",
      details: "",
    });
  };

  const handleUseMyLocation = async () => {
    setLoading(true);
    try {
      const { latitude, longitude, street } = await getCurrentAddress();
      setCoords({ latitude, longitude });
      setForm((f) => ({
        ...f,
        street: f.street || street,
      }));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      if (msg === "PERMISSION_DENIED") {
        Alert.alert(
          t("address.permissionDeniedTitle"),
          t("address.permissionDeniedMessage"),
          [
            { text: t("common.cancel") },
            { text: t("common.allow"), onPress: () => Linking.openSettings() },
          ],
        );
      } else if (msg === "GPS_OFF") {
        Alert.alert(t("address.gpsOffTitle"), t("address.gpsOffMessage"));
      } else {
        Alert.alert(t("address.locationFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = (id: string) => {
    setSelectedAddressId(id);
    setIsOpenMenu(true);
  };
  const saveAddress = async () => {
    if (!currentUser?.id) return;
    if (!form.title.trim() || !form.street.trim() || !coords) {
      Alert.alert(t("address.requiredFields"));
      return;
    }

    const payload: Address = { userId: currentUser?.id, ...form, ...coords };
    await client.post("/addresses", payload);
    clearForm();
  };

  return (
    <View style={styles.container}>
      <Header title={t("screens.addresses")} />
      <FlatList
        data={userAddress}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
        renderItem={({ item }) => {
          const isSelect = select === item.id;
          return (
            <TouchableOpacity
              style={styles.addressItem}
              onLongPress={() => deleteAddress(String(item.id))}
            >
              <Ionicons
                name="location"
                color={isSelect ? "#E90064" : "gray"}
                size={25}
              />
              <View style={styles.addressInfo}>
                <Text>{item.title}</Text>
                <Text>{item.street}</Text>
              </View>
              <RadioButton
                value="first"
                status={isSelect ? "checked" : "unchecked"}
                onPress={() => handleSelectAddress(String(item.id))}
              />
            </TouchableOpacity>
          );
        }}
      />
      <Dialog visible={isOpenDialog} onDismiss={() => setIsOpenDialog(false)}>
        <Dialog.Title>Ünvan Əlavə et</Dialog.Title>
        <Dialog.Content>
          {inputs.map((item) => (
            <TextInput
              key={item.placeholder}
              placeholder={item.placeholder}
              value={item.value}
              onChangeText={(value) => item.onChangeText(value)}
              style={styles.textInput}
            />
          ))}
          <View style={{ width: "100%" }}>
            <TouchableOpacity
              onPress={handleUseMyLocation}
              style={styles.locationBtn}
              disabled={loading}
            >
              <Text
                style={{
                  color: Colors.background,
                  fontWeight: "600",
                  textAlign: "center",
                  paddingVertical: 5,
                }}
              >
                {t("address.useCurrentLocation")}
              </Text>
            </TouchableOpacity>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="text"
            onPress={() => (setIsOpenDialog(false), clearForm())}
          >
            Cancel
          </Button>
          <Button mode="text" onPress={saveAddress}>
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
      <View style={styles.form}>
        {loading && <ActivityIndicator />}

        <TouchableOpacity
          onPress={() => setIsOpenDialog(true)}
          style={styles.addBtn}
        >
          <Entypo name="plus" color={Colors.primary} size={20} />
          <Text style={styles.addBtnText}>{t("address.addAddress")}</Text>
        </TouchableOpacity>
      </View>
      <Dialog visible={isOpenMenu} onDismiss={() => setIsOpenMenu(false)}>
        <Dialog.Title>Warning</Dialog.Title>

        <Dialog.Content>
          <Text variant="titleMedium">Are you sure?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="text" onPress={() => setIsOpenMenu(false)}>
            No
          </Button>

          <Button
            mode="text"
            onPress={() => {
              const update = address.filter((f) => f.id !== selectedAddressId);
              setAddress(update);
              setIsOpenMenu(false);
            }}
          >
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 10,
    backgroundColor: Colors.background,
  },
  divider: {
    marginVertical: 10,
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addressInfo: {
    flex: 1,
    paddingHorizontal: 10,
  },
  form: {
    paddingBottom: StatusBar.currentHeight,
  },
  locationBtn: {
    borderRadius: 50,
    backgroundColor: Colors.primary,
    padding: 5,
    marginVertical: 10,
  },
  addBtn: {
    borderRadius: 50,
    borderColor: Colors.primary,
    borderWidth: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 5,
  },
  addBtnText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
});
