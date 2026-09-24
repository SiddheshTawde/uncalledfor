import { EntryCard } from "@/components/entry-card";
import { getEntries } from "../actions/journal"
import { Entry } from "@/types/entry";

export default async function Page() {
    const entries = (await getEntries()) as Entry[];

    return (
        <main>
            {entries && entries.length === 0 ? (
                <div>
                    <p>No entries yet.<br />Go write something.</p>
                </div>
            ) : (
                entries?.map(entry => <EntryCard key={entry.id} entry={entry} />)
            )}
        </main>
    )
}