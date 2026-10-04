import { useAuth, useUser } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ClerkProvider } from "@clerk/clerk-expo";
import { createContext, useContext, useMemo } from "react";

export const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

type SessionUser = {
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string;
  email?: string;
};

type SessionValue = {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: SessionUser | null;
  getToken: () => Promise<string | null>;
  signOut: () => Promise<void>;
};

const guestSession: SessionValue = {
  isLoaded: true,
  isSignedIn: false,
  user: null,
  getToken: async () => null,
  signOut: async () => {},
};

const SessionContext = createContext<SessionValue>(guestSession);

export function useSession() {
  return useContext(SessionContext);
}

function ClerkSessionBridge({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken, signOut } = useAuth();
  const { user } = useUser();

  const value = useMemo<SessionValue>(
    () => ({
      isLoaded: !!isLoaded,
      isSignedIn: !!isSignedIn,
      getToken: async () => (await getToken()) ?? null,
      signOut: async () => {
        await signOut();
      },
      user: user
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            email: user.emailAddresses?.[0]?.emailAddress,
          }
        : null,
    }),
    [getToken, isLoaded, isSignedIn, signOut, user]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function AuthRoot({ children }: { children: React.ReactNode }) {
  if (!clerkPublishableKey) {
    return <SessionContext.Provider value={guestSession}>{children}</SessionContext.Provider>;
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
      <ClerkSessionBridge>{children}</ClerkSessionBridge>
    </ClerkProvider>
  );
}
