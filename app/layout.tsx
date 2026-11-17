
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import DurantMotion from "@/components/DurantMotion";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://durant-rose.vercel.app"),

  title: {
    default: "DURANT | Ù…Ù†ØµØ© Ø¯ÙŠÙˆØ±Ø§Ù†Øª Ø§Ù„ØªØ¹Ù„ÙŠÙ…ÙŠØ©",
    template: "%s | DURANT",
  },

  description:
    "Ù…Ù†ØµØ© Ø¯ÙŠÙˆØ±Ø§Ù†Øª Ø§Ù„ØªØ¹Ù„ÙŠÙ…ÙŠØ© Ù…Ø¹ Ù…Ø³ØªØ± Ø£Ù…ÙŠØ± Ø¹Ø¨Ø¯ Ø§Ù„Ù†Ø§ØµØ±ØŒ Ù…ØªØ®ØµØµØ© ÙÙŠ Ø§Ù„Ø¯Ø±Ø§Ø³Ø§Øª Ø§Ù„Ø§Ø¬ØªÙ…Ø§Ø¹ÙŠØ© ÙˆØ§Ù„ØªØ§Ø±ÙŠØ® ÙˆØ§Ù„Ø¬ØºØ±Ø§ÙÙŠØ§.",

  applicationName: "DURANT",

  alternates: {
    canonical: "/",
  },

  verification: {
    google: [
      "clIujkJjJA9CAokGu5ICHDDrG_6DyITg3WEBmTwLBds",
      "1xX3qz2UvE5sltQoImjRmvEdbKJyQoxWXxfYo_c5OQU",
      "qb6XADN7aV1ZTPFepZRxzaXueNQ_JNXoi5ldPch7ysY",
    ],
  },

  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "DURANT",
    title: "Ù…Ù†ØµØ© Ø¯ÙŠÙˆØ±Ø§Ù†Øª Ø§Ù„ØªØ¹Ù„ÙŠÙ…ÙŠØ©",
    description:
      "Ù…Ù†ØµØ© ØªØ¹Ù„ÙŠÙ…ÙŠØ© Ù…ØªØ®ØµØµØ© ÙÙŠ Ø§Ù„Ø¯Ø±Ø§Ø³Ø§Øª Ø§Ù„Ø§Ø¬ØªÙ…Ø§Ø¹ÙŠØ© Ù…Ø¹ Ù…Ø³ØªØ± Ø£Ù…ÙŠØ± Ø¹Ø¨Ø¯ Ø§Ù„Ù†Ø§ØµØ±.",
    url: "https://durant-rose.vercel.app/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <DurantMotion />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

