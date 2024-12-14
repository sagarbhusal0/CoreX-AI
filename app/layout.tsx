import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CoreX AI | Advanced AI Chat Assistant",
  description: "CoreX AI - Your intelligent AI chat assistant powered by advanced machine learning. Get instant answers, code help, image analysis, and more. Created by Sagar Bhusal.",
  keywords: ["CoreX AI", "AI chatbot", "artificial intelligence", "machine learning", "AI assistant", "image analysis", "code helper", "Sagar Bhusal", "AI chat"],
  authors: [{ name: "Sagar Bhusal" }],
  openGraph: {
    title: "CoreX AI | Advanced AI Chat Assistant",
    description: "Experience the next generation of AI chat with CoreX AI. Get instant answers, analyze images, and more.",
    images: ['https://i.ibb.co/B2zTrYK/favicon-removebg-preview.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "CoreX AI | Advanced AI Chat Assistant",
    description: "Experience the next generation of AI chat with CoreX AI. Get instant answers, analyze images, and more.",
    images: ['https://i.ibb.co/B2zTrYK/favicon-removebg-preview.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
