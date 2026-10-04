import { palette } from "@/theme/palette";
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import "../global.css";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Sentry from "@sentry/react-native";
import { StripeProvider } from "@/lib/payments";
import { AuthRoot } from "@/lib/session";
import { GuestCartProvider } from "@/lib/guest-cart";
import { AppToastProvider } from "@/lib/toast";
import { applyCairo } from "@/lib/typography";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import AppIntro from "@/components/AppIntro";
import { I18nManager, Platform } from "react-native";

applyCairo();

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

if (Platform.OS === "web" && typeof document !== "undefined") {
  document.documentElement.setAttribute("dir", "rtl");
  document.documentElement.lang = "ar";
}

SplashScreen.preventAutoHideAsync().catch(() => {});

Sentry.init({
  dsn: "https://fb6731b90610cc08333e6c16ffac5724@o4509813037137920.ingest.de.sentry.io/4510451611205712",
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],
});

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any, query) => {
      Sentry.captureException(error, {
        tags: {
          type: "react-query-error",
          queryKey: query.queryKey[0]?.toString() || "unknon",
        },
        extra: {
          errorMessage: error.message,
          statusCode: error.response?.status,
          queryKey: query.queryKey,
        },
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      Sentry.captureException(error, {
        tags: { type: "react-query-mutation-error" },
        extra: {
          errorMessage: error.message,
          statusCode: error.response?.status,
        },
      });
    },
  }),
});

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.primary,
    background: palette.background,
    card: palette.surface,
    text: palette.ink,
    border: palette.line,
    notification: palette.discount,
  },
};

function RootLayout() {
  const [loaded, error] = useFonts({
    Cairo: require("../assets/fonts/Cairo-Variable.ttf"),
  });
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <AuthRoot>
      <QueryClientProvider client={queryClient}>
        <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""}>
          <GuestCartProvider>
            <AppToastProvider>
            <StatusBar style="dark" />
            <ThemeProvider value={navigationTheme}>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: "slide_from_left",
                  contentStyle: { backgroundColor: palette.background },
                }}
              />
            </ThemeProvider>
            {showIntro && <AppIntro onFinish={() => setShowIntro(false)} />}
            </AppToastProvider>
          </GuestCartProvider>
        </StripeProvider>
      </QueryClientProvider>
    </AuthRoot>
  );
}

export default Sentry.wrap(RootLayout);
