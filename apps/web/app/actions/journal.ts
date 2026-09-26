"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Entry } from "@workspace/domain"
import {
  createEntryForUser,
  deleteEntryForUser,
  listEntriesForUser,
  syncEntriesForUser,
} from "@/lib/journal"

export async function createEntry(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const entry = formData.get("entry")
  if (typeof entry !== "string" || !entry.trim()) {
    throw new Error("Entry cannot be empty")
  }

  await createEntryForUser(userId, { entry: entry.trim() })

  revalidatePath("/entries")
  redirect("/entries")
}

export async function getEntries(): Promise<Entry[]> {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return listEntriesForUser(userId)
}

export async function syncEntries(entries: Entry[]) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  await syncEntriesForUser(userId, { entries })
}

export async function deleteEntry(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")
  if (!id) throw new Error("Cannot delete entry")

  await deleteEntryForUser(userId, id)

  revalidatePath("/entries")
}
