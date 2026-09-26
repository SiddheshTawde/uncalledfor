import type {
  CreateEntryInput,
  Entry,
  SyncEntriesInput,
} from "@workspace/domain"

export type ApiClientOptions = {
  baseUrl: string
  getToken: () => Promise<string | null>
  fetch?: typeof fetch
}

export function createApiClient({
  baseUrl,
  getToken,
  fetch: fetchImpl = fetch,
}: ApiClientOptions) {
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = await getToken()
    const response = await fetchImpl(`${baseUrl.replace(/\/$/, "")}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    })

    if (!response.ok) {
      const body = await response.json().catch(() => null)
      throw new Error(body?.error ?? `Request failed with ${response.status}`)
    }

    if (response.status === 204) return undefined as T
    return response.json() as Promise<T>
  }

  return {
    getEntries: () => request<Entry[]>("/api/entries"),
    createEntry: (input: CreateEntryInput) =>
      request<Entry>("/api/entries", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    syncEntries: (input: SyncEntriesInput) =>
      request<void>("/api/entries", {
        method: "PUT",
        body: JSON.stringify(input),
      }),
    deleteEntry: (id: string) =>
      request<void>(`/api/entries/${encodeURIComponent(id)}`, {
        method: "DELETE",
      }),
  }
}

export type ApiClient = ReturnType<typeof createApiClient>
