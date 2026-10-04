import { palette } from "@/theme/palette";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "تعذر إكمال الطلب",
  description = "تحقق من الاتصال ثم أعد المحاولة",
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <Ionicons name="alert-circle-outline" size={56} color={palette.discount} />
      <Text className="text-text-primary font-bold text-xl mt-4 text-center">{title}</Text>
      <Text className="text-text-secondary text-center mt-2 leading-6">{description}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} className="mt-5 bg-primary px-6 py-3 rounded-xl">
          <Text className="text-ivory font-bold">إعادة المحاولة</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
