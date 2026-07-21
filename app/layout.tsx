import type { Metadata, Viewport } from "next";
import { Aref_Ruqaa, Markazi_Text, Tajawal, Cormorant_Garamond } from "next/font/google";
import { WEDDING } from "@/lib/wedding";
import "./globals.css";

const arefRuqaa = Aref_Ruqaa({
  variable: "--font-aref-ruqaa",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

const markazi = Markazi_Text({
  variable: "--font-markazi",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const OG_TITLE = `دعوة زفاف ${WEDDING.groom} & ${WEDDING.bride}`;
const OG_DESCRIPTION = `${WEDDING.dayName}، ${WEDDING.dateLabel}${WEDDING.venueName ? ` • ${WEDDING.venueName}` : ""}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://da3a.vercel.app"),
  title: OG_TITLE,
  description: OG_DESCRIPTION,
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    type: "website",
    locale: "ar",
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#f8f3ee",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${arefRuqaa.variable} ${markazi.variable} ${tajawal.variable} ${cormorant.variable}`}
    >
      <body className="min-h-full bg-cream text-ink antialiased overflow-x-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
