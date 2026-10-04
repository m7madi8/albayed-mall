import { palette } from "@/theme/palette";
import AddressFormModal from "@/components/AddressFormModal";
import AddressSelectionModal from "@/components/AddressSelectionModal";
import OrderSummary from "@/components/OrderSummary";
import RewardModal from "@/components/RewardModal";
import SafeScreen from "@/components/SafeScreen";
import { useAddresses } from "@/hooks/useAddressess";
import useCart from "@/hooks/useCart";
import { useApi } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useToast } from "@/lib/toast";
import { formatPrice } from "@/lib/utils";
import { useStripe } from "@/lib/payments";
import { Address, CartItem, MysteryReward } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Sentry from "@sentry/react-native";
import { createEmptyAddressForm } from "@/lib/address";

const closeCart = () => {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.navigate("/(tabs)");
};

function CartCloseButton() {
  if (Platform.OS === "web") return null;

  return (
    <Pressable
      onPress={closeCart}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="إغلاق السلة"
      style={({ pressed }) => ({
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: pressed ? palette.line : palette.surface,
        borderWidth: 1,
        borderColor: palette.line,
        transform: [{ scale: pressed ? 0.96 : 1 }],
      })}
    >
      <Ionicons name="close" size={22} color={palette.ink} />
    </Pressable>
  );
}

function CartHeader({
  count,
  subtitle = "راجع مشترياتك قبل الطلب",
}: {
  count?: number;
  subtitle?: string;
}) {
  return (
    <View className="px-6 pt-2 pb-4 flex-row items-start justify-between">
      <View className="flex-1 pe-3">
        <Text className="text-text-primary text-3xl font-bold">السلة</Text>
        {subtitle ? <Text className="text-text-secondary text-sm mt-1">{subtitle}</Text> : null}
      </View>
      <View className="flex-row items-center gap-2">
        {typeof count === "number" && count > 0 ? (
          <View className="bg-primary rounded-full min-w-9 h-9 px-3 items-center justify-center">
            <Text className="text-ivory text-sm font-bold">{count}</Text>
          </View>
        ) : null}
        <CartCloseButton />
      </View>
    </View>
  );
}

const CartScreen = () => {
  const api = useApi();
  const { isSignedIn } = useSession();
  const { showToast } = useToast();
  const {
    items: cartItems,
    cartItemCount,
    cartTotal,
    clearCart,
    isError,
    isLoading,
    isRemoving,
    isUpdating,
    removeFromCart,
    updateQuantity,
  } = useCart();
  const { addresses } = useAddresses();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [guestFormVisible, setGuestFormVisible] = useState(false);
  const [guestAddress, setGuestAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState(createEmptyAddressForm);
  const [rewardVisible, setRewardVisible] = useState(false);
  const [completedTotal, setCompletedTotal] = useState<number | undefined>();
  const [reward, setReward] = useState<MysteryReward | null>(null);

  const subtotal = cartTotal;
  const shipping = 10.0;
  const total = subtotal + shipping;

  const handleQuantityChange = (
    productId: string,
    productName: string,
    currentQuantity: number,
    change: number
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) {
      handleRemoveItem(productId, productName);
      return;
    }
    updateQuantity({ productId, quantity: newQuantity });
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert("حذف الصنف", `إزالة «${productName}» من السلة؟`, [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: () =>
          removeFromCart(productId, {
            onSuccess: () => showToast("تم حذف الصنف"),
          }),
      },
    ]);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    if (!isSignedIn) {
      if (!guestAddress) {
        setAddressForm(createEmptyAddressForm());
        setGuestFormVisible(true);
        return;
      }
      setAddressModalVisible(true);
      return;
    }

    if (!addresses || addresses.length === 0) {
      Alert.alert("لا يوجد عنوان", "أضف عنوان توصيل من حسابك قبل إتمام الطلب.", [{ text: "حسناً" }]);
      return;
    }

    setAddressModalVisible(true);
  };

  const handleSaveGuestAddress = () => {
    if (
      !addressForm.label ||
      !addressForm.fullName ||
      !addressForm.streetAddress ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.phoneNumber
    ) {
      Alert.alert("العنوان ناقص", "أكمل كل حقول العنوان للمتابعة.");
      return;
    }

    const nextAddress: Address = { ...addressForm, _id: `guest-${Date.now()}` };
    setGuestAddress(nextAddress);
    setGuestFormVisible(false);
    setAddressModalVisible(true);
  };

  const handleProceedWithPayment = async (selectedAddress: Address) => {
    setAddressModalVisible(false);

    Sentry.logger.info("Checkout initiated", {
      itemCount: cartItemCount,
      total: total.toFixed(2),
      city: selectedAddress.city,
    });

    try {
      setPaymentLoading(true);

      const { data } = await api.post("/payment/create-intent", {
        cartItems,
        shippingAddress: {
          fullName: selectedAddress.fullName,
          streetAddress: selectedAddress.streetAddress,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode || "",
          phoneNumber: selectedAddress.phoneNumber,
        },
      });

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: "مول البايض",
      });

      if (initError) {
        Sentry.logger.error("Payment sheet init failed", {
          errorCode: initError.code,
          errorMessage: initError.message,
          cartTotal: total,
          itemCount: cartItems.length,
        });

        Alert.alert("تعذر الدفع", initError.message);
        setPaymentLoading(false);
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        Sentry.logger.error("Payment cancelled", {
          errorCode: presentError.code,
          errorMessage: presentError.message,
          cartTotal: total,
          itemCount: cartItems.length,
        });

        Alert.alert("أُلغي الدفع", presentError.message);
      } else {
        Sentry.logger.info("Payment successful", {
          total: total.toFixed(2),
          itemCount: cartItems.length,
        });

        setCompletedTotal(total);
        setReward(null);
        setRewardVisible(true);
        clearCart();
      }
    } catch (error) {
      Sentry.logger.error("Payment failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        cartTotal: total,
        itemCount: cartItems.length,
      });

      Alert.alert("تعذر إتمام الطلب", "لم يكتمل الدفع. يمكنك المحاولة مرة أخرى.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (isLoading) return <LoadingUI />;
  if (isError) return <ErrorUI />;
  if (cartItems.length === 0) return <EmptyUI />;

  const checkoutAddresses = isSignedIn ? undefined : guestAddress ? [guestAddress] : [];

  return (
    <SafeScreen>
      <View className="flex-1">
        <CartHeader count={cartItemCount} />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="px-6 gap-4">
            {cartItems.map((item) => (
              <CartLineItem
                key={item.product._id}
                item={item}
                isRemoving={isRemoving}
                isUpdating={isUpdating}
                onDecrease={() =>
                  handleQuantityChange(item.product._id, item.product.name, item.quantity, -1)
                }
                onIncrease={() =>
                  handleQuantityChange(item.product._id, item.product.name, item.quantity, 1)
                }
                onRemove={() => handleRemoveItem(item.product._id, item.product.name)}
              />
            ))}
          </View>

          <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
        </ScrollView>

        <View className="bg-surface border-t border-line px-6 pt-4 pb-3">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-text-secondary text-sm">
              {cartItemCount} {cartItemCount === 1 ? "صنف" : "أصناف"}
            </Text>
            <Text className="text-text-primary font-bold text-xl">{formatPrice(total)}</Text>
          </View>

          <TouchableOpacity
            className="bg-primary rounded-2xl py-4"
            activeOpacity={0.9}
            onPress={handleCheckout}
            disabled={paymentLoading}
            accessibilityRole="button"
            accessibilityLabel="إتمام الطلب"
          >
            <View className="flex-row items-center justify-center">
              {paymentLoading ? (
                <ActivityIndicator size="small" color={palette.onPrimary} />
              ) : (
                <>
                  <Text className="text-ivory font-bold text-lg me-2">إتمام الطلب</Text>
                  <Ionicons name="arrow-back" size={18} color={palette.onPrimary} />
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <AddressSelectionModal
        visible={addressModalVisible}
        addresses={checkoutAddresses}
        onClose={() => setAddressModalVisible(false)}
        onProceed={handleProceedWithPayment}
        isProcessing={paymentLoading}
      />

      <AddressFormModal
        visible={guestFormVisible}
        isEditing={false}
        addressForm={addressForm}
        isAddingAddress={false}
        isUpdatingAddress={false}
        onClose={() => setGuestFormVisible(false)}
        onSave={handleSaveGuestAddress}
        onFormChange={setAddressForm}
      />

      <RewardModal
        visible={rewardVisible}
        orderTotal={completedTotal}
        reward={reward}
        onClose={() => setRewardVisible(false)}
      />
    </SafeScreen>
  );
};

function CartLineItem({
  item,
  isRemoving,
  isUpdating,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  item: CartItem;
  isRemoving: boolean;
  isUpdating: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}) {
  return (
    <View className="bg-surface border border-line rounded-3xl overflow-hidden">
      <View className="h-1 bg-primary" />

      <View className="px-4 pt-3 pb-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-text-tertiary text-xs">{item.product.category}</Text>
          <TouchableOpacity
            className="flex-row items-center bg-background border border-line rounded-full px-3 py-1.5"
            activeOpacity={0.75}
            onPress={onRemove}
            disabled={isRemoving}
            accessibilityRole="button"
            accessibilityLabel="حذف الصنف"
          >
            <Ionicons name="trash-outline" size={15} color={palette.discount} />
            <Text className="text-accent text-xs font-bold ms-1.5">حذف</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row">
          <Image
            source={item.product.images[0]}
            contentFit="cover"
            style={{ width: 96, height: 96, borderRadius: 16, backgroundColor: palette.line }}
          />

          <View className="flex-1 ms-3 justify-between">
            <View>
              <Text className="text-text-primary font-bold text-base leading-6" numberOfLines={2}>
                {item.product.name}
              </Text>
              <Text className="text-text-secondary text-xs mt-1">
                {formatPrice(item.product.price)} للقطعة
              </Text>
            </View>

            <Text className="text-text-primary font-bold text-xl mt-2">
              {formatPrice(item.product.price * item.quantity)}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-line">
          <Text className="text-text-secondary text-sm">الكمية</Text>
          <View className="flex-row items-center">
            <TouchableOpacity
              className="bg-background border border-line rounded-full w-10 h-10 items-center justify-center"
              activeOpacity={0.7}
              onPress={onDecrease}
              disabled={isUpdating}
              accessibilityLabel="إنقاص الكمية"
            >
              <Ionicons name="remove" size={18} color={palette.ink} />
            </TouchableOpacity>

            <Text className="text-text-primary font-bold text-lg min-w-10 text-center mx-2">
              {item.quantity}
            </Text>

            <TouchableOpacity
              className="bg-primary rounded-full w-10 h-10 items-center justify-center"
              activeOpacity={0.7}
              onPress={onIncrease}
              disabled={isUpdating}
              accessibilityLabel="زيادة الكمية"
            >
              <Ionicons name="add" size={18} color={palette.onPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default CartScreen;

function LoadingUI() {
  return (
    <SafeScreen>
      <CartHeader subtitle="جارٍ تحميل السلة" />
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    </SafeScreen>
  );
}

function ErrorUI() {
  return (
    <SafeScreen>
      <CartHeader subtitle="تعذر تحميل السلة" />
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={56} color={palette.discount} />
        <Text className="text-text-primary font-bold text-xl mt-4">تعذر تحميل السلة</Text>
        <Text className="text-text-secondary text-center mt-2">تحقق من الاتصال ثم أعد المحاولة</Text>
      </View>
    </SafeScreen>
  );
}

function EmptyUI() {
  return (
    <SafeScreen>
      <CartHeader subtitle="سلتك فارغة حالياً" />
      <View className="flex-1 items-center justify-center px-8">
        <View className="w-20 h-20 rounded-full bg-surface border border-line items-center justify-center">
          <Ionicons name="cart-outline" size={36} color={palette.primary} />
        </View>
        <Text className="text-text-primary font-bold text-xl mt-5">سلتك فارغة</Text>
        <Text className="text-text-secondary text-center mt-2 leading-6">
          أضف منتجات من عروض المول لتبدأ الطلب.
        </Text>
        <TouchableOpacity
          className="bg-primary rounded-2xl px-6 py-4 mt-6"
          onPress={() => router.push("/(tabs)")}
        >
          <Text className="text-ivory font-bold">تصفح المنتجات</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}
