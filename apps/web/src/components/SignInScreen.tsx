import { SignInButton, SignUpButton } from "@clerk/react";
import { Eyebrow, PageMark, PrimaryButton, TextButton, Wordmark } from "@repo/ui";

export function SignInScreen() {
  return (
    <main className="auth-screen">
      <header className="topbar">
        <Wordmark />
        <span className="private-label">A PRIVATE JOURNAL</span>
      </header>
      <section className="welcome">
        <Eyebrow>YOUR THOUGHTS, WITHOUT THE PERFORMANCE</Eyebrow>
        <h1>Say the thing<br />you almost didn’t.</h1>
        <p className="welcome-copy">
          Leave a thought here. Get a thoughtful response, not a verdict.
        </p>
        <div className="auth-actions">
          <SignUpButton mode="modal">
            <PrimaryButton type="button">Start writing <span aria-hidden="true">↗</span></PrimaryButton>
          </SignUpButton>
          <SignInButton mode="modal">
            <TextButton type="button">I have an account</TextButton>
          </SignInButton>
        </div>
      </section>
      <PageMark>01 / 01</PageMark>
    </main>
  );
}