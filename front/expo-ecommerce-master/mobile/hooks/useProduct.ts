import { getCatalogProduct } from "@/data/store-catalog";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Product } from "@/types";

export const useProduct = (productId: string) => {
  const api = useApi();

  const result = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const local = getCatalogProduct(productId);
      if (local) return local;

      const { data } = await api.get<Product>(`/products/${productId}`);
      return data;
    },
    enabled: !!productId,
  });

  return result;
};
