'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            {isSidebarOpen && <h1 className="font-bold text-blue-600">CRM</h1>}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              ☰
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
            <NavLink href="/dashboard" icon="📊" label="Dashboard" isOpen={isSidebarOpen} />
            <NavLink href="/dashboard/leads" icon="🎯" label="Khách hàng tiềm năng" isOpen={isSidebarOpen} />
            <NavLink href="/dashboard/deals" icon="🤝" label="Thương vụ" isOpen={isSidebarOpen} />
            <NavLink href="/dashboard/contacts" icon="👥" label="Liên hệ" isOpen={isSidebarOpen} />
            <NavLink href="/dashboard/tasks" icon="✓" label="Công việc" isOpen={isSidebarOpen} />
            <NavLink href="/dashboard/reports" icon="📈" label="Báo cáo" isOpen={isSidebarOpen} />
          </nav>

          {/* User Profile */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                </div>
              )}
            </div>

            {isSidebarOpen && (
              <button
                onClick={logout}
                className="mt-2 w-full bg-red-50 text-red-600 hover:bg-red-100 text-sm py-2 px-3 rounded-lg transition font-medium"
              >
                Đăng xuất
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Xin chào, {user?.firstName}!</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

interface NavLinkProps {
  href: string;
  icon: string;
  label: string;
  isOpen: boolean;
}

function NavLink({ href, icon, label, isOpen }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-gray-700 hover:text-gray-900"
    >
      <span className="text-xl">{icon}</span>
      {isOpen && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
}
