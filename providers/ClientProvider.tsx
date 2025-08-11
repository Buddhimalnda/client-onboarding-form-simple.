"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { store } from "@/store";
import { Provider } from "react-redux";
import SonnerProvider from "./SonnerProvider";
import { Toaster } from "@/components/ui/sonner";

function ClientProvider({ children }: { children?: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SonnerProvider />
        <Toaster />
        {children}
      </ThemeProvider>
    </Provider>
  );
}

export default ClientProvider;
