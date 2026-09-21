"use client"

import { formatDate, formatTime } from "@/lib/utils"
import { deleteEntry } from "@/app/actions/journal"
import { Entry } from "@/types/entry";
import { Button } from "@workspace/ui/components/button";
import { LucideTrash } from "lucide-react";

export function EntryCard({ entry }: { entry: Entry }) {
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
                <div className="relative flex items-start gap-2.5 bg-(--stamp-bg) border border-[#c8dfd0] rounded-[14px] px-4 py-3">
                    <p className="font-mono text-[0.8125rem] text-(--stamp) leading-[1.65] m-0 pr-12">
                        {entry.comment}
                    </p>

                    <Button onClick={() => deleteEntry(entry?.id ?? "")} variant="ghost" size="icon" className="absolute top-0 bottom-0 right-3 m-auto" type="submit" >
                        <LucideTrash />
                    </Button>
                </div>
            </div>
        </div>
    );
}