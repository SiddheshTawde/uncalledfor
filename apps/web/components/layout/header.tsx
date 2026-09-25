"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/providers/app-store-provider";

const navigationItems = [
  { label: "a journal", value: "journal" },
  { label: "a memory", value: "entries" },
];

export function Header() {
  const router = useRouter();
  const { page, setPage, hasHydrated } = useAppStore((state) => state);

  const handleChange = (value: "journal" | "entries" | null) => {
    if (!value) return;

    router.push(value === "entries" ? "/entries" : "/");
    setPage(value);
  };

  return (
    <header className="w-full max-w-3xl mx-auto px-6 pt-4 pb-0 flex items-end justify-between">
      <div className="flex items-baseline gap-2">
        <span className="font-sans text-xl font-semibold tracking-[-0.02em] hover:text-primary hover:cursor-none">
          Uncalled for
        </span>
        {hasHydrated ? (
          <Select items={navigationItems} value={page} onValueChange={handleChange}>
            <SelectTrigger className="h-fit! p-0 bg-transparent text-xs text-foreground/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {navigationItems.map((item) => (
                  <SelectItem key={item.value} value={item.value} className="text-xs capitalize">
                    {item.label.split(" ")[1]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : null}
      </div>
      <div>
        <Show when="signed-out">
          <SignInButton mode="modal" />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  );
}
