import { useEffect, useRef } from "react";
import { View } from "react-native";
import type { MallLogoLoaderProps } from "./types";
import { useLoaderDocument } from "./useLoaderDocument";

export default function MallLogoLoader(props: MallLogoLoaderProps) {
  const { html, ready, handleMessage, width, height, label } = useLoaderDocument(props);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      handleMessage(event.data);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [handleMessage]);

  return (
    <View
      style={[{ width, height, opacity: ready ? 1 : 0, pointerEvents: "none" }, props.style]}
      accessibilityRole="image"
      accessibilityLabel={label}
    >
      <iframe
        ref={frameRef}
        srcDoc={html}
        title={label}
        aria-hidden
        tabIndex={-1}
        style={{ width: "100%", height: "100%", border: 0, background: "transparent", display: "block" }}
      />
    </View>
  );
}
