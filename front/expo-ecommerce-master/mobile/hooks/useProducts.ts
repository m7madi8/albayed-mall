import { STORE_CATALOG } from "@/data/store-catalog";
import { useQuery } from "@tanstack/react-query";

const useProducts = () => {
  const result = useQuery({
    queryKey: ["products", "store-catalog"],
    queryFn: async () => STORE_CATALOG,
  });

  return result;
};

export default useProducts;
