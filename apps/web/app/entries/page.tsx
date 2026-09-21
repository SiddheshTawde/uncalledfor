import { EntryCard } from "@/components/entry-card";
import { getEntries } from "../actions/journal"
import { Entry } from "@/types/entry";

export default async function Page() {
    const entries = (await getEntries()) as Entry[];

    return (
        <main className="h-[calc(100vh-3rem)] max-w-3xl mx-auto flex flex-col px-6 py-4 overflow-y-auto">
            {entries && entries.length === 0 ? (
                <div className="pt-16 text-center">
                    <p className="font-mono text-[0.8rem] text-(--ink-lighter) leading-[1.9]">
                        No entries yet.<br />Go write something.
                    </p>
                </div>
            ) : (
                entries?.map(entry => <EntryCard key={entry.id} entry={entry} />)
            )}
        </main>
    )
}