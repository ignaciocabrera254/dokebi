import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Anton, Archivo, Permanent_Marker } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--nf-anton" });
const archivo = Archivo({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
  variable: "--nf-archivo",
});
const marker = Permanent_Marker({ weight: "400", subsets: ["latin"], variable: "--nf-marker" });

// Subset de Black Han Sans (Google Fonts) con solo 도깨비 인기 핫도그 떡볶이: next/font/google no trae el subset coreano completo.
const korean = localFont({ src: "../fonts/BlackHanSans-dokkaebi.woff2", weight: "400", display: "swap", preload: false, variable: "--nf-korean" });

const title = "DOKEBI · Korean Street Food · Santiago";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description: site.description,
    url: site.url,
    siteName: "DOKEBI",
    locale: "es_CL",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description: site.description },
};

export const viewport: Viewport = { themeColor: "#0A0A0A" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${anton.variable} ${archivo.variable} ${marker.variable} ${korean.variable}`}>
      <body suppressHydrationWarning className="overflow-x-clip antialiased">{children}</body>
    </html>
  );
}
