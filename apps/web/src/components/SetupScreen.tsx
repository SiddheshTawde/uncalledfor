import { Eyebrow } from "@repo/ui";

export function SetupScreen() {
  return (
    <main className="setup-screen">
      <Eyebrow>UNCALLED FOR</Eyebrow>
      <h1>One honest thought at a time.</h1>
      <p className="setup-copy">
        Add <code>VITE_CLERK_PUBLISHABLE_KEY</code> to the web app environment
        to enable your private journal.
      </p>
    </main>
  );
}