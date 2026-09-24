"use client"

import * as React from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider as NextThemesProvider } from "@wrksz/themes/next"
import { StoreProvider } from "@/providers/store-provider"

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
        <StoreProvider>{children}</StoreProvider>
      </ClerkProvider>
    </NextThemesProvider>
  )
}

export { Provider }
