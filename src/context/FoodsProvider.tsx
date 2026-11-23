import { client } from "@/api/authContext";
import {
  clearCartSQLite,
  decreaseQuantity,
  deleteFromCartByFoodId,
  insertCart,
  updateQunatity,
} from "@/db/database";
import { Comment } from "@/models/comments.models";
import { Cart } from "@/models/foods.models";
import { Order, OrderItem } from "@/models/orders.models";
import { Restaurant } from "@/models/restaurants.models";
import { pad } from "@/utils/format";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import useUsers from "./UsersProvider";

interface FoodContextInterface {
  restaurants: Restaurant[];
  orders: Order[];
  comments: Comment[];
  orderItem: OrderItem[];
  carts: Cart[];
  clearCart: (userId: string) => void;
  clearRestaurantCart: (userId: string, restaurantId: string) => void;
  createOrder: (data: Order) => void;
  setOrderItem: (data: OrderItem[]) => void;
  addCart: (data: Cart) => void;
  removeCart: (id: string) => void;
  decreaseFood: (id: string) => void;
}

const FoodContext = createContext<FoodContextInterface | undefined>(undefined);
const date = new Date();
export const createAt = `
${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}
`;

export function FoodsProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUsers();
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
      await loadData("/restaurants", setRestourants);
      await loadData("/carts", setCart);
      await loadData("/comments", setComments);
    })();
  }, []);

  const userEmail = currentUser?.email?.trim().toLowerCase();

  useEffect(() => {
    if (!userEmail) {
      setOrders([]);
      return;
    }

    client
      .get<Order[]>("/orders", { params: { userEmail } })
      .then(({ data }) =>
        setOrders(
          data.filter((o) => o.userEmail?.trim().toLowerCase() === userEmail),
        ),
      )
      .catch((error) => console.log(error));
  }, [userEmail]);

  const clearCart = async (userId: string): Promise<void> => {
    try {
      const { data: userCarts } = await client.get<Cart[]>(
        `/carts?userId=${userId}`,
      );

      await Promise.all(
        userCarts.map((item) => client.delete(`/carts/${item.id}`)),
      );
      await clearCartSQLite();

      setCart((prev) => prev.filter((item) => item.userId !== userId));
    } catch (error) {
      console.log(error);
    }
  };

  const createCartItem = async (data: Cart) => {
    const { data: created } = await client.post("/carts", {
      ...data,
      quantity: 1,
    });
    const { id, ...local } = created;

    await insertCart(local);
    setCart((prev) => [...prev, created]);
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
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
      return;
    }
    await createCartItem(data);
  };

  const clearRestaurantCart = async (userId: string, restaurantId: string) => {
    const items = carts.filter(
      (c) => c.userId === userId && c.restaurantId === restaurantId,
    );

    try {
      await Promise.all(
        items.map((item) => client.delete(`/carts/${item.id}`)),
      );
      await Promise.all(
        items.map((item) => deleteFromCartByFoodId(item.foodId)),
      );
    } catch (error) {
      console.log(error);
    }

    setCart((prev) =>
      prev.filter(
        (c) => !(c.userId === userId && c.restaurantId === restaurantId),
      ),
    );
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

  const createOrder = async (data: Order) => {
    if (!data) {
      return;
    }

    const order: Order = {
      ...data,
      userEmail: data.userEmail.trim().toLowerCase(),
      deliveryTime: String(createAt),
      status: "pending",
    };

    await client.post("/orders", order);

    setOrders((prev) => [...prev, order]);
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
        clearRestaurantCart,
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
