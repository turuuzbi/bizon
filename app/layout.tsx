import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist_Mono, Inter } from "next/font/google";

import { AiChatButton } from "@/components/ai-chat-button";
import { CompareBar } from "@/components/marketplace/compare-bar";
import { LocaleProvider } from "@/components/locale-provider";
import { getLocale } from "@/lib/i18n-server";

import "./globals.css";

// One clean, neutral sans for headings and body — SF-Pro-like, the Apple way.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Erka's",
  description: "Building materials storefront and catalog management workspace",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleProvider locale={locale}>
          <ClerkProvider>
            {children}
            <CompareBar />
            <AiChatButton />
          </ClerkProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
