import type { Metadata, Viewport } from "next";
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
    <html lang="es" className={`${anton.variable} ${archivo.variable} ${marker.variable}`}>
      <body suppressHydrationWarning className="overflow-x-clip antialiased">{children}</body>
    </html>
  );
}
