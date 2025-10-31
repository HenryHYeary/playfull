"use client";

import { NavigationItems } from "./NavigationItems";

export default function Navigation() {
  return (
    <nav className="hidden sm:block w-fit bg-black/20 backdrop-blur-sm border-r border-white/10 min-h-screen p-6 relative z-0">
      <NavigationItems />
    </nav>
  );
}
