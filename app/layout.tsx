import type { Metadata, Viewport } from "next";
import { Aref_Ruqaa, Markazi_Text, Tajawal, Cormorant_Garamond } from "next/font/google";
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

export const metadata: Metadata = {
  title: "محمد ورؤى | دعوة زفاف",
  description:
    "يسرنا دعوتكم لمشاركتنا أجمل لحظات العمر، حفل زفاف محمد ورؤى، الخميس 13 أغسطس 2026.",
  openGraph: {
    title: "محمد ورؤى | دعوة زفاف",
    description: "يسرنا دعوتكم لمشاركتنا أجمل لحظات العمر، الخميس 13 أغسطس 2026",
    type: "website",
    locale: "ar",
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
      <body className="min-h-full bg-cream text-ink antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
