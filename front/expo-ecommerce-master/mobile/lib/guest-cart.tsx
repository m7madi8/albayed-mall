import { CartItem, Product } from "@/types";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

type GuestCartValue = {
  items: CartItem[];
  add: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const GuestCartContext = createContext<GuestCartValue | null>(null);

export function GuestCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (!existing) {
        return [...prev, { _id: product._id, product, quantity }];
      }
      return prev.map((item) =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.product._id === productId ? { ...item, quantity } : item))
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product._id !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<GuestCartValue>(
    () => ({
      items,
      add,
      updateQuantity,
      remove,
      clear,
    }),
    [items, add, updateQuantity, remove, clear]
  );

  return <GuestCartContext.Provider value={value}>{children}</GuestCartContext.Provider>;
}

export function useGuestCart() {
  const value = useContext(GuestCartContext);
  if (!value) {
    throw new Error("useGuestCart must be used within GuestCartProvider");
  }
  return value;
}
