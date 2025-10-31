import React from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <Header />
      <div className="flex">
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}