import type { Metadata, Viewport } from "next";
// Nunito shrifti npm paketidan keladi — build paytida Google'ga so'rov yuborilmaydi,
// ya'ni internet cheklovlarida ham, Vercel'da ham bir xil ishlaydi.
import "@fontsource-variable/nunito";
import "./globals.css";
import SwRoyxatga from "@/components/SwRoyxatga";

export const metadata: Metadata = {
  title: "Topgan-topaloq",
  description:
    "O'zbek xalq topishmoqlarini sun'iy intellekt bilan suhbat shaklida o'rganish. Har topishmoqda bir hikmat yashiringan.",
  applicationName: "Topgan-topaloq",
  // F11 — PWA: manifest orqali "Bosh ekranga qo'shish" imkoniyati.
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Topgan-topaloq",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E2A57",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body className="font-sans antialiased">
        {children}
        <SwRoyxatga />
      </body>
    </html>
  );
}
