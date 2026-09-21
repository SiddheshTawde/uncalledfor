"use server"

import { auth } from "@clerk/nextjs/server"
import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { generateAdvice } from "@/prompt/ai"
import { redirect } from "next/navigation"

export async function createEntry(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const entry = formData.get("entry") as string

  const comment = await generateAdvice(entry)

  await sql`
    INSERT INTO entries (user_id, entry, comment)
    VALUES (${userId}, ${entry}, ${comment})
  `

  revalidatePath("/entries")
  redirect("/entries")
}

export async function getEntries() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  return sql`
    SELECT * FROM entries
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `
}

export async function deleteEntry(id: string) {
  if (!id) throw new Error("Cannot delete entry")

  await sql`
    DELETE FROM entries
    WHERE id = ${id}
  `

  revalidatePath("/entries")
}
