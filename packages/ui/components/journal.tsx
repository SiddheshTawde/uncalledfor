import type { ButtonHTMLAttributes, ReactNode, SubmitEvent } from "react";

interface WordmarkProps {
  href?: string;
}

export function Wordmark({ href = "/" }: WordmarkProps) {
  return (
    <a className="ui-wordmark" href={href}>
      uncalled for<span aria-hidden="true">.</span>
    </a>
  );
}

interface EyebrowProps {
  children: ReactNode;
}

export function Eyebrow({ children }: EyebrowProps) {
  return <p className="ui-eyebrow">{children}</p>;
}

export function PrimaryButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className="ui-primary-button" {...props}>{children}</button>;
}

export function TextButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className="ui-text-button" {...props}>{children}</button>;
}

interface PageMarkProps {
  children: ReactNode;
}

export function PageMark({ children }: PageMarkProps) {
  return <div className="ui-page-mark" aria-hidden="true">{children}</div>;
}

interface EntryComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  isSending?: boolean;
  maxLength?: number;
  submitLabel?: string;
  sendingLabel?: string;
  placeholder?: string;
  id?: string;
}

export function EntryComposer({
  value,
  onChange,
  onSubmit,
  isSending = false,
  maxLength = 10000,
  submitLabel = "Let it out",
  sendingLabel = "Listening...",
  placeholder = "Start anywhere...",
  id = "entry",
}: EntryComposerProps) {
  return (
    <form className="ui-entry-form" onSubmit={onSubmit}>
      <label className="ui-visually-hidden" htmlFor={id}>Your entry</label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={isSending}
      />
      <div className="ui-form-footer">
        <span className="ui-character-count">{value.length.toLocaleString()} / {maxLength.toLocaleString()}</span>
        <PrimaryButton type="submit" disabled={!value.trim() || isSending}>
          {isSending ? sendingLabel : submitLabel}
          <span aria-hidden="true">↗</span>
        </PrimaryButton>
      </div>
    </form>
  );
}