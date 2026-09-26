import { auth } from "@clerk/nextjs/server"
import type { CreateEntryInput, SyncEntriesInput } from "@workspace/domain"
import {
  createEntryForUser,
  listEntriesForUser,
  syncEntriesForUser,
} from "@/lib/journal"

export const runtime = "nodejs"

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

async function requireUser() {
  const { userId } = await auth()
  return userId
}

export async function GET() {
  const userId = await requireUser()
  if (!userId) return errorResponse("Unauthorized", 401)

  return Response.json(await listEntriesForUser(userId))
}

export async function POST(request: Request) {
  const userId = await requireUser()
  if (!userId) return errorResponse("Unauthorized", 401)

  const body = (await request.json()) as Partial<CreateEntryInput>
  const entry = typeof body.entry === "string" ? body.entry.trim() : ""
  if (!entry || entry.length > 10000) {
    return errorResponse("Entry must be between 1 and 10000 characters", 400)
  }

  const created = await createEntryForUser(userId, { entry })
  return Response.json(created, { status: 201 })
}

export async function PUT(request: Request) {
  const userId = await requireUser()
  if (!userId) return errorResponse("Unauthorized", 401)

  const body = (await request.json()) as Partial<SyncEntriesInput>
  if (!Array.isArray(body.entries) || body.entries.length > 100) {
    return errorResponse("Invalid entries payload", 400)
  }

  const validEntries = body.entries.every(
    (entry) =>
      entry &&
      typeof entry.id === "string" &&
      typeof entry.entry === "string" &&
      (typeof entry.comment === "string" || entry.comment === null) &&
      typeof entry.created_at === "string" &&
      !Number.isNaN(Date.parse(entry.created_at))
  )

  if (!validEntries) return errorResponse("Invalid entries payload", 400)

  await syncEntriesForUser(userId, {
    entries: body.entries.map((entry) => ({
      id: entry.id!,
      entry: entry.entry!,
      comment: entry.comment!,
      created_at: entry.created_at!,
    })),
  })

  return new Response(null, { status: 204 })
}
