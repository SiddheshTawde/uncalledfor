import { useAuth, useClerk } from "@clerk/clerk-expo"
import { Redirect, router } from "expo-router"
import { useState } from "react"
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { formatDate, formatTime } from "@workspace/date"
import { useJournal, useJournalApi } from "@/providers/journal-provider"

export default function EntriesScreen() {
  const { isLoaded, isSignedIn } = useAuth()
  const { signOut } = useClerk()
  const api = useJournalApi()
  const entries = useJournal((state) => state.entries)
  const setEntries = useJournal((state) => state.setEntries)
  const [expanded, setExpanded] = useState<string | null>(null)

  if (!isLoaded) return null
  if (!isSignedIn) return <Redirect href="/" />

  function removeEntry(id: string) {
    Alert.alert("Delete entry?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.deleteEntry(id)
            setEntries(entries.filter((entry) => entry.id !== id))
          } catch (error) {
            Alert.alert("Unable to delete", error instanceof Error ? error.message : "Please try again")
          }
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><Text style={styles.link}>Write</Text></Pressable>
        <Text style={styles.title}>Entries</Text>
        <Pressable onPress={() => signOut()}><Text style={styles.link}>Sign out</Text></Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {entries.length === 0 ? (
          <Text style={styles.empty}>Nothing here yet. Go write something.</Text>
        ) : entries.map((entry) => {
          const isExpanded = expanded === entry.id
          return (
            <View key={entry.id} style={styles.entry}>
              <View style={styles.meta}>
                <Text style={styles.date}>{formatDate(entry.created_at)} at {formatTime(entry.created_at)}</Text>
                <Pressable onPress={() => removeEntry(entry.id)}><Text style={styles.delete}>Delete</Text></Pressable>
              </View>
              <Text style={styles.entryText}>{entry.entry}</Text>
              {entry.comment && (
                <Pressable onPress={() => setExpanded(isExpanded ? null : entry.id)} style={styles.comment}>
                  <Text style={styles.commentLabel}>{isExpanded ? "Advice" : "Advice · tap to expand"}</Text>
                  <Text numberOfLines={isExpanded ? undefined : 1} style={styles.commentText}>{entry.comment}</Text>
                </Pressable>
              )}
            </View>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#f5f1e8", flex: 1 },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", padding: 24, paddingBottom: 12 },
  title: { color: "#1d2925", fontSize: 24, fontWeight: "700" },
  link: { color: "#8c4a32", fontWeight: "700" },
  content: { gap: 24, padding: 24, paddingTop: 12 },
  empty: { color: "#5e6a64", fontSize: 16, paddingTop: 48, textAlign: "center" },
  entry: { gap: 10 },
  meta: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  date: { color: "#6f7973", fontSize: 12 },
  delete: { color: "#a33c32", fontSize: 12, fontWeight: "700" },
  entryText: { color: "#1d2925", fontSize: 17, lineHeight: 25 },
  comment: { alignSelf: "flex-end", backgroundColor: "#e8dfd0", borderLeftColor: "#8c4a32", borderLeftWidth: 4, gap: 4, maxWidth: "88%", padding: 10 },
  commentLabel: { color: "#8c4a32", fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  commentText: { color: "#39453f", fontSize: 14, lineHeight: 20 },
})
