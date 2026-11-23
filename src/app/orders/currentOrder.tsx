import { client } from "@/api/authContext";
import Header from "@/components/header";
import { Colors } from "@/constants/theme";
import useFood, { createAt } from "@/context/FoodsProvider";
import useUsers from "@/context/UsersProvider";
import { Cart } from "@/models/foods.models";
import { Order } from "@/models/orders.models";
import { Address } from "@/types/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { ComponentProps, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type OptionRowProps = {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  loading?: boolean;
  onPress?: () => void;
};

function OptionRow({ icon, label, loading, onPress }: OptionRowProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={loading}
    >
      <Ionicons name={icon} size={22} color={Colors.primary} />
      {loading ? (
        <ActivityIndicator style={styles.cardText} color={Colors.primary} />
      ) : (
        <Text style={styles.cardText} numberOfLines={1}>
          {label}
        </Text>
      )}
      <Feather name="chevron-right" size={20} color={Colors.primary} />
    </TouchableOpacity>
  );
}

export default function CurrentOrder() {
  const { t } = useTranslation();
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();
  const { address, currentUser } = useUsers();
  const { carts, createOrder, restaurants, clearRestaurantCart } = useFood();
  const [loading, setLoading] = useState(true);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [note, setNote] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paidAmount, setPaidAmount] = useState("0.00");

  const handleConfirm = async (items: Cart[]) => {
    if (!currentUser || items.length === 0) return;
    const restaurant = restaurants.find((r) => r.id === items[0].restaurantId);
    const orderId = Date.now().toString();


    const orderItem: Order["orderItem"] = items.map((c) => ({
      id: c.id,
      orderId,
      restaurantId: c.restaurantId,
      foodId: c.foodId,
      foodName: c.name,
      name: c.name,
      quantity: c.quantity,
      price: c.price,
    }));

    const newOrder: Order = {
      id: orderId,
      userEmail: currentUser.email.trim().toLowerCase(),
      restaurantName: restaurant?.name ?? "",
      totalPrice: Number(
        items.reduce((sum, c) => sum + c.price * c.quantity, 0).toFixed(2),
      ),
      status: "pending",
      deliveryTime: createAt,
      orderItem,
    };
    await createOrder(newOrder);
    setPaidAmount(newOrder.totalPrice.toFixed(2));
    setPaymentSuccess(true);

    // Sifariş olunan restoranın məhsulları səbətdən çıxarılır, digərləri qalır
    await clearRestaurantCart(currentUser.id, items[0].restaurantId);
  };

  const handleCloseSuccess = () => {
    setPaymentSuccess(false);
    router.back();
  };

  // Yalnız səbətdə seçilmiş restoranın məhsulları sifariş olunur
  const userCart = carts.filter(
    (f) => f.userId == currentUser?.id && f.restaurantId == restaurantId,
  );
  const totalPrice = userCart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      (async () => {
        const id = await AsyncStorage.getItem("address");
        if (!active) return;
        setCurrentAddress(address.find((a) => a.id === id) ?? null);
        setLoading(false);
      })();

      return () => {
        active = false;
      };
    }, [address]),
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header title={t("order.title")} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.label}>{t("order.deliveryAddress")}</Text>
          <OptionRow
            icon="location-outline"
            label={currentAddress?.street ?? t("order.noAddress")}
            loading={loading}
            onPress={() => router.push("/address")}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t("order.deliveryTime")}</Text>
          <OptionRow icon="timer-outline" label={t("order.deliveryNow")} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t("order.paymentMethod")}</Text>
          <OptionRow
            icon="card-outline"
            label={t("order.payByCard")}
            onPress={() => router.push("/payments")}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t("order.note")}</Text>
          <TextInput
            style={styles.noteInput}
            placeholder={t("order.notePlaceholder")}
            placeholderTextColor={Colors.textDisabled}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t("order.total")}</Text>
          <Text style={styles.totalPrice}>{totalPrice} ₼</Text>
        </View>

        <TouchableOpacity
          style={styles.confirmButton}
          activeOpacity={0.8}
          onPress={() => handleConfirm(userCart)}
        >
          <Text style={styles.confirmText}>{t("order.confirm")}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={paymentSuccess}
        transparent
        animationType="fade"
        onRequestClose={handleCloseSuccess}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={44} color={Colors.white} />
            </View>
            <Text style={styles.modalTitle}>{t("order.successTitle")}</Text>
            <Text style={styles.modalMessage}>{t("order.successMessage")}</Text>
            <View style={styles.modalAmountRow}>
              <Text style={styles.modalAmountLabel}>{t("order.paid")}</Text>
              <Text style={styles.modalAmount}>{paidAmount} ₼</Text>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              activeOpacity={0.8}
              onPress={handleCloseSuccess}
            >
              <Text style={styles.confirmText}>{t("order.ok")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexDirection: "column",
    gap: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  section: {
    flexDirection: "column",
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.06)",
  },
  cardText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  noteInput: {
    minHeight: 90,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    fontSize: 14,
    color: Colors.text,
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.06)",
  },
  footer: {
    width: "100%",
    flexDirection: "column",
    gap: 24,
    paddingTop: 16,
    paddingBottom: StatusBar.currentHeight,
    backgroundColor: Colors.background,
    marginBottom: 10,
    borderTopWidth: 1,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
  },
  confirmButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    boxShadow: "0px 6px 14px rgba(233, 0, 100, 0.3)",
  },
  modalOverlay: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  modalCard: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    gap: 14,
    padding: 24,
    borderRadius: 20,
    backgroundColor: Colors.background,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.success,
    boxShadow: "0px 6px 14px rgba(34, 197, 94, 0.35)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  modalAmountRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  modalAmountLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  modalAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
  },
  modalButton: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  confirmText: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.white,
  },
});
