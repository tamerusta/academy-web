import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Developer MultiGroup",
  description:
    "Official event page of Developer MultiGroup where you can discover and attend insightful events every month! ",
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "Developer",
    "MultiGroup",
    "Developer MultiGroup",
    "DMG",
    "Etkinlik",
    "Yazılım",
    "Yazılım Etkinliği",
    "Topluluk",
    "Yazılım Topluluğu",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} bg-color-background`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
