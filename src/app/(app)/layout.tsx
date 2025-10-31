"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import MobileNav from "@/components/MobileNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Header openMobile={() => setMobileOpen(true)} />
      <div className="flex w-full">
        <Navigation />
        <main className="flex-1 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}