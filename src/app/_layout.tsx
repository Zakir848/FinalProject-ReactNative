import { FavoritesProvider } from "@/context/FavoritesProvider";
import { FoodsProvider } from "@/context/FoodsProvider";
import { UsersProvider } from "@/context/UsersProvider";
import "@/i18n";
import { Stack } from "expo-router";

export default function _layout() {
  return (
    <UsersProvider>
      <FoodsProvider>
        <FavoritesProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            statusBarStyle: "dark",
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen
            name="restaurants/[id]"
            options={{ statusBarStyle: "light" }}
          />
          <Stack.Screen name="address" />
          <Stack.Screen name="editProfile" />
          <Stack.Screen name="payments" />
          <Stack.Screen name="orders/currentOrder" />
          <Stack.Screen name="orders/orderHistory" />
          <Stack.Screen name="orders/[id]" />
        </Stack>
        </FavoritesProvider>
      </FoodsProvider>
    </UsersProvider>
  );
}
