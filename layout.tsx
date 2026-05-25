import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Hustle Receipt",
  description: "Support your favorite creators with tips",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-dark-900 text-dark-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
