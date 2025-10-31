import React, { useEffect } from "react";
import { X } from "lucide-react";
import { NavigationItems } from "@/components/NavigationItems";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileNav({ open, onClose }: MobileNavProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-start">
      <button
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0"
      />
      <aside className="relative z-50 w-72 max-w-full bg-slate-900 text-white p-4 shadow-xl transform transition-transform">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onClose} className="p-2 rounded hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>
        <NavigationItems onClick={onClose} />
      </aside>
    </div>
  );
}
