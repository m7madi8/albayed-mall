import BrandMark from "@/components/BrandMark";
import { palette } from "@/theme/palette";
import { WEB_COMPACT_MAX_WIDTH, WEB_MAX_CONTENT_WIDTH } from "@/lib/responsive";
import useCart from "@/hooks/useCart";
import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

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

const MENU_ITEMS = NAV_ITEMS.filter((item) => !item.href.includes("cart"));

function IconButton({
  onPress,
  label,
  children,
}: {
  onPress?: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: pressed ? palette.line : palette.background,
        borderWidth: 1,
        borderColor: palette.line,
      })}
    >
      {children}
    </Pressable>
  );
}

export default function WebTopNav() {
  if (Platform.OS !== "web") return null;

  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const { cartItemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const isCompact = width < WEB_COMPACT_MAX_WIDTH;

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen || typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

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
          paddingHorizontal: isCompact ? 12 : 20,
          paddingVertical: isCompact ? 10 : 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        {isCompact ? (
          <>
            <IconButton label="القائمة" onPress={() => setMenuOpen((open) => !open)}>
              <Ionicons name={menuOpen ? "close" : "menu"} size={24} color={palette.ink} />
            </IconButton>

            <Link href="/(tabs)" asChild>
              <Pressable
                accessibilityRole="link"
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
              >
                <View className="flex-row items-center">
                  <BrandMark size={36} />
                  <Text className="text-text-primary text-base font-bold ms-2" numberOfLines={1}>
                    مول البايض
                  </Text>
                </View>
              </Pressable>
            </Link>

            <Link href="/(tabs)/cart" asChild>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="السلة"
                style={({ pressed }) => ({
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: pressed ? palette.line : palette.background,
                  borderWidth: 1,
                  borderColor: palette.line,
                })}
              >
                <Ionicons name="cart-outline" size={24} color={palette.ink} />
                {cartItemCount > 0 ? (
                  <View
                    style={{
                      position: "absolute",
                      top: -4,
                      left: -4,
                      minWidth: 18,
                      height: 18,
                      paddingHorizontal: 4,
                      borderRadius: 9,
                      backgroundColor: palette.primary,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: palette.onPrimary, fontSize: 10, fontWeight: "700" }}>
                      {cartItemCount}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            </Link>
          </>
        ) : (
          <>
            <Link href="/(tabs)" asChild>
              <Pressable accessibilityRole="link" className="flex-row items-center">
                <BrandMark size={48} />
                <View className="ms-3">
                  <Text className="text-text-primary text-lg font-bold">مول البايض</Text>
                  <Text className="text-text-secondary text-xs">تسوق إلكتروني</Text>
                </View>
              </Pressable>
            </Link>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              {NAV_ITEMS.map((item) => {
                const active = item.isActive(pathname);
                const showBadge = item.href.includes("cart") && cartItemCount > 0;

                return (
                  <Link key={item.href} href={item.href} asChild>
                    <Pressable
                      accessibilityRole="link"
                      style={({ pressed }) => ({
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: active ? palette.primary : "transparent",
                        backgroundColor: active
                          ? palette.primary
                          : pressed
                            ? palette.line
                            : "transparent",
                      })}
                    >
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={active ? palette.onPrimary : palette.ink}
                      />
                      <Text
                        style={{
                          marginStart: 8,
                          fontSize: 14,
                          fontWeight: "700",
                          color: active ? palette.onPrimary : palette.ink,
                        }}
                      >
                        {item.label}
                      </Text>
                      {showBadge ? (
                        <View className="ms-2 bg-lime min-w-5 h-5 px-1 rounded-full items-center justify-center">
                          <Text className="text-ink text-[10px] font-bold">{cartItemCount}</Text>
                        </View>
                      ) : null}
                    </Pressable>
                  </Link>
                );
              })}
            </View>
          </>
        )}
      </View>

      {isCompact && menuOpen ? (
        <>
          <Pressable
            onPress={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(23, 25, 24, 0.35)",
              zIndex: 40,
            }}
            accessibilityRole="button"
            accessibilityLabel="إغلاق القائمة"
          />
          <View
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: palette.surface,
              borderBottomWidth: 1,
              borderBottomColor: palette.line,
              paddingVertical: 8,
              paddingHorizontal: 12,
              zIndex: 60,
              shadowColor: palette.ink,
              shadowOpacity: 0.08,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
            }}
          >
            {MENU_ITEMS.map((item) => {
              const active = item.isActive(pathname);
              return (
                <Link key={item.href} href={item.href} asChild>
                  <Pressable
                    accessibilityRole="link"
                    onPress={() => setMenuOpen(false)}
                    style={({ pressed }) => ({
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 14,
                      paddingHorizontal: 12,
                      borderRadius: 12,
                      marginBottom: 4,
                      backgroundColor: active
                        ? palette.primary
                        : pressed
                          ? palette.line
                          : "transparent",
                    })}
                  >
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={active ? palette.onPrimary : palette.ink}
                    />
                    <Text
                      style={{
                        marginStart: 12,
                        fontSize: 16,
                        fontWeight: "700",
                        color: active ? palette.onPrimary : palette.ink,
                      }}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                </Link>
              );
            })}
          </View>
        </>
      ) : null}
    </View>
  );
}
