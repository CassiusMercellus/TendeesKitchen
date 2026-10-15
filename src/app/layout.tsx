import type { Metadata } from "next";
import { Fraunces, Playfair_Display, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-playfair",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-work-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Tendee's Kitchen",
  description: "Nigerian & West African catering — order online, no phone call required.",
};

// Every page reads live Firestore data (menu, orders, settings), edited at
// any time through the admin panel. Force dynamic rendering everywhere so
// nothing gets statically baked in at build time and served stale until the
// next deploy.
export const dynamic = "force-dynamic";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${playfairDisplay.variable} ${workSans.variable} ${plexMono.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-ink antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
