import { Image } from "expo-image";

export default function BrandMark({ size = 64 }: { size?: number }) {
  return (
    <Image
      source={require("@/assets/images/logo.png")}
      style={{ width: size, height: size }}
      contentFit="contain"
      accessibilityLabel="مول البايض"
    />
  );
}
