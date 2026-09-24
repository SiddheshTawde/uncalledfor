"use client"

import { formatDate, formatTime } from "@/lib/utils"
import { Entry } from "@/types/entry";

export function EntryCard({ entry }: { entry: Entry }) {
    return (
        <div>
            <div>
                <span>
                    {formatDate(entry.created_at)}
                </span>
                <span>
                    {formatTime(entry.created_at)}
                </span>
            </div>

            <p>{entry.entry}</p>

            <div>
                <div>
                    <p>{entry.comment}</p>
                </div>
            </div>
        </div>
    );
}