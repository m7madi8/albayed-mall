import { palette } from "@/theme/palette";
import useCart from "@/hooks/useCart";
import { useToast } from "@/lib/toast";
import { formatPrice, getOffer } from "@/lib/utils";
import { Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { memo } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const CARD_IMAGE_HEIGHT = 168;
const CARD_CONTENT_HEIGHT = 130;
const GRID_HORIZONTAL_PADDING = 40;
const GRID_GAP = 12;

interface ProductCardProps {
  product: Product;
  layout?: "grid" | "rail";
}

function ProductCard({ product }: ProductCardProps) {
  const { width: screenWidth } = useWindowDimensions();
  const { addToCart, isAddingToCart } = useCart();
  const { showToast } = useToast();
  const offer = getOffer(product);

  const tilt = useSharedValue(0);
  const scale = useSharedValue(1);
  const lift = useSharedValue(0);

  const cardWidth = Math.floor((screenWidth - GRID_HORIZONTAL_PADDING - GRID_GAP) / 2);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 900 },
      { translateY: lift.value },
      { rotateZ: `${tilt.value}deg` },
      { scale: scale.value },
    ],
  }));

  const playAddTilt = () => {
    tilt.value = 0;
    scale.value = 1;
    lift.value = 0;

    tilt.value = withSequence(
      withTiming(-4.5, { duration: 140 }),
      withTiming(2.5, { duration: 180 }),
      withTiming(0, { duration: 420 })
    );

    scale.value = withSequence(
      withTiming(1.028, { duration: 160 }),
      withTiming(1, { duration: 450 })
    );

    lift.value = withSequence(
      withTiming(-3, { duration: 150 }),
      withTiming(0, { duration: 440 })
    );
  };

  const handleAddToCart = () => {
    if (product.stock <= 0 || isAddingToCart) return;

    playAddTilt();
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    addToCart(
      { productId: product._id, quantity: 1, product },
      {
        onSuccess: () => {
          showToast("تمت الإضافة");
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
        onError: (error: any) => {
          Alert.alert("تعذر الإضافة", error?.response?.data?.error || "حاول مرة أخرى");
        },
      }
    );
  };

  return (
    <Animated.View
      style={[{ width: cardWidth, height: CARD_IMAGE_HEIGHT + CARD_CONTENT_HEIGHT }, cardAnimatedStyle]}
      className="mb-3"
    >
      <View
        className="bg-surface border border-line rounded-2xl overflow-hidden flex-1"
        accessibilityLabel={product.name}
      >
        <View className="relative bg-surface-light" style={{ height: CARD_IMAGE_HEIGHT }}>
          <Image
            source={product.images[0]}
            style={{ width: "100%", height: CARD_IMAGE_HEIGHT }}
            contentFit="cover"
            accessibilityLabel={product.name}
          />
          {offer ? (
            <View className="absolute top-3 right-3 bg-accent rounded-full px-2.5 py-1">
              <Text className="text-white text-xs font-bold">-{offer.percent}%</Text>
            </View>
          ) : product.promoLabel ? (
            <View className="absolute top-3 right-3 bg-primary-dark rounded-full px-2.5 py-1 max-w-[88%]">
              <Text className="text-ivory text-[10px] font-bold" numberOfLines={1}>
                {product.promoLabel}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="px-3 pt-3 pb-4 justify-between flex-1" style={{ height: CARD_CONTENT_HEIGHT }}>
          <View>
            <Text className="text-text-tertiary text-xs mb-1" numberOfLines={1}>
              {product.category}
            </Text>
            <Text
              className="text-text-primary font-bold text-sm leading-5"
              numberOfLines={2}
              style={{ minHeight: 40 }}
            >
              {product.name}
            </Text>
          </View>

          <View className="flex-row items-end justify-between mt-2">
            <View className="flex-1 pe-2">
              {product.stock <= 0 ? (
                <Text className="text-accent text-xs">غير متوفر</Text>
              ) : product.stock <= 5 ? (
                <Text className="text-text-secondary text-xs mb-0.5">متبقي {product.stock}</Text>
              ) : null}
              <Text className="text-text-primary font-bold text-base">{formatPrice(product.price)}</Text>
              {offer && (
                <Text className="text-text-tertiary text-xs line-through mt-0.5">
                  {formatPrice(offer.compare)}
                </Text>
              )}
            </View>
            <TouchableOpacity
              className={`w-11 h-11 rounded-full items-center justify-center ${
                product.stock <= 0 ? "bg-background-light" : "bg-primary"
              }`}
              activeOpacity={0.7}
              onPress={handleAddToCart}
              disabled={isAddingToCart || product.stock <= 0}
              accessibilityRole="button"
              accessibilityLabel="أضف إلى السلة"
            >
              {isAddingToCart ? (
                <ActivityIndicator size="small" color={palette.onPrimary} />
              ) : (
                <Ionicons name="add" size={20} color={product.stock <= 0 ? palette.slate : palette.onPrimary} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export default memo(ProductCard);
