import { palette } from "@/theme/palette";
import { useTabBarMetrics } from "@/lib/tab-bar";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/lib/session";
import useCart from "@/hooks/useCart";
import { Platform } from "react-native";

const TabsLayout = () => {
  const { isLoaded } = useSession();
  const { height, bottomInset } = useTabBarMetrics();
  const { cartItemCount } = useCart();

  if (!isLoaded) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.slate,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopWidth: 1,
          borderTopColor: palette.line,
          height,
          paddingTop: 8,
          paddingBottom: bottomInset,
          paddingHorizontal: 4,
          elevation: 8,
          shadowColor: palette.ink,
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarItemStyle: {
          paddingVertical: 2,
          minHeight: 48,
        },
        tabBarIconStyle: {
          marginBottom: Platform.OS === "android" ? 0 : 2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          lineHeight: 14,
          fontWeight: "600",
          fontFamily: "Cairo",
          marginTop: 2,
          includeFontPadding: false,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "السلة",
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: palette.primary,
            color: palette.onPrimary,
            fontSize: 10,
            minWidth: 18,
            height: 18,
            lineHeight: 18,
          },
          tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "حسابي",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
