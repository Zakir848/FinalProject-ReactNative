import useFood from "@/context/FoodsProvider";
import useUsers from "@/context/UsersProvider";
import { useMemo } from "react";

export const useUserCart = () => {
  const { carts } = useFood();
  const { currentUser } = useUsers();

  return useMemo(() => {
    if (!currentUser) return { items: [], count: 0 };
    const items = carts.filter((i) => i.userId === currentUser.id);
    
    return { items, count: items.length };
  }, [carts, currentUser?.id]);
};
