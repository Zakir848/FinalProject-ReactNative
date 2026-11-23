import { Colors } from "@/constants/theme";
import { OrderStatus } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";

type IoniconName = keyof typeof Ionicons.glyphMap;

export const STATUS_CONFIG: Record<
  OrderStatus,
  { color: string; icon: IoniconName }
> = {
  pending: { color: "#87CEEB", icon: "time-outline" },
  delivering: { color: Colors.secondary, icon: "bicycle-outline" },
  delivered: { color: Colors.success, icon: "checkmark-circle-outline" },
  cancel: { color: Colors.error, icon: "close-circle-outline" },
};

export const pad = (n: number | string) => n.toString().padStart(2, "0");

const DMY_REGEX = /^(\d{1,2})-(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{1,2})/;

export const formatDate = (value: string) => {
  const text = value?.trim() ?? "";

  const match = text.match(DMY_REGEX);
  if (match) {
    const [, d, m, y, h, min] = match;
    return `${pad(d)}.${pad(m)}.${y} · ${pad(h)}:${pad(min)}`;
  }

  const date = /^\d+$/.test(text) ? new Date(Number(text)) : new Date(text);
  if (isNaN(date.getTime())) return text;
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} · ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
