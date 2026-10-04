import { palette } from "@/theme/palette";
import { useAddresses } from "@/hooks/useAddressess";
import { Address } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";

interface AddressSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onProceed: (address: Address) => void;
  isProcessing: boolean;
  addresses?: Address[];
}

const AddressSelectionModal = ({
  visible,
  onClose,
  onProceed,
  isProcessing,
  addresses: providedAddresses,
}: AddressSelectionModalProps) => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const { addresses: savedAddresses, isLoading: addressesLoading } = useAddresses();
  const addresses = providedAddresses ?? savedAddresses;
  const loading = providedAddresses ? false : addressesLoading;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-background rounded-t-3xl h-1/2">
          {/* Modal Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-surface">
            <Text className="text-text-primary text-2xl font-bold">عنوان التوصيل</Text>
            <TouchableOpacity onPress={onClose} className="bg-surface border border-line rounded-full p-2">
              <Ionicons name="close" size={24} color={palette.ink} />
            </TouchableOpacity>
          </View>

          {/* ADDRESSES LIST */}
          <ScrollView className="flex-1 p-6">
            {loading ? (
              <View className="py-8">
                <ActivityIndicator size="large" color={palette.primary} />
              </View>
            ) : (
              <View className="gap-4">
                {addresses?.map((address: Address) => (
                  <TouchableOpacity
                    key={address._id}
                    className={`bg-surface rounded-2xl p-5 border-2 ${
                      selectedAddress?._id === address._id ? "border-primary" : "border-line"
                    }`}
                    activeOpacity={0.7}
                    onPress={() => setSelectedAddress(address)}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <View className="flex-row items-center mb-3">
                          <Text className="text-primary font-bold text-lg mr-2">
                            {address.label}
                          </Text>
                          {address.isDefault && (
                            <View className="bg-primary/20 rounded-full px-3 py-1">
                              <Text className="text-primary text-sm font-semibold">افتراضي</Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-text-primary font-semibold text-lg mb-2">
                          {address.fullName}
                        </Text>
                        <Text className="text-text-secondary text-base leading-6 mb-1">
                          {address.streetAddress}
                        </Text>
                        <Text className="text-text-secondary text-base mb-2">
                          {address.city}{address.state ? `، ${address.state}` : ""}
                        </Text>
                        <Text className="text-text-secondary text-base">{address.phoneNumber}</Text>
                      </View>
                      {selectedAddress?._id === address._id && (
                        <View className="bg-primary rounded-full p-2 ml-3">
                          <Ionicons name="checkmark" size={24} color={palette.onPrimary} />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          <View className="p-6 border-t border-line">
            <TouchableOpacity
              className="bg-primary rounded-2xl py-4"
              activeOpacity={0.9}
              onPress={() => {
                if (selectedAddress) onProceed(selectedAddress);
              }}
              disabled={!selectedAddress || isProcessing}
            >
              <View className="flex-row items-center justify-center">
                {isProcessing ? (
                  <ActivityIndicator size="small" color={palette.onPrimary} />
                ) : (
                  <>
                    <Text className="text-ivory font-bold text-lg me-2">متابعة الدفع</Text>
                    <Ionicons name="arrow-back" size={18} color={palette.onPrimary} />
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddressSelectionModal;
