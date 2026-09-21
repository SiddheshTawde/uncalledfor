import { RichTextEditor } from "@/components/editor"
import { Button } from "@workspace/ui/components/button"
import { Show } from "@clerk/nextjs";
import { createEntry } from "./actions/journal";

export default function Page() {
  return (
    <main className="h-[calc(100vh-3rem)] max-w-3xl mx-auto flex flex-col px-6 py-4">
      <form action={createEntry} className="flex-1 relative w-full h-full">
        <RichTextEditor />
        <div className="absolute w-fit h-fit bottom-0 right-0">
          <Show when="signed-in">
            <Button type="submit" className='bg-(--ink) hover:bg-(--ink-faint)' size="lg">Submit</Button>
          </Show>
        </div>
      </form>
    </main>
  )
}
