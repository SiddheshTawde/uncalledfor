import { formatDate, formatTime } from "@/lib/utils"
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
                entries.map(entry => <EntryCard key={entry.id} entry={entry} />)
            )}
        </main>
    )
}

function EntryCard({ entry }: { entry: Entry }) {
    return (
        <div className="border-t border-(--rule) py-7">
            <div className="flex justify-between mb-3.5">
                <span className="font-sans text-[0.68rem] font-medium uppercase tracking-[0.12em] text-(--ink-faint)">
                    {formatDate(entry.created_at)}
                </span>
                <span className="font-sans text-[0.68rem] text-(--ink-lighter)">
                    {formatTime(entry.created_at)}
                </span>
            </div>

            <p className="font-serif text-base italic font-normal text-(--ink) leading-[1.85] m-0 mb-4.5 whitespace-pre-wrap [transition:margin-bottom_0.3s_ease]">
                {entry.entry}
            </p>

            <div className="overflow-hidden max-h-40 [transition:max-height_0.5s_ease,opacity_0.4s_ease]">
                <div className="flex items-start gap-2.5 bg-(--stamp-bg) border border-[#c8dfd0] rounded-[14px] px-4 py-3">
                    <p className="font-mono text-[0.8125rem] text-(--stamp) leading-[1.65] m-0">
                        {entry.comment}
                    </p>
                </div>
            </div>
        </div>
    );
}