import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

import { Metadata } from "next";
import AuthProvider from "./AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Playfull - Create. Share. Collaborate.",
  description: "A fine-grained customizable playlist generator.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> 
          <div className="min-h screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
            <Header />
            <div className="flex">
              <Navigation />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
