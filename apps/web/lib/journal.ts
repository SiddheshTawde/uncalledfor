import type {
  CreateEntryInput,
  Entry,
  SyncEntriesInput,
} from "@workspace/domain"
import { sql } from "@/lib/db"
import { generateAdvice } from "@/prompt/ai"

function toEntry(row: Record<string, unknown>): Entry {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    entry: String(row.entry),
    comment: row.comment == null ? null : String(row.comment),
    created_at: new Date(String(row.created_at)).toISOString(),
  }
}

export async function listEntriesForUser(userId: string): Promise<Entry[]> {
  const rows = await sql`
    SELECT * FROM entries
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `

  return rows.map((row) => toEntry(row))
}

export async function createEntryForUser(
  userId: string,
  input: CreateEntryInput
): Promise<Entry> {
  const comment = await generateAdvice(input.entry)
  const rows = await sql`
    INSERT INTO entries (user_id, entry, comment)
    VALUES (${userId}, ${input.entry}, ${comment})
    RETURNING *
  `

  const created = rows[0]
  if (!created) throw new Error("Failed to create entry")

  return toEntry(created)
}

export async function syncEntriesForUser(
  userId: string,
  input: SyncEntriesInput
): Promise<void> {
  for (const entry of input.entries) {
    await sql`
      INSERT INTO entries (id, user_id, entry, comment, created_at)
      VALUES (${entry.id}, ${userId}, ${entry.entry}, ${entry.comment}, ${entry.created_at})
      ON CONFLICT (id) DO UPDATE SET
        entry = EXCLUDED.entry,
        comment = EXCLUDED.comment,
        created_at = EXCLUDED.created_at
      WHERE entries.user_id = ${userId}
    `
  }
}

export async function deleteEntryForUser(
  userId: string,
  id: string
): Promise<boolean> {
  const rows = await sql`
    DELETE FROM entries
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING id
  `

  return rows.length > 0
}
