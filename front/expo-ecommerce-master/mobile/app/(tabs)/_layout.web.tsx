import WebTopNav from "@/components/WebTopNav";
import { useSession } from "@/lib/session";
import useCart from "@/hooks/useCart";
import { Tabs } from "expo-router";
import { View } from "react-native";

/** تخطيط الويب: شريط علوي + محتوى بعرض محدود — بدون شريط تبويب سفلي مثل التطبيق */
const WebTabsLayout = () => {
  const { isLoaded } = useSession();
  const { cartItemCount } = useCart();

  if (!isLoaded) return null;

  return (
    <View className="flex-1 bg-background">
      <WebTopNav />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      >
        <Tabs.Screen name="index" options={{ title: "الرئيسية" }} />
        <Tabs.Screen
          name="cart"
          options={{
            title: "السلة",
            tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          }}
        />
        <Tabs.Screen name="profile" options={{ title: "حسابي" }} />
      </Tabs>
    </View>
  );
};

export default WebTabsLayout;
