import { Redirect, Stack } from "expo-router";
import { useSession } from "@/lib/session";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useSession();

  if (!isLoaded) return null;

  if (isSignedIn) {
    return <Redirect href={"/(tabs)"} />;
  }

  return <Stack screenOptions={{ headerShown: false, animation: "slide_from_left" }} />;
}
