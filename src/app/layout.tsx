import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/lib/i18n-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "KORE \u2014 Spain Immigration Made Simple",
  description:
    "Your trusted partner for Spain visa and immigration applications. Start your journey today.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased overflow-x-hidden">
        <SessionProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
