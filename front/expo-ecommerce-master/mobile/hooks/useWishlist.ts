import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { useSession } from "@/lib/session";
import { Product } from "@/types";
import { useState } from "react";

const useWishlist = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const { isSignedIn } = useSession();
  const [localWishlist, setLocalWishlist] = useState<Product[]>([]);

  const {
    data: wishlist,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wishlist"],
    enabled: isSignedIn,
    queryFn: async () => {
      const { data } = await api.get<{ wishlist: Product[] }>("/users/wishlist");
      return data.wishlist;
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.post<{ wishlist: string[] }>("/users/wishlist", { productId });
      return data.wishlist;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete<{ wishlist: string[] }>(`/users/wishlist/${productId}`);
      return data.wishlist;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const items = isSignedIn ? wishlist || [] : localWishlist;

  const isInWishlist = (productId: string) => {
    return items.some((product) => product._id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (!isSignedIn) {
      setLocalWishlist((prev) =>
        prev.some((item) => item._id === product._id)
          ? prev.filter((item) => item._id !== product._id)
          : [...prev, product]
      );
      return;
    }

    if (isInWishlist(product._id)) {
      removeFromWishlistMutation.mutate(product._id);
    } else {
      addToWishlistMutation.mutate(product._id);
    }
  };

  const removeFromWishlist = (productId: string) => {
    if (!isSignedIn) {
      setLocalWishlist((prev) => prev.filter((item) => item._id !== productId));
      return;
    }
    removeFromWishlistMutation.mutate(productId);
  };

  return {
    wishlist: items,
    isLoading: isSignedIn ? isLoading : false,
    isError: isSignedIn ? isError : false,
    wishlistCount: items.length,
    isInWishlist,
    toggleWishlist,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist,
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending,
  };
};

export default useWishlist;
