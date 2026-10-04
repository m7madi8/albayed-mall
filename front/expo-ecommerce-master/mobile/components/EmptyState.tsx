import { palette } from "@/theme/palette";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  title: string;
  description?: string;
  header?: string;
}

export function EmptyState({
  icon = "folder-open-outline",
  iconSize = 64,
  title,
  description,
  header,
}: EmptyStateProps) {
  return (
    <View className="flex-1 bg-background">
      {header && (
        <View className="px-6 pt-6 pb-5">
          <Text className="text-text-primary text-3xl font-bold">{header}</Text>
        </View>
      )}
      <View className="flex-1 items-center justify-center px-8">
        <Ionicons name={icon} size={iconSize} color={palette.slate} />
        <Text className="text-text-primary font-bold text-xl mt-4 text-center">{title}</Text>
        {description && (
          <Text className="text-text-secondary text-center mt-2 leading-6">{description}</Text>
        )}
      </View>
    </View>
  );
}
