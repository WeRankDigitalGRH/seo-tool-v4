import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SEO Audit Tool - Comprehensive Website Analysis",
  description: "AI-powered SEO audit tool analyzing 40+ ranking factors.",
  openGraph: {
    title: "SEO Audit Tool",
    description: "Comprehensive AI-powered SEO analysis for any website",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
