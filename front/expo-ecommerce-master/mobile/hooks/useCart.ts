import { isCatalogProductId } from "@/data/store-catalog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { useGuestCart } from "@/lib/guest-cart";
import { useSession } from "@/lib/session";
import { Cart, Product } from "@/types";

type CartMutationOptions = {
  onSuccess?: (cart?: Cart) => void;
  onError?: (error: any) => void;
};

const useCart = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { isSignedIn } = useSession();
  const guest = useGuestCart();

  const {
    data: cart,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart"],
    enabled: isSignedIn,
    queryFn: async () => {
      const { data } = await api.get<{ cart: Cart }>("/cart");
      return data.cart;
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      const { data } = await api.post<{ cart: Cart }>("/cart", { productId, quantity });
      return data.cart;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const { data } = await api.put<{ cart: Cart }>(`/cart/${productId}`, { quantity });
      return data.cart;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete<{ cart: Cart }>(`/cart/${productId}`);
      return data.cart;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<{ cart: Cart }>("/cart");
      return data.cart;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const signedItems = cart?.items ?? [];
  const items = isSignedIn
    ? [...guest.items, ...signedItems.filter((item) => !isCatalogProductId(item.product._id))]
    : guest.items;

  const cartTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (
    vars: { productId: string; quantity?: number; product?: Product },
    options?: CartMutationOptions
  ) => {
    if (!isSignedIn || isCatalogProductId(vars.productId)) {
      if (!vars.product) {
        options?.onError?.(new Error("Product is required for a guest cart"));
        return;
      }
      guest.add(vars.product, vars.quantity ?? 1);
      options?.onSuccess?.();
      return;
    }
    addToCartMutation.mutate(
      { productId: vars.productId, quantity: vars.quantity },
      options
    );
  };

  const updateQuantity = (
    vars: { productId: string; quantity: number },
    options?: CartMutationOptions
  ) => {
    if (!isSignedIn || isCatalogProductId(vars.productId)) {
      guest.updateQuantity(vars.productId, vars.quantity);
      options?.onSuccess?.();
      return;
    }
    updateQuantityMutation.mutate(vars, options);
  };

  const removeFromCart = (productId: string, options?: CartMutationOptions) => {
    if (!isSignedIn || isCatalogProductId(productId)) {
      guest.remove(productId);
      options?.onSuccess?.();
      return;
    }
    removeFromCartMutation.mutate(productId, options);
  };

  const clearCart = (options?: CartMutationOptions) => {
    guest.clear();
    if (!isSignedIn) {
      options?.onSuccess?.();
      return;
    }
    clearCartMutation.mutate(undefined, options);
  };

  return {
    cart: { items },
    items,
    isLoading: isSignedIn ? isLoading : false,
    isError: isSignedIn ? isError : false,
    cartTotal,
    cartItemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isAddingToCart: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };
};
export default useCart;
