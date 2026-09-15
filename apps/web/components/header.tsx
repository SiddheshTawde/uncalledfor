"use client"

import React from "react"
import { useRouter, usePathname } from "next/navigation";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()

  const isEditor = pathname === "/"

  return (
    <header className="h-12 max-w-3xl mx-auto px-6 pt-4 pb-0 flex items-center justify-between shrink-0">
      <div className="flex items-baseline gap-2">
        <span className="font-sans text-base font-semibold tracking-[-0.02em] text-(--ink)">
          Uncalled For
        </span>
        <span className="font-mono text-[0.65rem] text-(--ink-faint)">
          a journal
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Show when="signed-out">
          <SignInButton mode="modal" />
        </Show>
        <Show when="signed-in">
          {isEditor ?
            <button className="font-sans text-[0.72rem] font-medium text-(--ink-faint) bg-transparent border-none cursor-pointer py-1 rounded-full transition-colors hover:text-(--ink) flex items-center gap-1" onClick={() => router.push('/entries')}>
              entries <ArrowRightIcon size={12} />
            </button> :
            <button className="font-sans text-[0.72rem] font-medium text-(--ink-faint) bg-transparent border-none cursor-pointer py-1 rounded-full transition-colors hover:text-(--ink) flex items-center gap-1" onClick={() => router.back()}>
              <ArrowLeftIcon size={12} /> write
            </button>
          }
        </Show>
      </div>
    </header >
  )
}
