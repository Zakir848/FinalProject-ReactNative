import { client } from "@/api/authContext";
import {
    clearCartSQLite,
    decreaseQuantity,
    deleteFromCartByFoodId,
    getAllCarts,
    insertCart,
    updateQunatity,
} from "@/db/database";
import { Comment } from "@/models/comments.models";
import { Cart } from "@/models/foods.models";
import { Order, OrderItem } from "@/models/orders.models";
import { Restaurant } from "@/models/restaurants.models";
import axios from "axios";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

interface FoodContextInterface {
  restaurants: Restaurant[];
  orders: Order[];
  comments: Comment[];
  orderItem: OrderItem[];
  carts: Cart[];
  clearCart: (userId: string) => void;
  createOrder: (data: Order) => void;
  setOrderItem: (data: OrderItem[]) => void;
  addCart: (data: Cart) => void;
  removeCart: (id: string) => void;
  decreaseFood: (id: string) => void;
}

const FoodContext = createContext<FoodContextInterface | undefined>(undefined);

export function FoodsProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestourants] = useState<Restaurant[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItem, setOrderItem] = useState<OrderItem[]>([]);

  const [carts, setCart] = useState<Cart[]>([]);

  const [comments, setComments] = useState<Comment[]>([]);

  const loadData = async (field: string, setter: any) => {
    try {
      const response = await client.get(`${field}`);
      setter(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      await loadData("restaurants", setRestourants);
      await loadData("carts", setCart);
      await loadData("orders", setOrders);
      await loadData("comments", setComments);
      const get = await getAllCarts();
    })();
  }, []);

  const clearCart = async (userId: string): Promise<void> => {
    try {
      const userCarts: Cart[] = await client.get(`/carts?userId=${userId}`);

      if (userCarts.length <= 0) {
        return;
      }

      const deletePromise = userCarts.map((item) => {
        axios.delete(`/carts/${item.id}`);
      });

      await Promise.all(deletePromise);
      await clearCartSQLite();

      setCart([]);
    } catch (error) {
      console.log(error);
    }
  };

  const addCart = async (data: Cart) => {
    if (!data) {
      console.log("Cart Xeta");
      return;
    }

    const exists = carts.find(
      (c) => c.foodId === data.foodId && c.userId === data.userId,
    );
    console.log(Boolean(exists));

    if (exists) {
      const quantity = exists.quantity + 1;

      const { data: updated } = await client.patch(`carts/${exists.id}`, {
        quantity,
      });

      await updateQunatity(exists.userId, exists.foodId);

      setCart((prev) =>
        prev.map((item) => (item.id === updated.id ? updated.data : item)),
      );
      return;
    }
    console.log("buradayam");

    const { data: created } = await client.post("/carts", {
      ...data,
      quantity: 1,
    });
    console.log(created);
    const { id, ...local } = created;

    await insertCart(local);
    setCart((prev) => [...prev, local]);
  };

  const decreaseFood = async (id: string) => {
    if (!id) {
      console.log("Id not found");
      return;
    }
    const findCart = carts.find((f) => f.id === id);

    if (!findCart) {
      console.log("Cart not found");
      return;
    }

    if (findCart?.quantity == 1) {
      removeCart(findCart.id);
      deleteFromCartByFoodId(findCart?.foodId);
      return;
    }

    await client.patch(`/carts/${findCart.id}`, {
      quantity: findCart.quantity - 1,
    });

    await decreaseQuantity(findCart.foodId, findCart.quantity);

    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
      ),
    );
  };

  const removeCart = async (id: string) => {
    const exists = carts.some((s) => s.id === id);
    console.log(id);

    if (!exists) {
      console.log("Cart not found");
      return;
    }

    await client.delete(`carts/${id}`);

    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const createOrder = async (data: Order) => {};

  const addOrderItem = async (data: OrderItem) => {
    if (!data) {
      console.log("addOrder xeta");
    }

    setOrderItem((prev) => {
      const exists = prev.some((item) => item.foodId == data.id);
      if (exists) {
        prev.map((item) =>
          item.foodId == data.foodId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prev, { ...data, quantity: 1 }];
    });
  };

  return (
    <FoodContext.Provider
      value={{
        restaurants,
        orderItem,
        orders,
        comments,
        carts,
        clearCart,
        createOrder,
        setOrderItem,
        addCart,
        removeCart,
        decreaseFood,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
}

export default function useFood() {
  const context = useContext(FoodContext);

  if (!context) throw new Error("Providerin daxilinde yazin");

  return context;
}
