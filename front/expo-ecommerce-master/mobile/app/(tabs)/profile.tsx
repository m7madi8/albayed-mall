import { palette } from "@/theme/palette";
import { useTabBarMetrics } from "@/lib/tab-bar";
import BrandMark from "@/components/BrandMark";
import SafeScreen from "@/components/SafeScreen";
import { clerkPublishableKey, useSession } from "@/lib/session";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const MENU_ITEMS = [
  { id: 1, icon: "list-outline" as const, title: "الطلبات" },
  { id: 2, icon: "location-outline" as const, title: "العناوين" },
  { id: 3, icon: "heart-outline" as const, title: "المفضلة" },
  { id: 4, icon: "shield-checkmark-outline" as const, title: "الخصوصية" },
] as const;

const ProfileScreen = () => {
  const { scrollPadding } = useTabBarMetrics();
  const { signOut, isSignedIn, user } = useSession();
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: scrollPadding }}
      >
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row items-center">
            <BrandMark size={56} />
            <Text className="text-text-primary text-3xl font-bold ms-3">حسابي</Text>
          </View>

          <View className="bg-surface border border-line rounded-2xl p-5 mt-5">
            {isSignedIn ? (
              <View className="flex-row items-center">
                <Image
                  source={user?.imageUrl}
                  style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: palette.line }}
                />
                <View className="flex-1 ms-4">
                  <Text className="text-text-primary text-xl font-bold">{name || "عميل المول"}</Text>
                  <Text className="text-text-secondary text-sm mt-1">{user?.email || ""}</Text>
                </View>
              </View>
            ) : (
              <View>
                <Text className="text-text-primary text-xl font-bold">تتسوق كضيف</Text>
                <Text className="text-text-secondary text-sm leading-6 mt-2">
                  يمكنك إكمال الطلب بدون حساب. تسجيل الدخول يحفظ عناوينك وطلباتك فقط.
                </Text>
                <TouchableOpacity
                  className="bg-primary rounded-xl py-3 mt-4 items-center"
                  onPress={() => router.push("/sign-in")}
                  accessibilityRole="button"
                >
                  <Text className="text-ivory font-bold">
                    {clerkPublishableKey ? "تسجيل الدخول" : "اكتشف المول"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View className="mx-6 bg-surface border border-line rounded-2xl overflow-hidden">
          {MENU_ITEMS.map((item, index) => (
            <View
              key={item.id}
              className={`flex-row items-center px-4 py-4 ${index < MENU_ITEMS.length - 1 ? "border-b border-line" : ""}`}
            >
              <View className="w-10 h-10 rounded-full bg-background items-center justify-center">
                <Ionicons name={item.icon} size={20} color={palette.ink} />
              </View>
              <Text className="flex-1 text-text-primary font-bold text-base ms-3">{item.title}</Text>
            </View>
          ))}
        </View>

        {isSignedIn && (
          <TouchableOpacity
            className="mx-6 mt-4 bg-surface border border-line rounded-2xl py-4 flex-row items-center justify-center"
            activeOpacity={0.8}
            onPress={() => signOut()}
          >
            <Ionicons name="log-out-outline" size={20} color={palette.discount} />
            <Text className="text-accent font-bold text-base ms-2">تسجيل الخروج</Text>
          </TouchableOpacity>
        )}

        <Text className="mx-6 mt-6 text-center text-text-tertiary text-xs">مول البايض · 1.0.0</Text>
      </ScrollView>
    </SafeScreen>
  );
};

export default ProfileScreen;
