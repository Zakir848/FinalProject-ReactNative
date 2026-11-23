import Header from "@/components/header";
import StatusBadge from "@/components/orders/statusBadge";
import { Colors } from "@/constants/theme";
import useFood from "@/context/FoodsProvider";
import { OrderStatus } from "@/types/types";
import { formatDate, STATUS_CONFIG } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

const STEPS: OrderStatus[] = ["pending", "delivering", "delivered"];

function StatusTimeline({ status }: { status: OrderStatus }) {
  const { t } = useTranslation();

  if (status === "cancel") {
    return (
      <View style={styles.cancelBanner}>
        <Ionicons name="close-circle" size={22} color={Colors.error} />
        <Text style={styles.cancelText}>{t("orderDetail.cancelled")}</Text>
      </View>
    );
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <View style={styles.timeline}>
      {STEPS.map((step, index) => {
        const done = index <= currentIndex;
        const config = STATUS_CONFIG[step];
        const color = done ? config.color : Colors.border;

        return (
          <View key={step} style={styles.step}>
            <View style={styles.stepTrack}>
              <View
                style={[
                  styles.stepLine,
                  index === 0 && styles.hidden,
                  { backgroundColor: done ? color : Colors.border },
                ]}
              />
              <View
                style={[
                  styles.stepIcon,
                  { backgroundColor: done ? color : Colors.surface, borderColor: color },
                ]}
              >
                <Ionicons
                  name={config.icon}
                  size={18}
                  color={done ? Colors.white : Colors.textDisabled}
                />
              </View>
              <View
                style={[
                  styles.stepLine,
                  index === STEPS.length - 1 && styles.hidden,
                  {
                    backgroundColor:
                      index < currentIndex
                        ? STATUS_CONFIG[STEPS[index + 1]].color
                        : Colors.border,
                  },
                ]}
              />
            </View>
            <Text
              style={[styles.stepLabel, done && styles.stepLabelDone]}
              numberOfLines={1}
            >
              {t(`orderHistory.status.${step}`)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useFood();
  const { t } = useTranslation();

  const order = orders.find((o) => o.id.toString() === id);

  if (!order) {
    return (
      <View style={styles.container}>
        <Header title={t("orderDetail.title")} />
        <View style={styles.notFound}>
          <Ionicons name="receipt-outline" size={48} color={Colors.textDisabled} />
          <Text style={styles.notFoundText}>{t("orderDetail.notFound")}</Text>
        </View>
      </View>
    );
  }

  const items = order.orderItem ?? [];

  return (
    <View style={styles.container}>
      <Header title={t("orderDetail.title")} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Restoran və status */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.restaurantIcon}>
              <Ionicons name="restaurant" size={22} color={Colors.primary} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.restaurantName} numberOfLines={1}>
                {order.restaurantName}
              </Text>
              <Text style={styles.meta}>
                {t("orderHistory.orderNo", {
                  id: order.id.toString().slice(-6),
                })}
              </Text>
            </View>
            <StatusBadge status={order.status} />
          </View>

          <View style={styles.divider} />

          <StatusTimeline status={order.status} />
        </View>

        {/* Məhsullar */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t("orderDetail.items")}</Text>
          {items.map((item, index) => (
            <View
              key={item.id}
              style={[styles.itemRow, index > 0 && styles.itemBorder]}
            >
              <View style={styles.qtyBox}>
                <Text style={styles.qtyText}>{item.quantity}×</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.foodName ?? item.name}
                </Text>
                <Text style={styles.meta}>$ {item.price.toFixed(2)}</Text>
              </View>
              <Text style={styles.itemTotal}>
                $ {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Xülasə */}
        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelRow}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={Colors.textSecondary}
              />
              <Text style={styles.summaryLabel}>{t("orderDetail.date")}</Text>
            </View>
            <Text style={styles.summaryValue}>
              {formatDate(order.deliveryTime.trim())}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>{t("orderDetail.total")}</Text>
            <Text style={styles.totalValue}>
              $ {order.totalPrice.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
  },
  content: {
    gap: 14,
    paddingTop: 8,
    paddingBottom: (StatusBar.currentHeight ?? 0) + 24,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  restaurantIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  restaurantName: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.text,
  },
  meta: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 14,
  },
  timeline: {
    flexDirection: "row",
  },
  step: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  stepTrack: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  stepLine: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  hidden: {
    opacity: 0,
  },
  stepIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: {
    fontSize: 12,
    color: Colors.textDisabled,
    fontWeight: "600",
  },
  stepLabelDone: {
    color: Colors.text,
  },
  cancelBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: `${Colors.error}14`,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.error,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  itemBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  qtyBox: {
    minWidth: 36,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
  },
  qtyText: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.primary,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});
