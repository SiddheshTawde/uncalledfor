import { createRoot } from "react-dom/client";
import { useEffect, useState, type FormEvent } from "react";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/react";
import "./style.css";

type Entry = {
  id: string;
  entry: string;
  comment: string | null;
  created_at: string | null;
};

const apiUrl = import.meta.env.VITE_API_URL ?? "/api/v1";
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  if (!publishableKey) {
    return (
      <main className="setup-screen">
        <p className="eyebrow">UNCALLED FOR</p>
        <h1>One honest thought at a time.</h1>
        <p className="setup-copy">
          Add <code>VITE_CLERK_PUBLISHABLE_KEY</code> to the web app environment
          to enable your private journal.
        </p>
      </main>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <AuthGate />
    </ClerkProvider>
  );
}

function AuthGate() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <main className="setup-screen" aria-busy="true" />;
  return isSignedIn ? <Journal /> : <SignInScreen />;
}

function SignInScreen() {
  return (
    <main className="auth-screen">
      <header className="topbar">
        <a className="wordmark" href="/">uncalled for<span>.</span></a>
        <span className="private-label">A PRIVATE JOURNAL</span>
      </header>
      <section className="welcome">
        <p className="eyebrow">YOUR THOUGHTS, WITHOUT THE PERFORMANCE</p>
        <h1>Say the thing<br />you almost didn’t.</h1>
        <p className="welcome-copy">
          Leave a thought here. Get a thoughtful response, not a verdict.
        </p>
        <div className="auth-actions">
          <SignUpButton mode="modal">
            <button className="primary-button" type="button">Start writing <span aria-hidden="true">↗</span></button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="text-button" type="button">I have an account</button>
          </SignInButton>
        </div>
      </section>
      <div className="page-mark" aria-hidden="true">01 / 01</div>
    </main>
  );
}

function Journal() {
  const { getToken } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${apiUrl}/entries/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Could not load your entries.");
        const data: Entry[] = await response.json();
        if (active) setEntries(data);
      } catch (loadError) {
        if (active) setError(errorMessage(loadError));
      }
    })();
    return () => { active = false; };
  }, [getToken]);

  async function submitEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isSending) return;

    setIsSending(true);
    setError("");
    setDraft("");

    try {
      const token = await getToken();
      const response = await fetch(`${apiUrl}/entries/`, {
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
            setEntries((current) => [created, ...current]);
          } else if (eventName === "error") {
            const detail: { message: string } = JSON.parse(data);
            throw new Error(detail.message);
          } else if (data === "[DONE]") {
            finished = true;
          } else {
            const delta: { delta: string } = JSON.parse(data);
            setEntries((current) => current.map((entry) =>
              entry.id === entryId
                ? { ...entry, comment: `${entry.comment ?? ""}${delta.delta}` }
                : entry,
            ));
          }
        }

        if (done) finished = true;
      }
    } catch (submitError) {
      setError(errorMessage(submitError));
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="journal-screen">
      <header className="topbar">
        <a className="wordmark" href="/">uncalled for<span>.</span></a>
        <div className="topbar-right">
          <span className="private-label">A PRIVATE JOURNAL</span>
          <UserButton />
        </div>
      </header>

      <div className="journal-layout">
        <section className="composer-section">
          <p className="eyebrow">A PLACE TO PUT IT</p>
          <h1>What’s on<br />your mind?</h1>
          <p className="composer-copy">No need to make it sound better than it is.</p>
          <form className="entry-form" onSubmit={submitEntry}>
            <label className="visually-hidden" htmlFor="entry">Your entry</label>
            <textarea
              id="entry"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Start anywhere..."
              maxLength={10000}
              disabled={isSending}
            />
            <div className="form-footer">
              <span className="character-count">{draft.length} / 10,000</span>
              <button className="primary-button" type="submit" disabled={!draft.trim() || isSending}>
                {isSending ? "Listening..." : "Let it out"}
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </form>
          {error && <p className="error-message" role="alert">{error}</p>}
          <p className="privacy-note"><span aria-hidden="true">●</span> Only you can see what you write.</p>
        </section>

        <section className="entries-section" aria-labelledby="entries-heading">
          <div className="section-heading">
            <h2 id="entries-heading">Your entries</h2>
            <span>{entries.length.toString().padStart(2, "0")}</span>
          </div>
          {entries.length === 0 ? (
            <p className="empty-state">Your first thought can start here.</p>
          ) : (
            <ol className="entry-list">
              {entries.map((entry) => (
                <li className="entry-item" key={entry.id}>
                  <time>{entry.created_at ? formatDate(entry.created_at) : "JUST NOW"}</time>
                  <p className="entry-text">{entry.entry}</p>
                  {(entry.comment || (isSending && entries[0]?.id === entry.id)) && (
                    <blockquote className="comment-text">
                      <span className="comment-label">A THOUGHT BACK</span>
                      {entry.comment || <span className="typing-indicator" aria-label="Generating response">···</span>}
                      {isSending && entries[0]?.id === entry.id && <span className="stream-cursor" aria-hidden="true" />}
                    </blockquote>
                  )}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
      <div className="page-mark" aria-hidden="true">UNCALLED FOR / 01</div>
    </main>
  );
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value)).toUpperCase();
}

createRoot(document.getElementById("app")!).render(<App />);
