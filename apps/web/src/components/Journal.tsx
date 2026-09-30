import { UserButton } from "@clerk/react";
import { EntryComposer, Eyebrow, PageMark, Wordmark } from "@repo/ui";
import { useJournal } from "../hooks/useJournal";
import { formatDate } from "../utils/format";

export function Journal() {
  const { entries, draft, setDraft, isSending, error, submitEntry } = useJournal();

  return (
    <main className="journal-screen">
      <header className="topbar">
        <Wordmark />
        <div className="topbar-right">
          <span className="private-label">A PRIVATE JOURNAL</span>
          <UserButton />
        </div>
      </header>

      <div className="journal-layout">
        <section className="composer-section">
          <Eyebrow>A PLACE TO PUT IT</Eyebrow>
          <h1>What’s on<br />your mind?</h1>
          <p className="composer-copy">No need to make it sound better than it is.</p>
          <EntryComposer
            value={draft}
            onChange={setDraft}
            onSubmit={submitEntry}
            isSending={isSending}
          />
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
      <PageMark>UNCALLED FOR / 01</PageMark>
    </main>
  );
}