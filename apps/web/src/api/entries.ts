import type { Entry } from "../types/entry";

const entriesUrl = `${import.meta.env.VITE_API_URL ?? "/api/v1"}/entries/`;

type TokenProvider = () => Promise<string | null>;

type StreamHandlers = {
  onEntry: (entry: Entry) => void;
  onCommentDelta: (entryId: string, delta: string) => void;
};

export async function fetchEntries(getToken: TokenProvider): Promise<Entry[]> {
  const token = await getToken();
  const response = await fetch(entriesUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Could not load your entries.");
  return response.json() as Promise<Entry[]>;
}

export async function streamEntry(
  getToken: TokenProvider,
  text: string,
  handlers: StreamHandlers,
) {
  const token = await getToken();
  const response = await fetch(entriesUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ entry: text }),
  });
  if (!response.ok) throw new Error("Your entry could not be saved.");
  if (!response.body) throw new Error("Streaming is not available in this browser.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let entryId = "";
  let finished = false;

  while (!finished) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const events = buffer.split(/\r?\n\r?\n/);
    buffer = events.pop() ?? "";

    for (const rawEvent of events) {
      const eventName = rawEvent.match(/^event: (.+)$/m)?.[1];
      const data = rawEvent.match(/^data: (.+)$/m)?.[1];
      if (!data) continue;
      if (eventName === "entry") {
        const created: Entry = JSON.parse(data);
        entryId = created.id;
        handlers.onEntry(created);
      } else if (eventName === "error") {
        const detail: { message: string } = JSON.parse(data);
        throw new Error(detail.message);
      } else if (data === "[DONE]") {
        finished = true;
      } else {
        const delta: { delta: string } = JSON.parse(data);
        handlers.onCommentDelta(entryId, delta.delta);
      }
    }

    if (done) finished = true;
  }
}