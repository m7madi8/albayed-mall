import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_BAR_CONTENT_HEIGHT = Platform.select({ ios: 54, android: 58, default: 54 }) ?? 54;

export function useTabBarMetrics() {
  const insets = useSafeAreaInsets();

  if (Platform.OS === "web") {
    return {
      height: 0,
      bottomInset: 0,
      scrollPadding: 32,
    };
  }

  const bottomInset = Math.max(insets.bottom, Platform.OS === "android" ? 12 : 8);
  const height = TAB_BAR_CONTENT_HEIGHT + bottomInset;

  return {
    height,
    bottomInset,
    scrollPadding: height + 20,
  };
}
