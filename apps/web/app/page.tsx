"use client"

import { motion } from "motion/react";
import { RichTextEditor } from "@/components/editor"
import { Button } from "@workspace/ui/components/button"
import { createEntry } from "./actions/journal";

export default function Page() {
  return (
    <motion.main
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: 0.5 }}
      className="flex-1 w-full max-w-3xl mx-auto flex flex-col px-6 py-4"
    >
      <form action={createEntry} className="flex-1 flex flex-col relative w-full h-full">
        <RichTextEditor />
        <Button type="submit" size="lg" className="absolute bottom-4 right-4">Submit</Button>
      </form>
    </motion.main>
  )
}
