import { formatPrice } from "@/lib/utils";
import { Text, View } from "react-native";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
}

export default function OrderSummary({ subtotal, shipping, total }: OrderSummaryProps) {
  return (
    <View className="px-6 mt-6">
      <View className="bg-surface border border-line rounded-2xl p-5">
        <Text className="text-text-primary text-lg font-bold mb-4">ملخص الطلب</Text>

        <SummaryRow label="المجموع الفرعي" value={formatPrice(subtotal)} />
        <SummaryRow label="التوصيل" value={formatPrice(shipping)} />

        <View className="border-t border-line pt-3 mt-2 flex-row justify-between items-center">
          <Text className="text-text-primary font-bold text-base">الإجمالي</Text>
          <Text className="text-text-primary font-bold text-2xl">{formatPrice(total)}</Text>
        </View>
      </View>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center mb-3">
      <Text className="text-text-secondary text-base">{label}</Text>
      <Text className="text-text-primary font-semibold text-base">{value}</Text>
    </View>
  );
}
