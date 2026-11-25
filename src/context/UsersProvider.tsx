import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";

import { client } from "@/api/authContext";
import { getToken, removeToken, saveToken } from "@/api/authStorage";
import { generateToken } from "@/api/token";
import { Address, ProfileUpdate, Session } from "@/types/types";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

type User = {
  id: string;
  fullname: string;
  email: string;
  password: string;
  imageUrl: string;
};

export interface Login {
  email: string;
  password: string;
}

interface UsersContextInterface {
  currentUser: User;
  handleLogin: (data: Login) => void;
  handleLogout: () => void;
  isLoading: boolean;
  handleRegister: (data: User) => void;
  updateProfile: (data: ProfileUpdate) => Promise<boolean>;
  address: Address[];
  setAddress: (address: Address[]) => void;
}

const UsersContext = createContext<UsersContextInterface | undefined>(
  undefined,
);

export function UsersProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [address, setAddress] = useState<Address[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();

        if (!token) {
          router.replace("/login");
          return;
        }

        const parsedToken: Session = JSON.parse(token);

        if (parsedToken.expiresAt <= Date.now()) {
          await removeToken();
          return;
        }
        const { data: response } = await client.get(
          `/users/${parsedToken.userId}`,
        );

        const { password, ...safeUser } = response;
        setCurrentUser(safeUser);

        const { data: getAddresses } = await client.get(`/addresses`, {
          params: { userId: response.id },
        });

        setAddress(getAddresses);

        router.replace("/(tabs)/home");
      } catch (error) {
        console.log("loading error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const handleLogin = async (data: Login) => {
    try {
      const response = await client.get("/users", {
        params: {
          email: data.email.trim().toLowerCase(),
          password: data.password,
        },
      });

      if (response.data.length === 0) {
        Alert.alert(t("common.error"), t("validation.invalidCredentials"));
        return;
      }

      const { password, ...safeUser } = response.data[0];
      await saveToken(generateToken(safeUser.id));
      setCurrentUser(safeUser);
      console.log("Hare");

      router.replace("/(tabs)/home");
    } catch (error) {
      console.log("login error:", error);
      Alert.alert(t("common.error"), t("errors.serverUnreachable"));
    }
  };

  const handleRegister = async (data: User) => {
    try {
      if (!data) {
        Alert.alert(t("common.error"), t("errors.generic"));
        return;
      }

      const response = await client.post("/users", {
        ...data,
        email: data.email.trim().toLowerCase(),
      });

      if (!response) {
        throw new Error("Response da error var");
      }

      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const updateProfile = async (data: ProfileUpdate) => {
    if (!currentUser) return false;

    try {
      const email = data.email.trim().toLowerCase();

      // E-poçt başqa istifadəçiyə məxsusdursa dəyişməyə icazə verilmir
      if (email !== currentUser.email?.trim().toLowerCase()) {
        const { data: users } = await client.get("/users", {
          params: { email },
        });
        if (users.some((u: User) => u.id !== currentUser.id)) {
          Alert.alert(t("common.error"), t("validation.emailTaken"));
          return false;
        }
      }

      const { data: updated } = await client.patch(`/users/${currentUser.id}`, {
        fullname: data.fullname.trim(),
        email,
        imageUrl: data.imageUrl,
      });

      const { password, ...safeUser } = updated;
      setCurrentUser(safeUser);
      return true;
    } catch (error) {
      console.log("update profile error:", error);
      Alert.alert(t("common.error"), t("errors.serverUnreachable"));
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await removeToken();
      setCurrentUser(null);
      router.replace("/login");
    } catch (error) {
      console.error("Chixish Xetasi:", error);
    }
  };

  return (
    <UsersContext.Provider
      value={{
        currentUser,
        isLoading,
        address,
        setAddress,
        handleLogin,
        handleLogout,
        handleRegister,
        updateProfile,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export default function useUsers() {
  const context = useContext(UsersContext);

  if (!context) throw new Error("Providerin daxilinde yazin");

  return context;
}
