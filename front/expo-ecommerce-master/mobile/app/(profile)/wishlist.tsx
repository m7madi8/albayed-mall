import { palette } from "@/theme/palette";
import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { formatPrice } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

function WishlistScreen() {
  const { wishlist, isLoading, isError, removeFromWishlist, isRemovingFromWishlist } =
    useWishlist();

  const { addToCart, isAddingToCart } = useCart();

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    Alert.alert("إزالة من المفضلة", `إزالة ${productName}؟`, [
      { text: "إلغاء", style: "cancel" },
      {
        text: "إزالة",
        style: "destructive",
        onPress: () => removeFromWishlist(productId),
      },
    ]);
  };

  const handleAddToCart = (product: (typeof wishlist)[number]) => {
    addToCart(
      { productId: product._id, quantity: 1, product },
      {
        onSuccess: () => Alert.alert("تمت الإضافة", `أُضيف ${product.name} إلى السلة`),
        onError: (error: any) => {
          Alert.alert("تعذر الإضافة", error?.response?.data?.error || "حاول مرة أخرى");
        },
      }
    );
  };

  if (isLoading) return <LoadingUI />;
  if (isError) return <ErrorUI />;

  return (
    <SafeScreen>
      {/* HEADER */}
      <View className="px-4 pb-5 border-b border-line flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center"
          accessibilityLabel="رجوع"
        >
          <Ionicons name="arrow-forward" size={24} color={palette.ink} />
        </TouchableOpacity>
        <Text className="text-text-primary text-2xl font-bold ms-1">المفضلة</Text>
        <Text className="text-text-secondary text-sm ms-auto">{wishlist.length} منتج</Text>
      </View>

      {wishlist.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="heart-outline" size={64} color={palette.slate} />
          <Text className="text-text-primary font-bold text-xl mt-4">المفضلة فارغة</Text>
          <Text className="text-text-secondary text-center mt-2">احفظ المنتجات التي تريدها لاحقاً</Text>
          <TouchableOpacity
            className="bg-primary rounded-2xl px-8 py-4 mt-6"
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)")}
          >
            <Text className="text-ivory font-bold text-base">تصفح المنتجات</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 py-4">
            {wishlist.map((item) => (
              <TouchableOpacity
                key={item._id}
                className="bg-surface border border-line rounded-2xl overflow-hidden mb-3"
                activeOpacity={0.8}
                // onPress={() => router.push(`/product/${item._id}`)}
              >
                <View className="flex-row p-4">
                  <Image
                    source={item.images[0]}
                    className="rounded-2xl bg-background-lighter"
                    style={{ width: 96, height: 96, borderRadius: 8 }}
                  />

                  <View className="flex-1 ms-4">
                    <Text className="text-text-primary font-bold text-base mb-2" numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text className="text-text-primary font-bold text-xl mb-2">{formatPrice(item.price)}</Text>

                    {item.stock > 0 ? (
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 bg-primary rounded-full me-2" />
                        <Text className="text-text-primary text-sm font-semibold">متوفر · {item.stock}</Text>
                      </View>
                    ) : (
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 bg-accent rounded-full me-2" />
                        <Text className="text-accent text-sm font-semibold">غير متوفر</Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    className="self-start bg-accent/10 p-2 rounded-full"
                    activeOpacity={0.7}
                    onPress={() => handleRemoveFromWishlist(item._id, item.name)}
                    disabled={isRemovingFromWishlist}
                  >
                    <Ionicons name="trash-outline" size={20} color={palette.discount} />
                  </TouchableOpacity>
                </View>
                {item.stock > 0 && (
                  <View className="px-4 pb-4">
                    <TouchableOpacity
                      className="bg-primary rounded-xl py-3 items-center"
                      activeOpacity={0.8}
                      onPress={() => handleAddToCart(item)}
                      disabled={isAddingToCart}
                    >
                      {isAddingToCart ? (
                        <ActivityIndicator size="small" color={palette.onPrimary} />
                      ) : (
                        <Text className="text-ivory font-bold">أضف إلى السلة</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeScreen>
  );
}
export default WishlistScreen;

function LoadingUI() {
  return (
    <SafeScreen>
      <View className="px-6 pb-5 border-b border-surface flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 items-center justify-center">
          <Ionicons name="arrow-forward" size={24} color={palette.ink} />
        </TouchableOpacity>
        <Text className="text-text-primary text-2xl font-bold ms-1">المفضلة</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={palette.primary} />
        <Text className="text-text-secondary mt-4">جارٍ تحميل المفضلة</Text>
      </View>
    </SafeScreen>
  );
}

function ErrorUI() {
  return (
    <SafeScreen>
      <View className="px-6 pb-5 border-b border-surface flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 items-center justify-center">
          <Ionicons name="arrow-forward" size={24} color={palette.ink} />
        </TouchableOpacity>
        <Text className="text-text-primary text-2xl font-bold ms-1">المفضلة</Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={56} color={palette.discount} />
        <Text className="text-text-primary font-bold text-xl mt-4">تعذر تحميل المفضلة</Text>
        <Text className="text-text-secondary text-center mt-2">تحقق من الاتصال ثم أعد المحاولة</Text>
      </View>
    </SafeScreen>
  );
}
