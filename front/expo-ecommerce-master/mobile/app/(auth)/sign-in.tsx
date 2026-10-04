import { palette } from "@/theme/palette";
import useSocialAuth from "@/hooks/useSocialAuth";
import { clerkPublishableKey } from "@/lib/session";
import { Ionicons } from "@expo/vector-icons";
import { Image, ImageContentFit, ImageContentPosition } from "expo-image";
import { router } from "expo-router";
import { ReactNode, useMemo } from "react";
import {
  View,
  Text,
  Image as RNImage,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SafeScreen from "@/components/SafeScreen";

const HERO_ASSET = require("../../assets/images/mall-marketing-hero.jpg");

/** Actual mall-marketing-hero.jpg dimensions (portrait). */
const HERO_IMAGE_WIDTH = 767;
const HERO_IMAGE_HEIGHT = 1024;

const AuthScreen = () => {
  if (!clerkPublishableKey) {
    return <Marketing />;
  }

  return <Marketing account={<AccountEntry />} />;
};

function Marketing({ account }: { account?: ReactNode }) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const hasAccountEntry = Boolean(account);

  const { heroHeight, imageFit, imagePosition } = useMemo(() => {
    const footerBlock = 76 + Math.max(insets.bottom, 16) + (hasAccountEntry ? 68 : 0);
    const middleBlock = 112;
    const maxHero = screenHeight - insets.top - footerBlock - middleBlock;

    const fullWidthHeight = (screenWidth / HERO_IMAGE_WIDTH) * HERO_IMAGE_HEIGHT;
    const height = Math.round(Math.min(Math.max(0, maxHero), fullWidthHeight));
    const fitsWithoutCrop = height >= fullWidthHeight - 1;

    return {
      heroHeight: height,
      imageFit: (fitsWithoutCrop ? "contain" : "cover") as ImageContentFit,
      imagePosition: (fitsWithoutCrop ? "center" : "top") as ImageContentPosition,
    };
  }, [screenWidth, screenHeight, insets.top, insets.bottom, hasAccountEntry]);

  return (
    <SafeScreen>
      <View className="flex-1">
        <View
          style={{ height: heroHeight }}
          className="bg-background overflow-hidden rounded-b-[32px]"
        >
          <Image
            source={HERO_ASSET}
            style={{ width: "100%", height: "100%" }}
            contentFit={imageFit}
            contentPosition={imagePosition}
            accessibilityLabel="مول وملحمة البايض"
          />
        </View>

        <View className="px-5 pt-3 pb-2 shrink-0 flex-1 justify-center min-h-0">
          <View className="bg-surface border border-line rounded-2xl px-4 py-3.5">
            <View className="flex-row gap-2">
              <CompactValue accent="lime" title="حملات المول" body="عروض الأقسام فور توفرها." />
              <View className="w-px bg-line" />
              <CompactValue accent="primary" title="التوصيل" body="طلب كضيف بعنوانك." />
            </View>
          </View>
          <Text className="text-text-secondary text-xs text-center leading-5 mt-2.5 px-1" numberOfLines={2}>
            تصفّح العروض، أضف إلى السلة، وأتمم الطلب كضيف.
          </Text>
        </View>
      </View>

      <View
        className="px-5 pt-3 border-t border-line bg-background shrink-0"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <TouchableOpacity
          className="bg-primary rounded-2xl py-3.5 flex-row items-center justify-center"
          onPress={() => router.replace("/(tabs)")}
          accessibilityRole="button"
          accessibilityLabel="ادخل المول"
        >
          <Text className="text-ivory font-bold text-base">ادخل المول</Text>
          <Ionicons name="arrow-back" size={18} color={palette.onPrimary} style={{ marginStart: 8 }} />
        </TouchableOpacity>
        {account}
      </View>
    </SafeScreen>
  );
}

function CompactValue({
  accent,
  title,
  body,
}: {
  accent: "lime" | "primary";
  title: string;
  body: string;
}) {
  const barColor = accent === "lime" ? palette.lime : palette.primary;

  return (
    <View className="flex-1 flex-row items-start">
      <View className="w-1 rounded-full me-2.5 mt-0.5" style={{ height: 32, backgroundColor: barColor }} />
      <View className="flex-1 min-w-0">
        <Text className="text-text-primary text-sm font-bold" numberOfLines={1}>
          {title}
        </Text>
        <Text className="text-text-secondary text-xs leading-5 mt-0.5" numberOfLines={2}>
          {body}
        </Text>
      </View>
    </View>
  );
}

function AccountEntry() {
  const { loadingStrategy, handleSocialAuth } = useSocialAuth();

  return (
    <View className="mt-3">
      <Text className="text-text-secondary text-[11px] text-center mb-2">لحفظ الطلبات والعناوين</Text>
      <View className="flex-row gap-2">
        <SocialButton
          label="Google"
          icon={require("../../assets/images/google.png")}
          loading={loadingStrategy === "oauth_google"}
          disabled={loadingStrategy !== null}
          onPress={() => handleSocialAuth("oauth_google")}
        />
        <SocialButton
          label="Apple"
          icon={require("../../assets/images/apple.png")}
          loading={loadingStrategy === "oauth_apple"}
          disabled={loadingStrategy !== null}
          onPress={() => handleSocialAuth("oauth_apple")}
        />
      </View>
    </View>
  );
}

function SocialButton({
  label,
  icon,
  loading,
  disabled,
  onPress,
}: {
  label: string;
  icon: number;
  loading: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className="flex-1 flex-row items-center justify-center bg-surface border border-line rounded-xl py-2.5"
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`المتابعة مع ${label}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={palette.primary} />
      ) : (
        <>
          <RNImage source={icon} className="size-4 me-1.5" resizeMode="contain" />
          <Text className="text-text-primary text-xs font-bold">{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

export default AuthScreen;
