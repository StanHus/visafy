import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/lib/i18n-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "KORE — Spain Immigration Made Simple",
  description:
    "Your trusted partner for Spain visa and immigration applications. Visa processing, local guides, and housing — all in one platform.",
  metadataBase: new URL("https://kore.expanova.io"),
  openGraph: {
    title: "KORE — Spain Immigration Made Simple",
    description:
      "Navigate Spain's immigration process with guided visa applications, local captains, and visa-friendly housing.",
    url: "https://kore.expanova.io",
    siteName: "KORE",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "KORE — Spain Immigration Made Simple",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KORE — Spain Immigration Made Simple",
    description:
      "Navigate Spain's immigration process with guided visa applications, local captains, and visa-friendly housing.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
