"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  PlusSquare,
} from "lucide-react";

export interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  section?: string;
  label: string;
}

export const navigationItems: NavItem[] = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Create / Add", icon: PlusSquare, href: "/create", section: "CREATE" },
];

export function NavigationItems({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6 z-50">
      {navigationItems.map((item, index) => {
        const isActive = pathname === item.href;
        const showSection =
          item.section && (index === 0 || navigationItems[index - 1].section !== item.section);
        return (
          <div key={item.href}>
            {showSection && (
              <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3 mt-6 first:mt-0">
                {item.section}
              </div>
            )}
            <Link
              href={item.href}
              onClick={onClick}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group ${
                isActive
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${
                  isActive ? "text-blue-400" : "text-gray-400 group-hover:text-white"
                }`}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
