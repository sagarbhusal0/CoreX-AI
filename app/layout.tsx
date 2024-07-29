import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CoreX AI",
  description: "Owned by Sagar Bhusal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="https://iili.io/dTIogbS.png" />
      <body className={inter.className}>
        <div className="bg-[#212121] w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
