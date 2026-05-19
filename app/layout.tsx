import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Fraunces, Geist_Mono, Manrope } from "next/font/google";

import { AiChatButton } from "@/components/ai-chat-button";
import { LocaleProvider } from "@/components/locale-provider";
import { getLocale } from "@/lib/i18n-server";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
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
      className={`${manrope.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleProvider locale={locale}>
          <ClerkProvider>
            {children}
            <AiChatButton />
          </ClerkProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
