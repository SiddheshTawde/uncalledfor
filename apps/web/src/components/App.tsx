import { ClerkProvider, useAuth } from "@clerk/react";
import { Journal } from "./Journal";
import { SetupScreen } from "./SetupScreen";
import { SignInScreen } from "./SignInScreen";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <main className="setup-screen" aria-busy="true" />;
  return isSignedIn ? <Journal /> : <SignInScreen />;
}

export function App() {
  if (!publishableKey) return <SetupScreen />;

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <AuthGate />
    </ClerkProvider>
  );
}