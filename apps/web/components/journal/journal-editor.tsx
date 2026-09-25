import { Textarea } from "@workspace/ui/components/textarea";

export function JournalEditor() {
  return (
    <Textarea
      id="main-editor"
      name="entry"
      placeholder="What's on your mind?"
      required
      autoFocus
      className="flex-1 max-h-[92vh] pb-16 w-full rounded resize-none outline-none placeholder:italic"
    />
  );
}