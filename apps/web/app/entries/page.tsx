"use client"

import Link from "next/link";
import { motion } from "motion/react";
import { EntryCard } from "@/components/entry-card";
import { useAppStore } from "@/providers/store-provider";

export default function Page() {
    const { entries } = useAppStore(state => state)
    if (entries.length === 0) {
        return (
            <motion.main
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ease: 'easeInOut', duration: 0.5 }}
                className="flex-1 w-full max-w-3xl mx-auto flex flex-col items-center justify-center px-6 py-4"
            >
                <p className="font-mono text-sm text-foreground/60 text-center">No entries yet. <br /> Go <Link href="/" className="underline text-primary">write something</Link>.</p>
            </motion.main>
        )
    }

    return (
        <motion.main
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: 'easeInOut', duration: 0.5 }}
            className="flex-1 w-full max-w-3xl mx-auto flex flex-col px-6 py-4"
        >
            {entries && entries.length === 0 ? (
                <div>
                    <p>No entries yet.<br />Go write something.</p>
                </div>
            ) : (
                entries?.map(entry => <EntryCard key={entry.id} entry={entry} />)
            )}
        </motion.main>
    )
}