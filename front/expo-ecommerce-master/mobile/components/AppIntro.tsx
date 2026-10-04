import MallLogoLoader from "@/components/mall-logo-loader";
import { palette } from "@/theme/palette";
import { useCallback } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const EXIT_DURATION_MS = 220;

export default function AppIntro({ onFinish }: { onFinish: () => void }) {
  const { width } = useWindowDimensions();
  const opacity = useSharedValue(1);

  const handleComplete = useCallback(() => {
    opacity.value = withTiming(0, { duration: EXIT_DURATION_MS }, (finished) => {
      if (finished) runOnJS(onFinish)();
    });
  }, [onFinish, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.container, animatedStyle]}>
      <MallLogoLoader size={Math.min(width * 0.72, 320)} duration={1.4} onComplete={handleComplete} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    elevation: 1000,
    pointerEvents: "none",
  },
});
