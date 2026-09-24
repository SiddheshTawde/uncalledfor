"use client"

import React, { useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

const items = [
  { label: "a journal", value: "journal" },
  { label: "a memory", value: "entries" },
]

export function Header() {
  const [page, changePage] = useState(items[0]);
  return (
    <header className="w-full max-w-3xl mx-auto px-6 pt-4 pb-0 flex items-end justify-between">
      <div className="flex items-baseline gap-2">
        <span className="font-sans text-xl font-semibold tracking-[-0.02em] hover:text-primary hover:cursor-none">
          Uncalled for
        </span>
        <Select items={items} value={page} onValueChange={(value) => changePage(value!)}>
          <SelectTrigger className="h-fit! p-0 bg-transparent text-xs text-foreground/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value} className="text-xs capitalize">
                  {item.label?.split(' ')?.[1]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Show when="signed-out">
          <SignInButton mode="modal" />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header >
  )
}
