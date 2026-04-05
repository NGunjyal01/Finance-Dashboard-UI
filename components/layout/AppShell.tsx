"use client";

import { useState, useEffect } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { Sidebar } from "./Sidebar";
import { ThemeProvider } from "./ThemeProvider";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useFinanceStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <main
          className={cn(
            "flex-1 min-h-screen transition-all duration-300",
            mounted
              ? sidebarOpen ? "ml-[260px]" : "ml-[68px]"
              : "ml-[260px]"
          )}
        >
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}