
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
    default: "DURANT | منصة ديورانت التعليمية",
    template: "%s | DURANT",
  },

  description:
    "منصة ديورانت التعليمية مع مستر أمير عبد الناصر، متخصصة في الدراسات الاجتماعية والتاريخ والجغرافيا.",

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
    title: "منصة ديورانت التعليمية",
    description:
      "منصة تعليمية متخصصة في الدراسات الاجتماعية مع مستر أمير عبد الناصر.",
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
