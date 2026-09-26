import { useSignIn } from "@clerk/clerk-expo"
import { useState } from "react"
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"

export function SignInForm() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function submit() {
    if (!isLoaded || submitting) return
    setSubmitting(true)
    setError(null)

    try {
      const result = await signIn.create({ identifier: email, password })
      if (result.status !== "complete" || !result.createdSessionId) {
        setError("Additional verification is required for this account.")
        return
      }
      await setActive({ session: result.createdSessionId })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>UNCALLED FOR</Text>
        <Text style={styles.title}>Write it down.</Text>
        <Text style={styles.subtitle}>Get the advice you did not ask for.</Text>
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Email"
          style={styles.input}
          value={email}
        />
        <TextInput
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <Pressable disabled={submitting} onPress={submit} style={styles.button}>
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f1e8" },
  container: { flex: 1, justifyContent: "center", gap: 14, padding: 24 },
  eyebrow: { color: "#8c4a32", fontSize: 12, fontWeight: "700", letterSpacing: 2 },
  title: { color: "#1d2925", fontSize: 38, fontWeight: "700" },
  subtitle: { color: "#5e6a64", fontSize: 16, marginBottom: 18 },
  input: { backgroundColor: "#fffdf8", borderColor: "#d8d1c4", borderRadius: 8, borderWidth: 1, padding: 14 },
  error: { color: "#a33c32", fontSize: 13 },
  button: { alignItems: "center", backgroundColor: "#1d2925", borderRadius: 8, padding: 15 },
  buttonText: { color: "#fffdf8", fontSize: 16, fontWeight: "700" },
})
