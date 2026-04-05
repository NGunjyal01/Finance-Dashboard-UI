"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
import { Sidebar } from "./Sidebar";
import { ThemeProvider } from "./ThemeProvider";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useFinanceStore();
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <main className={cn(
          "flex-1 min-h-screen transition-all duration-300",
          sidebarOpen ? "ml-[260px]" : "ml-[68px]"
        )}>
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}