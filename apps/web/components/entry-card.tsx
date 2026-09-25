"use client"

import { formatDate, formatTime } from "@/lib/date";
import { Entry } from "@/types/entry";
import { Button } from "@workspace/ui/components/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { EllipsisVertical, FoldVertical, UnfoldVertical } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { deleteEntry } from "@/app/actions/journal";

export function EntryCard({ entry }: { entry: Entry }) {
    const [expand, toggle] = useState(false);

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center">
                <p className="w-full flex items-center gap-1 font-mono text-xs">
                    <span>{formatDate(entry.created_at)}</span>
                    <span>at</span>
                    <span>{formatTime(entry.created_at)}</span>
                </p>
                <DropdownMenu>
                    <DropdownMenuTrigger render={
                        <Button variant="ghost" aria-label="More entry actions"></Button>}
                    >
                        <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>Regenerate</DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem variant="destructive" onClick={() => deleteEntry(entry.id)}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>

            <div className="flex flex-col items-end justify-end gap-2">
                <p className="w-full">{entry.entry}</p>
                {entry.comment && (
                    <motion.div
                        initial={false}
                        animate={{ height: expand ? "auto" : "2rem" }}
                        className="max-h-fit w-4/5 bg-primary/10 flex items-start rounded-tl rounded-bl overflow-hidden"
                    >
                        <Button
                            variant="ghost"
                            aria-expanded={expand}
                            aria-label={expand ? "Collapse comment" : "Expand comment"}
                            onClick={() => toggle(!expand)}
                        >
                            {expand ? <FoldVertical /> : <UnfoldVertical />}
                        </Button>
                        <p className={`min-w-0 flex-1 p-1 ${expand ? "" : "line-clamp-1"}`}>
                            {entry.comment}
                        </p>
                        <div className="w-1 self-stretch bg-primary rounded-full" />
                    </motion.div>
                )}
            </div>
        </div>
    );
}