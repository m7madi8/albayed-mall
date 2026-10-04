import { palette } from "@/theme/palette";
import BrandMark from "@/components/BrandMark";
import { MysteryReward } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface RewardModalProps {
  visible: boolean;
  onClose: () => void;
  orderTotal?: number;
  reward?: MysteryReward | null;
}

const rewardLabel: Record<MysteryReward["kind"], string> = {
  amount_off: "خصم على الطلب القادم",
  free_delivery: "توصيل مجاني",
  voucher: "قسيمة منتج",
  percent_off: "نسبة خصم",
};

export default function RewardModal({ visible, onClose, orderTotal, reward }: RewardModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/40 items-center justify-end">
        <View className="bg-ivory w-full rounded-t-3xl px-6 pt-8 pb-10">
          <View className="w-12 h-1.5 bg-line rounded-full self-center mb-6" />
          <BrandMark size={72} />
          <Text className="text-text-primary text-3xl font-bold mt-2">تم استلام طلبك</Text>
          <Text className="text-text-secondary text-base leading-7 mt-3">
            سنجهّز الطلب ونتواصل معك على رقم الهاتف المسجّل في العنوان.
          </Text>

          {typeof orderTotal === "number" && (
            <View className="bg-surface border border-line rounded-2xl px-4 py-4 mt-6 flex-row items-center justify-between">
              <Text className="text-text-secondary">قيمة الطلب</Text>
              <Text className="text-text-primary text-xl font-bold">{formatPrice(orderTotal)}</Text>
            </View>
          )}

          {reward && (
            <View className="bg-surface border border-line rounded-2xl px-4 py-5 mt-3">
              <Text className="text-primary text-xs font-bold">{rewardLabel[reward.kind]}</Text>
              <Text className="text-text-primary text-2xl font-bold mt-2">{reward.title}</Text>
              <Text className="text-text-secondary text-base leading-6 mt-2">{reward.detail}</Text>
            </View>
          )}

          <TouchableOpacity
            className="bg-primary rounded-2xl py-4 mt-6 items-center"
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="متابعة التسوق"
          >
            <View className="flex-row items-center">
              <Ionicons name="bag-handle-outline" size={18} color={palette.onPrimary} />
              <Text className="text-ivory font-bold text-base ms-2">متابعة التسوق</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
