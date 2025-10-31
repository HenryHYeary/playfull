"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Playfull_Logo from "@/public/Playfull_Logo.png";
import MobileNav from "@/components/MobileNav";

export default function Header() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut({ redirect: false, callbackUrl: '/login' });
      router.push('/login');
    } catch (err) {
      console.error('Sign out failed', err);
      setSigningOut(false);
    }
  }

  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 w-full min-w-full">
      <div className="w-full px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-md hover:bg-white/5 md:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <div className="bg-gradient-to-r from-purple-900 to-purple-200 rounded-sm p-2">
              <Image src={Playfull_Logo} alt="Playfull Logo" height={60} width={60}/>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Play<span className="text-yellow-200">full</span></h1>
              <p className="text-purple-200">Create. Share. Inspire.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!signingOut && <button
              className="cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>}
          </div>
        </div>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}