"use client"

import { EntryCard } from "@/components/entry-card";
import { useStore } from "@/store";
import Link from "next/link";

export default function Page() {
    const { entries } = useStore();

    if (entries.length === 0) {
        return (
            <main className="flex-1 w-full max-w-3xl mx-auto flex flex-col items-center justify-center px-6 py-4">
                <p className="font-mono text-sm text-foreground/60 text-center">No entries yet. <br /> Go <Link href="/" className="underline text-primary">write something</Link>.</p>
            </main>
        )
    }

    return (
        <main className="flex-1 w-full max-w-3xl mx-auto flex flex-col px-6 py-4">
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