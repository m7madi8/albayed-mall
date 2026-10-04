import { palette } from "@/theme/palette";
import { useTabBarMetrics } from "@/lib/tab-bar";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type ToastContextValue = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function AppToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { height: tabBarHeight } = useTabBarMetrics();

  const hide = useCallback(() => setMessage(null), []);

  const showToast = useCallback(
    (text: string) => {
      if (hideTimer.current) clearTimeout(hideTimer.current);

      setMessage(text);
      opacity.value = withTiming(1, { duration: 120 });
      translateY.value = withTiming(0, { duration: 140 });

      hideTimer.current = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 120 });
        translateY.value = withTiming(10, { duration: 130 }, (finished) => {
          if (finished) runOnJS(hide)();
        });
      }, 1000);
    },
    [hide, opacity, translateY]
  );

  const toastStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message ? (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              alignSelf: "center",
              left: 0,
              right: 0,
              bottom: tabBarHeight + 8,
              zIndex: 1000,
              alignItems: "center",
            },
            toastStyle,
          ]}
        >
          <View
            style={{
              backgroundColor: palette.primaryDark,
              borderRadius: 999,
              paddingVertical: 7,
              paddingHorizontal: 14,
            }}
          >
            <Text className="text-ivory font-semibold text-xs">{message}</Text>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error("useToast must be used within AppToastProvider");
  }
  return value;
}
