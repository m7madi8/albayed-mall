import { palette } from "@/theme/palette";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function BackButton({ color = palette.ink }: { color?: string }) {
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel="رجوع"
      className="w-11 h-11 items-center justify-center"
      hitSlop={8}
    >
      <Ionicons name="arrow-forward" size={24} color={color} />
    </TouchableOpacity>
  );
}
