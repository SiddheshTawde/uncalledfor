import { useAuth } from "@clerk/clerk-expo"
import { Redirect } from "expo-router"
import { ActivityIndicator, StyleSheet, Text, View } from "react-native"
import { SignInForm } from "@/components/sign-in-form"

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    )
  }

  if (isSignedIn) return <Redirect href="/journal" />
  return <SignInForm />
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
})
