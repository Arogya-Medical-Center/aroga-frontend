"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Props = {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  className?: string;
};

export default function TopNav({ user, className }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const defaultUser = {
    name: "Dr. Admin",
    email: "admin@healthcare.com",
    avatar: "/avatar.jpg",
  };

  const currentUser = user || defaultUser;

  return (
    <nav
      className={[
        "sticky top-0 z-20 bg-white border-b border-neutral-200 px-6 py-3",
        className || "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative h-10 w-20 rounded overflow-hidden">
            <Image
              src="/logo.jpg"
              alt="Aroga Healthcare Center Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="text-lg font-semibold text-neutral-900">
            Aroga Healthcare Center
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-300 rounded-lg bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side: Notifications + Profile */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            onClick={() => router.push("/notification")}
          >
            <BellIcon />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-3 border-l border-neutral-300">
            <div className="relative h-9 w-9 rounded-full overflow-hidden bg-neutral-200">
              {currentUser.avatar ? (
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-neutral-600 text-sm font-semibold">
                  {currentUser.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4 text-neutral-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      className="h-5 w-5 text-neutral-700"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14.857 17.657A2 2 0 0 1 13 19H11a2 2 0 0 1-1.857-1.343M6 8a6 6 0 1 1 12 0c0 3 1 4 1 6H5c0-2 1-3 1-6Z" />
    </svg>
  );
}