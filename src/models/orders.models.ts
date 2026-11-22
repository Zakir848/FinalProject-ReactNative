import { OrderStatus } from "@/types/types";

export interface Order {
  id: string;
  userEmail: string;
  restaurantName: string;
  totalPrice: number;
  status: OrderStatus;
  deliveryTime: string;
  orderItem: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  restaurantId: string;
  foodId: string;
  foodName: string;
  name: string;
  quantity: number;
  price: number;
}
