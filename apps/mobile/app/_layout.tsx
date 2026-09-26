import { ClerkProvider } from "@clerk/clerk-expo"
import { tokenCache } from "@clerk/clerk-expo/token-cache"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Text } from "react-native"
import { JournalProvider } from "@/providers/journal-provider"

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

export default function RootLayout() {
  if (!publishableKey) {
    return <Text>Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY</Text>
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <JournalProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </JournalProvider>
    </ClerkProvider>
  )
}
