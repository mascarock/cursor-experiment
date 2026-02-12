"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomNavBarProps {
  eventSlug: string;
  unreadCount?: number;
}

const navItems = [
  { label: "Discover", icon: "dashboard", path: "discover" },
  { label: "Schedule", icon: "calendar_today", path: "schedule" },
  { label: "Chats", icon: "chat", path: "chats" },
  { label: "Profile", icon: "person", path: "profile" },
];

export function BottomNavBar({ eventSlug, unreadCount = 0 }: BottomNavBarProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 z-50 w-full bg-white dark:bg-card-dark border-t border-slate-200 dark:border-slate-800 pb-safe">
      <div className="flex justify-around items-center h-16 w-full max-w-md mx-auto">
        {navItems.map((item) => {
          const href = `/events/${eventSlug}/${item.path}`;
          const isActive = pathname?.includes(`/${item.path}`);

          return (
            <Link
              key={item.path}
              href={href}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors relative ${
                isActive
                  ? "text-primary"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <span className="material-icons">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.path === "chats" && unreadCount > 0 && (
                <span className="absolute top-0 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-card-dark" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
