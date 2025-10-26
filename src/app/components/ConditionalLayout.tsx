'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current route is under /auth (login, signup, forgot-password, etc.)
  const isAuthRoute = pathname?.startsWith('/auth');

  // For auth routes, render children without Sidebar/TopNav
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // For all other routes, render with Sidebar and TopNav
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 bg-neutral-50 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
