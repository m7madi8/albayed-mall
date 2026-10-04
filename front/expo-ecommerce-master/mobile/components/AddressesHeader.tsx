import { palette } from "@/theme/palette";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function AddressesHeader() {
  return (
    <View className="px-4 pb-5 border-b border-line flex-row items-center">
      <TouchableOpacity
        onPress={() => router.back()}
        className="w-11 h-11 items-center justify-center"
        accessibilityLabel="رجوع"
      >
        <Ionicons name="arrow-forward" size={24} color={palette.ink} />
      </TouchableOpacity>
      <Text className="text-text-primary text-2xl font-bold ms-1">عناويني</Text>
    </View>
  );
}
