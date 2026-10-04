import { palette } from "@/theme/palette";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useMemo, useState } from "react";
import Animated, { Easing, withDelay, withTiming } from "react-native-reanimated";

const ENTER_RISE = 28;
const ENTER_SCALE = 0.94;
const ENTER_STAGGER_MS = 70;
const ENTER_MAX_STAGGERED = 6;
const enterEasing = Easing.out(Easing.cubic);

function itemEntering(index: number) {
  const delay = Math.min(index, ENTER_MAX_STAGGERED) * ENTER_STAGGER_MS;
  return () => {
    "worklet";
    const timing = (to: number, duration: number) =>
      withDelay(delay, withTiming(to, { duration, easing: enterEasing }));
    return {
      initialValues: { opacity: 0, transform: [{ translateY: ENTER_RISE }, { scale: ENTER_SCALE }] },
      animations: {
        opacity: timing(1, 320),
        transform: [{ translateY: timing(0, 420) }, { scale: timing(1, 420) }],
      },
    };
  };
}

interface ProductsGridProps {
  isLoading: boolean;
  isError: boolean;
  products: Product[];
  onRetry?: () => void;
  /** The entrance animation plays only when this changes after the first render (e.g. category switch). */
  animationKey?: string;
}

const ProductsGrid = ({ products, isLoading, isError, onRetry, animationKey }: ProductsGridProps) => {
  const [initialKey] = useState(animationKey);
  const [hasNavigated, setHasNavigated] = useState(false);
  const keyChanged = animationKey !== initialKey;
  if (keyChanged && !hasNavigated) setHasNavigated(true);
  const animate = hasNavigated || keyChanged;

  const rows = useMemo(() => {
    const result: Product[][] = [];
    for (let i = 0; i < products.length; i += 2) {
      result.push(products.slice(i, i + 2));
    }
    return result;
  }, [products]);

  if (isLoading) {
    return (
      <View className="py-16 items-center justify-center">
        <ActivityIndicator size="large" color={palette.primary} />
        <Text className="text-text-secondary mt-4">جارٍ تحضير المنتجات</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="py-16 items-center justify-center px-4">
        <Ionicons name="storefront-outline" size={40} color={palette.ink} />
        <Text className="text-text-primary font-bold mt-4 text-center">المنتجات غير متاحة الآن</Text>
        <Text className="text-text-secondary text-sm mt-2 text-center leading-6">
          تعذر الاتصال بمتجر المول. يمكنك إعادة المحاولة عندما يكون الاتصال جاهزاً.
        </Text>
        {onRetry && (
          <TouchableOpacity onPress={onRetry} className="mt-5 bg-primary px-5 py-3 rounded-xl">
            <Text className="text-ivory font-bold">إعادة المحاولة</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (products.length === 0) {
    return <NoProductsFound />;
  }

  return (
    <View key={animationKey}>
      {rows.map((row, rowIndex) => (
        <View key={row.map((p) => p._id).join("-")} className="flex-row justify-between">
          {row.map((product, colIndex) => (
            <Animated.View
              key={product._id}
              entering={animate ? itemEntering(rowIndex * 2 + colIndex) : undefined}
            >
              <ProductCard product={product} />
            </Animated.View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default ProductsGrid;

function NoProductsFound() {
  return (
    <View className="py-16 items-center justify-center">
      <Ionicons name="search-outline" size={40} color={palette.slate} />
      <Text className="text-text-primary font-bold mt-4">لا توجد منتجات</Text>
      <Text className="text-text-secondary text-sm mt-2">جرّب قسماً آخر أو كلمة بحث مختلفة</Text>
    </View>
  );
}
