import useUsers from "@/context/UsersProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface FavoritesContextInterface {
  favoriteIds: string[];
  isFavorite: (restaurantId: string) => boolean;
  toggleFavorite: (restaurantId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextInterface | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUsers();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Hər istifadəçinin sevimliləri ayrıca saxlanılır
  const storageKey = `favorites_${currentUser?.id ?? "guest"}`;

  useEffect(() => {
    AsyncStorage.getItem(storageKey)
      .then((value) => setFavoriteIds(value ? JSON.parse(value) : []))
      .catch(() => setFavoriteIds([]));
  }, [storageKey]);

  const isFavorite = (restaurantId: string) =>
    favoriteIds.includes(restaurantId);

  const toggleFavorite = (restaurantId: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId];
      AsyncStorage.setItem(storageKey, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export default function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("FavoritesProvider daxilində istifadə edin");
  return context;
}
