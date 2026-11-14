
import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";

export const metadata: Metadata = {
  title: {
    absolute: "منصة ديورانت التعليمية DURANT | مستر أمير عبد الناصر",
  },
  description:
    "DURANT منصة ديورانت التعليمية المتخصصة في الدراسات الاجتماعية والتاريخ والجغرافيا للمرحلتين الإعدادية والثانوية، مع مستر أمير عبد الناصر.",
  keywords: [
    "منصة ديورانت",
    "DURANT",
    "منصة DURANT التعليمية",
    "مستر أمير عبد الناصر",
    "الدراسات الاجتماعية",
    "التاريخ",
    "الجغرافيا",
  ],
  alternates: {
    canonical: "https://durant-rose.vercel.app/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://durant-rose.vercel.app/",
    siteName: "DURANT",
    title: "منصة ديورانت التعليمية | DURANT",
    description:
      "منصة تعليمية متخصصة في الدراسات الاجتماعية مع مستر أمير عبد الناصر.",
    images: [
      {
        url: "/images/ameer-nasser.jpg",
        width: 500,
        height: 700,
        alt: "مستر أمير عبد الناصر - منصة ديورانت",
      },
    ],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://durant-rose.vercel.app/#organization",
      name: "منصة ديورانت التعليمية",
      alternateName: "DURANT",
      url: "https://durant-rose.vercel.app/",
      description:
        "منصة ديورانت التعليمية المتخصصة في الدراسات الاجتماعية والتاريخ والجغرافيا للمرحلتين الإعدادية والثانوية، مع مستر أمير عبد الناصر.",
      knowsAbout: [
        "الدراسات الاجتماعية",
        "التاريخ",
        "الجغرافيا",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://durant-rose.vercel.app/#website",
      name: "منصة ديورانت التعليمية DURANT",
      alternateName: "DURANT",
      url: "https://durant-rose.vercel.app/",
      inLanguage: "ar-EG",
      publisher: {
        "@id": "https://durant-rose.vercel.app/#organization",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <HomePageClient />
    </>
  );
}
