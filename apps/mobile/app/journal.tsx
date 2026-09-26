import { useAuth } from "@clerk/clerk-expo"
import { Redirect, router } from "expo-router"
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
import { useJournal, useJournalApi } from "@/providers/journal-provider"

export default function JournalScreen() {
  const { isLoaded, isSignedIn } = useAuth()
  const api = useJournalApi()
  const entries = useJournal((state) => state.entries)
  const setEntries = useJournal((state) => state.setEntries)
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isLoaded) return <ActivityIndicator style={styles.center} />
  if (!isSignedIn) return <Redirect href="/" />

  async function submit() {
    if (!text.trim() || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const created = await api.createEntry({ entry: text.trim() })
      setEntries([created, ...entries])
      setText("")
      router.push("/entries")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to submit entry")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>TODAY</Text>
            <Text style={styles.title}>What happened?</Text>
          </View>
          <Pressable onPress={() => router.push("/entries")}>
            <Text style={styles.link}>Entries ({entries.length})</Text>
          </Pressable>
        </View>
        <TextInput
          multiline
          onChangeText={setText}
          placeholder="The honest version..."
          placeholderTextColor="#8b948e"
          style={styles.editor}
          textAlignVertical="top"
          value={text}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <Pressable disabled={submitting || !text.trim()} onPress={submit} style={[styles.button, (!text.trim() || submitting) && styles.disabled]}>
          {submitting ? <ActivityIndicator color="#fffdf8" /> : <Text style={styles.buttonText}>Submit for judgment</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f1e8" },
  container: { flex: 1, gap: 16, padding: 24 },
  center: { flex: 1 },
  header: { alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between" },
  eyebrow: { color: "#8c4a32", fontSize: 12, fontWeight: "700", letterSpacing: 2 },
  title: { color: "#1d2925", fontSize: 30, fontWeight: "700", marginTop: 4 },
  link: { color: "#8c4a32", fontWeight: "700", paddingBottom: 3 },
  editor: { backgroundColor: "#fffdf8", borderColor: "#d8d1c4", borderRadius: 8, borderWidth: 1, flex: 1, fontSize: 18, lineHeight: 28, padding: 16 },
  error: { color: "#a33c32", fontSize: 13 },
  button: { alignItems: "center", backgroundColor: "#1d2925", borderRadius: 8, padding: 16 },
  disabled: { opacity: 0.45 },
  buttonText: { color: "#fffdf8", fontSize: 16, fontWeight: "700" },
})
