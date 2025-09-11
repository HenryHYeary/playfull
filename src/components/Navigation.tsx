"use client";

import { Home, Search, Library, PlusSquare, Heart, Music, Headphones, TrendingUp, Users, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  section?: string;
  label: string;
}

const navigationItems: NavItem[] = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Search', icon: Search, href: '/search' },
  { label: 'Your Library', icon: Library, href: '/library' },
  
  { label: 'Create Playlist', icon: PlusSquare, href: '/create', section: 'CREATE' },
  { label: 'Liked Songs', icon: Heart, href: '/liked' },
  
  { label: 'Recently Played', icon: Headphones, href: '/recent', section: 'DISCOVER' },
  { label: 'Trending', icon: TrendingUp, href: '/trending' },
  { label: 'Made for You', icon: Music, href: '/made-for-you' },
  
  { label: 'Friends Activity', icon: Users, href: '/friends', section: 'SOCIAL' },
  { label: 'Settings', icon: Settings, href: '/settings' },
]

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className='w-64 bg-black/20 backdrop-blur-sm border-r border-white/10 min-h-screen p-6'>
      <div className='space-y-6'>
        {navigationItems.map((item, index) => {
          const isActive = pathname === item.href;
          const showSection = item.section && (index === 0 || navigationItems[index - 1].section !== item.section);
          return (
            <div key={item.href}>
              {showSection && (
                <div className='text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3 mt-6 first:mt-0'>
                  {item.section}
                </div>
              )}
              <Link 
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-blue-400" : "text-gray-400 group-hover:text-white"}`} />
                <span className='font-medium'>{item.label}</span>
              </Link>
            </div>
          )
        })}
      </div>
    </nav>
  )
}