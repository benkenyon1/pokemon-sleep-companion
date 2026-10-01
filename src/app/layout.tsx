import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sleep Companion",
  description: "Rate your Pokémon Sleep catches and decide what to keep.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
