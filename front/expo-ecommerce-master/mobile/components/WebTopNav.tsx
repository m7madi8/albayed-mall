import BrandMark from "@/components/BrandMark";
import { palette } from "@/theme/palette";
import { WEB_MAX_CONTENT_WIDTH } from "@/lib/responsive";
import useCart from "@/hooks/useCart";
import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import { Platform, Text, View } from "react-native";

type NavItem = {
  href: "/(tabs)" | "/(tabs)/cart" | "/(tabs)/profile";
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isActive: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/(tabs)",
    label: "الرئيسية",
    icon: "home-outline",
    isActive: (p) => p === "/" || p === "" || (!p.includes("cart") && !p.includes("profile")),
  },
  {
    href: "/(tabs)/cart",
    label: "السلة",
    icon: "cart-outline",
    isActive: (p) => p.includes("cart"),
  },
  {
    href: "/(tabs)/profile",
    label: "حسابي",
    icon: "person-outline",
    isActive: (p) => p.includes("profile"),
  },
];

export default function WebTopNav() {
  if (Platform.OS !== "web") return null;

  const pathname = usePathname();
  const { cartItemCount } = useCart();

  return (
    <View
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: palette.surface,
        borderBottomWidth: 1,
        borderBottomColor: palette.line,
        shadowColor: palette.ink,
        shadowOpacity: 0.04,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: WEB_MAX_CONTENT_WIDTH,
          alignSelf: "center",
          paddingHorizontal: 20,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/(tabs)" asChild>
          <View accessibilityRole="link" className="flex-row items-center">
            <BrandMark size={48} />
            <View className="ms-3">
              <Text className="text-text-primary text-lg font-bold">مول البايض</Text>
              <Text className="text-text-secondary text-xs">تسوق إلكتروني</Text>
            </View>
          </View>
        </Link>

        <View className="flex-row items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = item.isActive(pathname);
            const showBadge = item.href.includes("cart") && cartItemCount > 0;

            return (
              <Link key={item.href} href={item.href} asChild>
                <View
                  accessibilityRole="link"
                  className={`flex-row items-center px-4 py-2.5 rounded-xl border ${
                    active ? "bg-primary border-primary" : "bg-transparent border-transparent"
                  }`}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={active ? palette.onPrimary : palette.ink}
                  />
                  <Text
                    className={`ms-2 text-sm font-bold ${active ? "text-ivory" : "text-text-primary"}`}
                  >
                    {item.label}
                  </Text>
                  {showBadge ? (
                    <View className="ms-2 bg-lime min-w-5 h-5 px-1 rounded-full items-center justify-center">
                      <Text className="text-ink text-[10px] font-bold">{cartItemCount}</Text>
                    </View>
                  ) : null}
                </View>
              </Link>
            );
          })}
        </View>
      </View>
    </View>
  );
}
