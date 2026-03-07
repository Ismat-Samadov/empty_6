import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kreditor.az - Kredit Müraciəti",
  description:
    "Azərbaycanın aparıcı banklarına tək platforma üzərindən kredit müraciəti göndərin.",
  keywords: ["kredit", "bank", "müraciət", "loan", "Azerbaijan"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kreditor.az",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <head>
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className={`${geist.variable} font-sans antialiased`}>
        {children}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js');
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
