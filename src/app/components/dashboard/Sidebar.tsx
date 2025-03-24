'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'home' },
    { name: 'Profile', href: '/dashboard/profile', icon: 'user' },
    { name: 'Projects', href: '/dashboard/projects', icon: 'briefcase' },
    { name: 'Blog Posts', href: '/dashboard/blogs', icon: 'book-open' },
    { name: 'Settings', href: '/dashboard/settings', icon: 'settings' },
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-1 min-h-0 bg-gray-800">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-white text-xl font-semibold">Admin Dashboard</span>
          </Link>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive(item.href)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
              >
                <span className="flex-shrink-0 h-6 w-6 mr-3 flex items-center justify-center">
                  <i className={`fas fa-${item.icon}`}></i>
                </span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex p-4 bg-gray-700">
          <Link href="/" className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-white">View Site</p>
                <p className="text-xs font-medium text-gray-300">Return to your portfolio</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 