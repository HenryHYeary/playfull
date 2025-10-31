import "./globals.css";
import { Inter } from "next/font/google";
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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
