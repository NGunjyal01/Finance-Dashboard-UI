import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinFlow — Personal Finance Dashboard",
  description: "Track and understand your financial activity with clarity",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}