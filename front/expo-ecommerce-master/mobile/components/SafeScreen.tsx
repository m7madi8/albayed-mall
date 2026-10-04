import { WEB_MAX_CONTENT_WIDTH } from "@/lib/responsive";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SafeScreen = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 0 : insets.top;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: topPad, direction: "rtl" }}>
      <View
        className="flex-1 w-full self-center"
        style={Platform.OS === "web" ? { maxWidth: WEB_MAX_CONTENT_WIDTH } : undefined}
      >
        {children}
      </View>
    </View>
  );
};

export default SafeScreen;
