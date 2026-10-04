import { View } from "react-native";
import { WebView } from "react-native-webview";
import type { MallLogoLoaderProps } from "./types";
import { useLoaderDocument } from "./useLoaderDocument";

export default function MallLogoLoader(props: MallLogoLoaderProps) {
  const { html, ready, handleMessage, width, height, label } = useLoaderDocument(props);

  return (
    <View
      style={[{ width, height, opacity: ready ? 1 : 0, pointerEvents: "none" }, props.style]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
    >
      <WebView
        source={{ html }}
        originWhitelist={["*"]}
        onMessage={(event) => handleMessage(event.nativeEvent.data)}
        style={{ flex: 1, backgroundColor: "transparent" }}
        containerStyle={{ backgroundColor: "transparent" }}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        androidLayerType="hardware"
        setSupportMultipleWindows={false}
      />
    </View>
  );
}
