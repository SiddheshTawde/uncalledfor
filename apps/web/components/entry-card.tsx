"use client"

import { formatDate, formatTime } from "@/lib/utils"
import { Entry } from "@/types/entry";
import { Button } from "@workspace/ui/components/button";
import { Ellipsis, ListChevronsDownUp, ListChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";

export function EntryCard({ entry }: { entry: Entry }) {
    const [expand, toggle] = useState(false)

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center">
                <p className="w-full flex items-center gap-1 font-mono text-xs">
                    <span>
                        {formatDate(entry.created_at)}
                    </span>
                    <span>at</span>
                    <span>
                        {formatTime(entry.created_at)}
                    </span>
                </p>
                <Button variant='ghost'>
                    <Ellipsis />
                </Button>
            </div>

            <div className="flex flex-col items-end justify-end gap-2">
                <p className="w-full">{entry.entry}</p>
                {entry.comment &&
                    <motion.div
                        initial={false}
                        animate={{ height: expand ? 'auto' : '2rem' }}
                        className="max-h-fit w-4/5 bg-primary/10 flex items-start rounded-tl rounded-bl overflow-hidden"
                    >
                        <Button
                            variant='ghost'
                            aria-expanded={expand}
                            aria-label={expand ? 'Collapse comment' : 'Expand comment'}
                            onClick={() => toggle(!expand)}
                        > {expand ?
                            <ListChevronsDownUp /> : <ListChevronsUpDown />
                        }
                        </Button>
                        <p className={`min-w-0 flex-1 p-1 ${expand ? '' : 'line-clamp-1'}`}>{entry.comment}</p>
                        <div className=" w-1 self-stretch bg-primary rounded-full"></div>
                    </motion.div>
                }
            </div>
        </div>
    );
}