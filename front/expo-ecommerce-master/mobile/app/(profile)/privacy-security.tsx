import { palette } from "@/theme/palette";
import SafeScreen from "@/components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";

type SecurityOption = {
  id: string;
  icon: string;
  title: string;
  description: string;
  type: "navigation" | "toggle";
  value?: boolean;
};

function PrivacyAndSecurityScreen() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [shareData, setShareData] = useState(false);

  const securitySettings: SecurityOption[] = [
    {
      id: "password",
      icon: "lock-closed-outline",
      title: "كلمة المرور",
      description: "تحديث كلمة مرور الحساب",
      type: "navigation",
    },
    {
      id: "two-factor",
      icon: "shield-checkmark-outline",
      title: "التحقق بخطوتين",
      description: "طبقة حماية إضافية للحساب",
      type: "toggle",
      value: twoFactorEnabled,
    },
    {
      id: "biometric",
      icon: "finger-print-outline",
      title: "الدخول بالبصمة",
      description: "استخدام بصمة الوجه أو الإصبع",
      type: "toggle",
      value: biometricEnabled,
    },
  ];

  const privacySettings: SecurityOption[] = [
    {
      id: "push",
      icon: "notifications-outline",
      title: "إشعارات التطبيق",
      description: "تنبيهات الطلبات والعروض",
      type: "toggle",
      value: pushNotifications,
    },
    {
      id: "email",
      icon: "mail-outline",
      title: "البريد",
      description: "تحديثات الطلب عبر البريد",
      type: "toggle",
      value: emailNotifications,
    },
    {
      id: "marketing",
      icon: "megaphone-outline",
      title: "رسائل العروض",
      description: "استلام حملات المول",
      type: "toggle",
      value: marketingEmails,
    },
    {
      id: "data",
      icon: "analytics-outline",
      title: "مشاركة الاستخدام",
      description: "المساعدة في تحسين التطبيق",
      type: "toggle",
      value: shareData,
    },
  ];

  const accountSettings = [
    {
      id: "activity",
      icon: "time-outline",
      title: "نشاط الحساب",
      description: "آخر عمليات الدخول",
    },
    {
      id: "devices",
      icon: "phone-portrait-outline",
      title: "الأجهزة",
      description: "الأجهزة المرتبطة بالحساب",
    },
    {
      id: "data-download",
      icon: "download-outline",
      title: "بياناتك",
      description: "طلب نسخة من بياناتك",
    },
  ];

  const handleToggle = (id: string, value: boolean) => {
    switch (id) {
      case "two-factor":
        setTwoFactorEnabled(value);
        break;
      case "biometric":
        setBiometricEnabled(value);
        break;
      case "push":
        setPushNotifications(value);
        break;
      case "email":
        setEmailNotifications(value);
        break;
      case "marketing":
        setMarketingEmails(value);
        break;
      case "data":
        setShareData(value);
        break;
    }
  };

  return (
    <SafeScreen>
      {/* HEADER */}
      <View className="px-4 pb-5 border-b border-line flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center"
          accessibilityLabel="رجوع"
        >
          <Ionicons name="arrow-forward" size={24} color={palette.ink} />
        </TouchableOpacity>
        <Text className="text-text-primary text-2xl font-bold ms-1">الخصوصية</Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* SECURITY SETTING */}
        <View className="px-6 pt-6">
          <Text className="text-text-primary text-lg font-bold mb-4">الحماية</Text>

          {securitySettings.map((setting) => (
            <TouchableOpacity
              key={setting.id}
              className="bg-surface border border-line rounded-2xl p-4 mb-3"
              activeOpacity={setting.type === "toggle" ? 1 : 0.7}
            >
              <View className="flex-row items-center">
                <View className="bg-primary/20 rounded-full w-12 h-12 items-center justify-center mr-4">
                  <Ionicons name={setting.icon as any} size={24} color={palette.ink} />
                </View>

                <View className="flex-1">
                  <Text className="text-text-primary font-bold text-base mb-1">
                    {setting.title}
                  </Text>
                  <Text className="text-text-secondary text-sm">{setting.description}</Text>
                </View>

                {setting.type === "toggle" ? (
                  <Switch
                    value={setting.value}
                    onValueChange={(value) => handleToggle(setting.id, value)}
                    thumbColor={palette.surface}
                    trackColor={{ false: palette.line, true: palette.primary }}

                    // ios_backgroundColor={"purple"}
                  />
                ) : (
                  <Ionicons name="chevron-back" size={20} color={palette.slate} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Privacy Section */}
        <View className="px-6 pt-4">
          <Text className="text-text-primary text-lg font-bold mb-4">الخصوصية</Text>

          {privacySettings.map((setting) => (
            <View key={setting.id}>
              <View className="bg-surface border border-line rounded-2xl p-4 mb-3">
                <View className="flex-row items-center">
                  <View className="bg-primary/20 rounded-full w-12 h-12 items-center justify-center mr-4">
                    <Ionicons name={setting.icon as any} size={24} color={palette.ink} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-primary font-bold text-base mb-1">
                      {setting.title}
                    </Text>
                    <Text className="text-text-secondary text-sm">{setting.description}</Text>
                  </View>
                  <Switch
                    value={setting.value}
                    onValueChange={(value) => handleToggle(setting.id, value)}
                    trackColor={{ false: palette.line, true: palette.primary }}
                    thumbColor={palette.surface}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ACCOUNT SECTION */}
        <View className="px-6 pt-4">
          <Text className="text-text-primary text-lg font-bold mb-4">الحساب</Text>

          {accountSettings.map((setting) => (
            <TouchableOpacity
              key={setting.id}
              className="bg-surface border border-line rounded-2xl p-4 mb-3"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <View className="bg-primary/20 rounded-full w-12 h-12 items-center justify-center mr-4">
                  <Ionicons name={setting.icon as any} size={24} color={palette.ink} />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-bold text-base mb-1">
                    {setting.title}
                  </Text>
                  <Text className="text-text-secondary text-sm">{setting.description}</Text>
                </View>
                <Ionicons name="chevron-back" size={20} color={palette.slate} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* DELETE ACC BTN */}
        <View className="px-6 pt-4">
          <TouchableOpacity
            className="bg-surface rounded-2xl p-5 flex-row items-center justify-between border border-accent/30"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="bg-accent/10 rounded-full w-12 h-12 items-center justify-center me-4">
                <Ionicons name="trash-outline" size={24} color={palette.discount} />
              </View>
              <View>
                <Text className="text-accent font-bold text-base mb-1">حذف الحساب</Text>
                <Text className="text-text-secondary text-sm">حذف الحساب بشكل نهائي</Text>
              </View>
            </View>
            <Ionicons name="chevron-back" size={20} color={palette.discount} />
          </TouchableOpacity>
        </View>

        {/* INFO ALERT */}
        <View className="px-6 pt-6 pb-4">
          <View className="bg-primary/10 rounded-2xl p-4 flex-row">
            <Ionicons name="information-circle-outline" size={24} color={palette.ink} />
            <Text className="text-text-secondary text-sm ml-3 flex-1">
              بياناتك تُستخدم لإتمام الطلبات فقط، ويمكنك تعديل هذه الإعدادات في أي وقت.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

export default PrivacyAndSecurityScreen;
