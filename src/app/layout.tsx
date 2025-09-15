import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Book Beautiful Stays | Flex Living",
  description: "Discover serene, well-lit accommodations with natural lighting and cozy atmospheres perfect for your perfect getaway.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <Header />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
