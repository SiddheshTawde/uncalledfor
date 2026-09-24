"use client"

import * as React from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider as NextThemesProvider } from "@wrksz/themes/next"
import { NavigationStoreProvider } from "@/providers/navigation-provider"
import { EntriesStoreProvider } from "@/providers/entries-provider"

function Provider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ClerkProvider>
        <NavigationStoreProvider>
          <EntriesStoreProvider>
            {children}
          </EntriesStoreProvider>
        </NavigationStoreProvider>
      </ClerkProvider>
    </NextThemesProvider>
  )
}

export { Provider }
