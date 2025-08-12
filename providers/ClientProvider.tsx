"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { store } from "@/store";
import { Provider } from "react-redux";
import SonnerProvider from "./SonnerProvider";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

function ClientProvider({ children }: { children?: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <SonnerProvider />
          <Toaster />
          {children}
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default ClientProvider;
