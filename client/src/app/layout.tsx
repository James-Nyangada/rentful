import type { Metadata } from "next";
import { Spectral } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-spectral",
});

export const metadata: Metadata = {
  title: "CHESTONE PROPERTIES | Structured Property Solutions",
  description: "Experience the pinnacle of luxury real estate and property management in Kenya. Trust, stability, and premium quality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://rentful.onrender.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://rentful.onrender.com" />
      </head>
      <body
        className={`${spectral.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <WhatsAppFloat />
        </Providers>
        <Toaster closeButton />
      </body>
    </html>
  );
}
