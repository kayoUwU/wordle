import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/ui/globals.css";
import "@/ui/animation.css";
import {WEB_ICON} from "@/lib/constant";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wordle UI Project",
  description: "Guess Word like Wordle Game",
  keywords: ["wordle"],
  icons: {
    icon: WEB_ICON,
  },
  //no index
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noimageindex: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
