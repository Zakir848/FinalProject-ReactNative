export type OrderStatus = "pending" | "accept" | "delivered" | "cancel";

export type Address = {
  id?: string;
  userId: string;
  title: string;
  street: string;
  details?: string;
  latitude: number;
  longitude: number;
};
