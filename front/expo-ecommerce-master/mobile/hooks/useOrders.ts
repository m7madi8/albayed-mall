import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { useSession } from "@/lib/session";
import { Order } from "@/types";

export const useOrders = () => {
  const api = useApi();
  const { isSignedIn } = useSession();

  return useQuery<Order[]>({
    queryKey: ["orders"],
    enabled: isSignedIn,
    queryFn: async () => {
      const { data } = await api.get("/orders");
      return data.orders;
    },
  });
};
