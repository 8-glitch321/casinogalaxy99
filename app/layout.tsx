import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CasinoGalaxy99 Bonus",
  description: "Casino Bonusangebote für die Community von CasinoGalaxy99.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
