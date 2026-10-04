import { ReactNode } from "react";

export function StripeProvider({ children }: { children: ReactNode; publishableKey?: string }) {
  return children;
}

export function useStripe() {
  return {
    initPaymentSheet: async () => ({
      error: {
        code: "Failed" as const,
        message: "الدفع بالبطاقة متاح من تطبيق الجوال.",
      },
    }),
    presentPaymentSheet: async () => ({ error: undefined }),
  };
}
