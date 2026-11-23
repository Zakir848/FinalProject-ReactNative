import { Colors } from "@/constants/theme";
import useUsers from "@/context/UsersProvider";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

export default function profile() {
  const { handleLogout, currentUser } = useUsers();
  const { t } = useTranslation();

  const Bars = [
    {
      icon: <Ionicons name="person-outline" size={30} />,
      handle: handleLogout,
      key: "personalInfo",
      title: t("profile.personalInfo"),
    },
    {
      icon: <Ionicons name="location-outline" size={30} />,
      handle: () => router.push("/address"),
      key: "addresses",
      title: t("profile.addresses"),
    },
    {
      icon: <Ionicons name="card-outline" size={30} />,
      handle: () => router.push("/payments"),
      key: "paymentMethods",
      title: t("profile.paymentMethods"),
    },
    {
      icon: <Ionicons name="receipt-outline" size={30} />,
      handle: () => router.push("/(tabs)/orders"),
      key: "orderHistory",
      title: t("profile.orderHistory"),
    },
    {
      icon: <Ionicons name="heart-outline" size={30} />,
      handle: () => router.push("/(tabs)/favorite"),
      key: "favorites",
      title: t("profile.favorites"),
    },
    {
      icon: <Ionicons name="settings-outline" size={30} />,
      handle: handleLogout,
      key: "settings",
      title: t("profile.settings"),
    },
    {
      icon: (
        <Ionicons name="log-out-outline" size={30} color={Colors.primary} />
      ),
      handle: handleLogout,
      key: "logout",
      title: t("profile.logout"),
    },
  ];
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.editButton}
        hitSlop={10}
        onPress={() => router.push("/editProfile")}
      >
        <Ionicons name="pencil" size={20} color={Colors.background} />
      </TouchableOpacity>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          {currentUser?.imageUrl ? (
            <Image
              source={{ uri: currentUser?.imageUrl ?? undefined }}
              style={styles.avatarImage}
            />
          ) : (
            <Ionicons name="person" color={Colors.background} size={30} />
          )}
        </View>
        <Text style={styles.fullname}>{currentUser?.fullname}</Text>
        <Text style={styles.email}>{currentUser?.email}</Text>
      </View>
      <View style={styles.menu}>
        <FlatList
          data={Bars}
          keyExtractor={(item) => item.key}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => item?.handle()}
            >
              {item.icon}
              <View style={styles.menuItemContent}>
                <Text
                  style={[
                    styles.menuItemTitle,
                    item.key === "logout" && styles.logoutTitle,
                  ]}
                >
                  {item.title}
                </Text>
                {item.key !== "logout" && (
                  <FontAwesome5 name="chevron-right" size={20} />
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: Colors.primaryDark,
  },
  editButton: {
    position: "absolute",
    top: (StatusBar.currentHeight ?? 0) + 12,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.background,
  },
  avatarImage: {
    width: "98%",
    height: "98%",
    borderRadius: 50,
  },
  fullname: {
    color: Colors.background,
    fontWeight: "600",
    fontSize: 25,
  },
  email: {
    color: Colors.background,
  },
  menu: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  menuItemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 20,
  },
  menuItemTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: Colors.text,
  },
  logoutTitle: {
    color: Colors.primary,
  },
});
