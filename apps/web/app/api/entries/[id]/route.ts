import { auth } from "@clerk/nextjs/server"
import { deleteEntryForUser } from "@/lib/journal"

export const runtime = "nodejs"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await context.params
  if (!id) return Response.json({ error: "Missing entry id" }, { status: 400 })

  const deleted = await deleteEntryForUser(userId, id)
  if (!deleted) return Response.json({ error: "Entry not found" }, { status: 404 })

  return new Response(null, { status: 204 })
}
