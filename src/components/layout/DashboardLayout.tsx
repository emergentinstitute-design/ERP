'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  LogOut,
  Menu,
  Search,
  Bell,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

import { navigationByRole } from '@/lib/navigation';
import type { Role } from '@/lib/permissions';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

type Props = {
  children: React.ReactNode;
  role?: Role;
  userName?: string;
};

export default function DashboardLayout({
  children,
  role = 'teacher',
  userName = 'Dashboard User',
}: Props) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const pathname = usePathname();

  const router = useRouter();

  const supabase = createBrowserSupabaseClient();
  const menuGroups = navigationByRole[role];

  const handleLogout = async () => {
    await supabase.auth.signOut();

    router.push('/login');

    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 font-sans">
      {/* SIDEBAR */}
      <aside
        className={`${
          isSidebarOpen ? 'w-72' : 'w-22'
        } bg-white border-r border-slate-200 transition-all duration-300 flex flex-col sticky top-0 h-screen z-50`}
      >
        {/* LOGO */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <GraduationCap size={20} strokeWidth={2.5} />
          </div>

          {isSidebarOpen && (
            <span className="ml-3 font-bold text-lg tracking-tight text-slate-800">
              KLASS<span className="text-blue-600">MATE</span>
            </span>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuGroups.map((group) => (
            <div key={group.group} className="mb-6">
              {isSidebarOpen && (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3 ml-3">
                  {group.group}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map((item: any) => (
                  <NavItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    isOpen={isSidebarOpen}
                    active={pathname === item.href}
                    href={item.href}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full p-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
          >
            <LogOut
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />

            {isSidebarOpen && (
              <span className="font-semibold text-sm text-slate-600 group-hover:text-red-600">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOPBAR */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
            >
              <Menu size={20} />
            </button>

            <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>

            <div className="hidden md:block">
              <h2 className="text-sm font-medium text-slate-500">
                Welcome Back,
                <span className="ml-1 text-slate-900 font-bold capitalize">
                  {userName}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-5">
            {/* SEARCH */}
            <div className="relative hidden lg:block group">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search records..."
                className="bg-slate-100 border border-transparent rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-200 w-80 transition-all outline-none"
              />
            </div>

            {/* PROFILE */}
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl relative transition-all group">
                <Bell
                  size={20}
                  className="group-hover:rotate-12 transition-transform"
                />

                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
              </button>

              <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

              <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                  <p className="text-[11px] font-bold text-slate-900 leading-tight capitalize">
                    {userName}
                  </p>

                  <p
                    className={`text-[9px] font-bold uppercase tracking-tighter ${
                      role === 'master'
                        ? 'text-purple-600'
                        : role === 'admin'
                        ? 'text-blue-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {role}
                  </p>
                </div>

                <div
                  className={`w-10 h-10 text-white rounded-xl flex items-center justify-center font-bold shadow-lg ring-4 ring-slate-50 uppercase ${
                    role === 'master'
                      ? 'bg-purple-700'
                      : role === 'admin'
                      ? 'bg-blue-600'
                      : 'bg-emerald-600'
                  }`}
                >
                  {userName?.slice(0, 2)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-6 lg:p-10 flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  isOpen,
  active,
  href,
}: {
  icon: any;
  label: string;
  isOpen: boolean;
  active: boolean;
  href: string;
}) {
  return (
    <Link href={href}>
      <div
        className={`
          flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 group
          ${
            active
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 font-medium scale-[1.02]'
              : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700'
          }
        `}
      >
        <div className="flex items-center space-x-3">
          <Icon
            size={20}
            strokeWidth={active ? 2.5 : 2}
            className={
              active ? '' : 'group-hover:scale-110 transition-transform'
            }
          />

          {isOpen && (
            <span className="text-[13px] font-semibold whitespace-nowrap tracking-tight">
              {label}
            </span>
          )}
        </div>

        {isOpen && active && (
          <ChevronRight size={14} className="opacity-70" />
        )}
      </div>
    </Link>
  );
}