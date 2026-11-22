import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { client } from "@/api/authContext";
import { getToken, removeToken, saveToken } from "@/api/authStorage";
import { generateToken } from "@/api/token";
import { router } from "expo-router";
import { Alert } from "react-native";
import { Address } from "@/types/types";
import { useTranslation } from "react-i18next";

type Session = {
  userId: string;
  createAt: string;
  expiresAt: string;
};

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

        if (new Date(parsedToken.expiresAt).getTime() <= Date.now()) {
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
        params: { email: data.email.trim(), password: data.password },
      });

      if (response.data.length === 0) {
        Alert.alert(t("common.error"), t("validation.invalidCredentials"));
        return;
      }

      const { password, ...safeUser } = response.data[0];
      await saveToken(generateToken(safeUser.id));
      setCurrentUser(safeUser);
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

      const response = await client.post("/users", data);

      if (!response) {
        throw new Error("Response da error var");
      }

      router.replace("/login");
    } catch (error) {
      console.log(error);
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
