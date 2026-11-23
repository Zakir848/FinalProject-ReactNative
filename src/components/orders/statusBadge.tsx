import { Colors } from "@/constants/theme";
import { OrderStatus } from "@/types/types";
import { STATUS_CONFIG } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useTranslation();
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${config.color}1F`,
          borderColor: `${config.color}66`,
        },
      ]}
    >
      <Ionicons name={config.icon} size={14} color={config.color} />
      <Text style={styles.badgeText}>
        {t(`orderHistory.status.${status}`, { defaultValue: status })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text,
  },
});
