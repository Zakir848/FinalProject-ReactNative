import StatusBadge from "@/components/orders/statusBadge";
import { Colors } from "@/constants/theme";
import useFood from "@/context/FoodsProvider";
import { Order } from "@/models/orders.models";
import { formatDate, STATUS_CONFIG } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

function OrderCard({ order }: { order: Order }) {
  const { t } = useTranslation();
  const accent = (STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending).color;
  const items = order.orderItem ?? [];
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() =>
        router.push({
          pathname: "/orders/[id]",
          params: { id: order.id.toString() },
        })
      }
    >
      <View style={[styles.accentBar, { backgroundColor: accent }]} />

      <View style={styles.cardHeader}>
        <View style={styles.restaurantIcon}>
          <Ionicons name="restaurant" size={20} color={Colors.primary} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {order.restaurantName}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {t("orderHistory.orderNo", { id: order.id.toString().slice(-6) })}
          </Text>
        </View>
        <StatusBadge status={order.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.itemList}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.qtyBox}>
              <Text style={styles.qtyText}>{item.quantity}×</Text>
            </View>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.foodName ?? item.name}
            </Text>
            <Text style={styles.itemPrice}>
              $ {(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerMeta}>
          <View style={styles.metaRow}>
            <Ionicons
              name="calendar-outline"
              size={13}
              color={Colors.textSecondary}
            />
            <Text style={styles.meta}>{formatDate(order.deliveryTime)}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons
              name="bag-handle-outline"
              size={13}
              color={Colors.textSecondary}
            />
            <Text style={styles.meta}>
              {t("orderHistory.items", { count: itemCount })}
            </Text>
          </View>
        </View>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>{t("orderHistory.total")}</Text>
          <Text style={styles.totalValue}>
            $ {order.totalPrice.toFixed(2)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function OrderHistory() {
  const { orders } = useFood();
  const { t } = useTranslation();

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.list,
        orders.length === 0 && styles.listEmpty,
      ]}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => <OrderCard order={item} />}
      ListEmptyComponent={
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="receipt-outline" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>{t("orderHistory.emptyTitle")}</Text>
          <Text style={styles.emptyMessage}>
            {t("orderHistory.emptyMessage")}
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 12,
    paddingHorizontal: 4,
    paddingBottom: (StatusBar.currentHeight ?? 0) + 24,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },
  separator: {
    height: 14,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    paddingLeft: 20,
    overflow: "hidden",
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  restaurantIcon: {
    width: 42,
    height: 42,
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
    fontSize: 16,
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
  itemList: {
    gap: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  qtyBox: {
    minWidth: 34,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  qtyText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderStyle: "dashed",
  },
  footerMeta: {
    gap: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  totalBox: {
    alignItems: "flex-end",
  },
  totalLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.primary,
  },
  empty: {
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.text,
  },
  emptyMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
