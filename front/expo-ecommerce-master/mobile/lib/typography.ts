import { StyleSheet, Text, TextInput } from "react-native";

let applied = false;

function withCairo(style: unknown) {
  const flat = StyleSheet.flatten(style as never) as { textAlign?: string } | undefined;
  const align = flat?.textAlign ? null : { textAlign: "right" as const };
  return [{ fontFamily: "Cairo" }, align, style];
}

export function applyCairo() {
  if (applied) return;
  applied = true;

  const text = Text as unknown as {
    render?: (props: { style?: unknown }, ref: unknown) => unknown;
  };
  const input = TextInput as unknown as {
    render?: (props: { style?: unknown }, ref: unknown) => unknown;
  };

  if (typeof text.render !== "function" || typeof input.render !== "function") return;

  const originalText = text.render;
  text.render = function render(props, ref) {
    return originalText.call(this, { ...props, style: withCairo(props.style) }, ref);
  };

  const originalInput = input.render;
  input.render = function render(props, ref) {
    return originalInput.call(this, { ...props, style: withCairo(props.style) }, ref);
  };
}
