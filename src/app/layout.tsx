import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LayoutWrapper from "./LayoutWrapper";
import { Inter, Roboto_Mono } from 'next/font/google'

 const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})
export const metadata: Metadata = {
  title: "Book Kart",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={roboto_mono.className}
      >
        <LayoutWrapper>
        {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
