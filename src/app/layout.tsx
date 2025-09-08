import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Playfull - Create. Share. Play.",
  description: "A platform to create, share, and play music.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}
      <div className="min-h screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <Header />
        <div className="flex">
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </body>
    </html>
  );
}