import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/componentes/auth/AuthProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Babel Arcana",
  description: "A plataforma para criar e manter seu CODEX de fichas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bodyClasses = `${geistSans.variable} ${geistMono.variable} antialiased`;
  
  return (
    <html lang="pt-BR">
      <body className={bodyClasses}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
