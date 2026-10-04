import { palette } from "@/theme/palette";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { DEFAULT_CITY } from "@/lib/address";
import SafeScreen from "./SafeScreen";
import { Ionicons } from "@expo/vector-icons";

interface AddressFormData {
  label: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
}

interface AddressFormModalProps {
  visible: boolean;
  isEditing: boolean;
  addressForm: AddressFormData;
  isAddingAddress: boolean;
  isUpdatingAddress: boolean;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (form: AddressFormData) => void;
}

const AddressFormModal = ({
  addressForm,
  isAddingAddress,
  isEditing,
  isUpdatingAddress,
  onClose,
  onFormChange,
  onSave,
  visible,
}: AddressFormModalProps) => {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <SafeScreen>
          {/* HEADER */}
          <View className="px-6 py-5 border-b border-line flex-row items-center justify-between">
            <Text className="text-text-primary text-2xl font-bold">
              {isEditing ? "تعديل العنوان" : "عنوان جديد"}
            </Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="إغلاق">
              <Ionicons name="close" size={28} color={palette.ink} />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="p-6">
              {/* LABEL INPUT */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">الاسم المختصر</Text>
                <TextInput
                  className="bg-surface border border-line text-text-primary p-4 rounded-2xl text-base"
                  placeholder="المنزل، العمل"
                  placeholderTextColor={palette.slate}
                  value={addressForm.label}
                  onChangeText={(text) => onFormChange({ ...addressForm, label: text })}
                />
              </View>

              {/* NAME INPUT */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">الاسم الكامل</Text>
                <TextInput
                  className="bg-surface border border-line text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="الاسم كما سيظهر على الطلب"
                  placeholderTextColor={palette.slate}
                  value={addressForm.fullName}
                  onChangeText={(text) => onFormChange({ ...addressForm, fullName: text })}
                />
              </View>

              {/* Address Input */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">الشارع</Text>
                <TextInput
                  className="bg-surface border border-line text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="الشارع، رقم المبنى"
                  placeholderTextColor={palette.slate}
                  value={addressForm.streetAddress}
                  onChangeText={(text) => onFormChange({ ...addressForm, streetAddress: text })}
                  multiline
                />
              </View>

              {/* City Input */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">المدينة</Text>
                <TextInput
                  className="bg-surface border border-line text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder={DEFAULT_CITY}
                  placeholderTextColor={palette.slate}
                  value={addressForm.city}
                  onChangeText={(text) => onFormChange({ ...addressForm, city: text })}
                />
              </View>

              {/* State Input */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">المنطقة</Text>
                <TextInput
                  className="bg-surface border border-line text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="المنطقة"
                  placeholderTextColor={palette.slate}
                  value={addressForm.state}
                  onChangeText={(text) => onFormChange({ ...addressForm, state: text })}
                />
              </View>

              {/* Phone Input */}
              <View className="mb-5">
                <Text className="text-text-primary font-semibold mb-2">رقم الهاتف</Text>
                <TextInput
                  className="bg-surface border border-line text-text-primary px-4 py-4 rounded-2xl text-base"
                  placeholder="0599000000"
                  placeholderTextColor={palette.slate}
                  value={addressForm.phoneNumber}
                  onChangeText={(text) => onFormChange({ ...addressForm, phoneNumber: text })}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Default Address Toggle */}
              <View className="bg-surface rounded-2xl p-4 flex-row items-center justify-between mb-6">
                <Text className="text-text-primary font-semibold">اجعله العنوان الافتراضي</Text>
                <Switch
                  value={addressForm.isDefault}
                  onValueChange={(value) => onFormChange({ ...addressForm, isDefault: value })}
                  thumbColor="white"
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                className="bg-primary rounded-2xl py-5 items-center"
                activeOpacity={0.8}
                onPress={onSave}
                disabled={isAddingAddress || isUpdatingAddress}
              >
                {isAddingAddress || isUpdatingAddress ? (
                  <ActivityIndicator size="small" color={palette.onPrimary} />
                ) : (
                  <Text className="text-ivory font-bold text-lg">
                    {isEditing ? "حفظ التعديل" : "حفظ العنوان"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeScreen>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddressFormModal;
