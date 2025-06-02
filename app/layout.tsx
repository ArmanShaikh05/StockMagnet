import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StockMagnet",
  description: "Best app for inventory managment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#ff895b",
          fontFamily: "Inter",
        },
      }}
    >
      <html lang="en">
        <body className={`${inter.className} antialiased `}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
