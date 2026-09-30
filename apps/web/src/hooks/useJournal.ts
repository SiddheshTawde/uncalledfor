import { useAuth } from "@clerk/react";
import { useEffect, useState, type SubmitEvent } from "react";
import { fetchEntries, streamEntry } from "../api/entries";
import type { Entry } from "../types/entry";
import { errorMessage } from "../utils/errors";

export function useJournal() {
  const { getToken } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void fetchEntries(getToken)
      .then((data) => {
        if (active) setEntries(data);
      })
      .catch((loadError: unknown) => {
        if (active) setError(errorMessage(loadError));
      });
    return () => { active = false; };
  }, [getToken]);

  async function submitEntry(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isSending) return;

    setIsSending(true);
    setError("");
    setDraft("");

    try {
      await streamEntry(getToken, text, {
        onEntry: (created) => setEntries((current) => [created, ...current]),
        onCommentDelta: (entryId, delta) => setEntries((current) => current.map((entry) =>
          entry.id === entryId
            ? { ...entry, comment: `${entry.comment ?? ""}${delta}` }
            : entry,
        )),
      });
    } catch (submitError) {
      setError(errorMessage(submitError));
    } finally {
      setIsSending(false);
    }
  }

  return { entries, draft, setDraft, isSending, error, submitEntry };
}