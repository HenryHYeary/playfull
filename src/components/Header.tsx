"use client";

import React, { useState } from "react";
import { Volume2 } from "lucide-react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      // prevent NextAuth from doing its own redirect; handle navigation client-side
      await signOut({ redirect: false, callbackUrl: '/login' });
      router.push('/login');
    } catch (err) {
      console.error('Sign out failed', err);
      setSigningOut(false);
    }
  }

  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 roundned-lg p-2">
              <Volume2 className="h-8 w-8 text-white" />
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
    </header>
  )
}