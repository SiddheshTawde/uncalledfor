export type Entry = {
  id: string
  user_id: string
  entry: string
  comment: string | null
  created_at: string
}

export type CreateEntryInput = {
  entry: string
}

export type SyncEntriesInput = {
  entries: Array<Pick<Entry, "id" | "entry" | "comment" | "created_at">>
}
