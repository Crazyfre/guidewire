import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GigShield AI — Parametric Insurance for Gig Workers",
  description:
    "AI-powered parametric insurance platform protecting Q-Commerce riders from income disruptions. Automatic claims, blockchain proof, instant UPI payouts.",
  keywords: "gig workers, parametric insurance, AI, Zepto, Blinkit, disruption protection",
  openGraph: {
    title: "GigShield AI",
    description: "Protect your gig earnings with AI-powered parametric insurance",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
