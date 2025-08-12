"use client";

import { ThemeProvider } from "@/components/theme-provider";
import SonnerProvider from "./SonnerProvider";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import { store } from "@/store";

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
