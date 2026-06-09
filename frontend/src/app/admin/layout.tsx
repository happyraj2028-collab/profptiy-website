'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Home, 
  FileText, 
  Settings, 
  Users, 
  LogOut, 
  ShieldAlert, 
  MessageSquare, 
  Bell, 
  Check, 
  Trash, 
  UserPlus 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, isAuthenticated, logout, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Notification States
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/forgot-password' || pathname === '/admin/reset-password';

  // Session guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, isLoginPage, router]);

  // Load notifications
  const fetchNotifications = async () => {
    if (isAuthenticated && !isLoginPage) {
      try {
        const list = await api.notifications.list();
        setNotifications(list);
        setUnreadCount(list.filter((n: any) => !n.read).length);
      } catch (err) {
        console.error('Failed to load notifications registry:', err);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 30 seconds for real-time updates
    const timer = setInterval(fetchNotifications, 30000);
    return () => clearInterval(timer);
  }, [isAuthenticated, pathname]);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.notifications.markRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNotif = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.notifications.delete(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading) {
    return (
      <div className="bg-luxury-obsidian min-h-screen flex items-center justify-center text-xs text-gray-500 font-light">
        Verifying security clearance...
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-luxury-obsidian min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-sm glassmorphism p-6 rounded-xl flex flex-col items-center">
          <ShieldAlert className="w-10 h-10 text-red-500 mb-3" />
          <h2 className="text-base font-semibold text-white">Access Violation</h2>
          <p className="text-xs text-gray-400 mt-2">You must sign in to access the administration registry.</p>
          <Link href="/admin/login" className="btn-gold px-6 py-2 rounded text-xs uppercase mt-5">Go to Login</Link>
        </div>
      </div>
    );
  }

  // Define sidebar menu options
  const menuItems = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, roleRequired: false },
    { name: 'Manage Listings', path: '/admin/properties', icon: <Home className="w-4 h-4" />, roleRequired: false },
    { name: 'Manage Leads / Inquiries', path: '/admin/leads', icon: <Users className="w-4 h-4" />, roleRequired: false },
    { name: 'Manage Blogs', path: '/admin/blogs', icon: <FileText className="w-4 h-4" />, roleRequired: false },
    { name: 'Manage Testimonials', path: '/admin/testimonials', icon: <MessageSquare className="w-4 h-4" />, roleRequired: false },
    { name: 'User Management', path: '/admin/users', icon: <UserPlus className="w-4 h-4" />, roleRequired: true }, // Restricted to ADMIN only
    { name: 'Website Settings (CMS)', path: '/admin/settings', icon: <Settings className="w-4 h-4" />, roleRequired: true }, // Restricted to ADMIN only
  ];

  return (
    <div className="bg-luxury-obsidian min-h-screen text-gray-200 flex flex-col md:flex-row">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0a0a0c] border-b md:border-b-0 md:border-r border-gold-500/10 p-6 flex flex-col shrink-0">
        {/* Brand header */}
        <div className="mb-8 border-b border-gold-500/5 pb-5">
          <Link href="/admin/dashboard" className="flex flex-col">
            <span className="text-xl font-serif font-semibold tracking-wider text-gold-500">
              PROFPITY ADMIN
            </span>
            <span className="text-[8px] font-sans tracking-[0.2em] text-gray-400 -mt-0.5 uppercase">
              Control Panel
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => {
            // Role-based permission check: If the item requires admin role and user is not admin, hide it
            if (item.roleRequired && !isAdmin) return null;

            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded text-xs tracking-wide transition-all ${
                  isActive
                    ? 'bg-gold-500/10 border-l-2 border-gold-500 text-gold-500 font-semibold'
                    : 'text-gray-400 hover:text-gold-500 hover:bg-luxury-charcoal/50'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile & logout */}
        <div className="border-t border-gold-500/5 pt-5 mt-auto flex flex-col gap-3">
          <div className="text-xs pl-2">
            <span className="text-gray-500 block">Active User:</span>
            <strong className="text-gray-300 font-medium">{user?.name}</strong>
            <span className="text-[10px] text-gold-500 block uppercase font-mono">{user?.role}</span>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded text-xs text-red-400 hover:bg-red-500/5 transition-all mt-2 w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main panel content area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-[#0a0a0c] border-b border-gold-500/10 py-4 px-6 md:px-10 flex items-center justify-between z-20">
          <div className="text-xs text-gray-400 font-light">
            Luxury Real Estate Control Registry
          </div>

          {/* Header Notification Bell Drawer */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 text-gray-400 hover:text-gold-500 transition-colors relative"
              aria-label="View notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-3 w-80 bg-luxury-charcoal border border-gold-500/20 rounded-xl shadow-2xl overflow-hidden z-30">
                <div className="p-3 bg-[#0a0a0c] border-b border-gold-500/10 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-200 uppercase tracking-wider">Alert Registry</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[10px] text-gold-500 hover:underline"
                    >
                      Read All
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-gold-500/5">
                  {notifications.length === 0 ? (
                    <p className="text-[10px] text-gray-500 text-center py-8 font-light">No notifications logged.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={async () => {
                          if (!n.read) await api.notifications.markRead(n.id);
                          setShowNotifMenu(false);
                          router.push('/admin/leads');
                        }}
                        className={`p-3 text-left transition-colors cursor-pointer hover:bg-luxury-obsidian flex gap-2.5 items-start ${
                          !n.read ? 'bg-gold-500/5' : ''
                        }`}
                      >
                        <div className="flex-grow">
                          <div className="text-[10px] font-semibold text-gray-200">{n.title}</div>
                          <p className="text-[9px] text-gray-400 font-light mt-0.5 line-clamp-2">{n.message}</p>
                          <span className="text-[8px] text-gray-500 font-mono mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 items-end shrink-0" onClick={(e) => e.stopPropagation()}>
                          {!n.read && (
                            <button
                              onClick={(e) => handleMarkAsRead(n.id, e)}
                              className="p-1 text-gold-500 hover:bg-gold-500/5 rounded"
                              title="Mark read"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDeleteNotif(n.id, e)}
                            className="p-1 text-red-400 hover:bg-red-500/5 rounded"
                            title="Clear Alert"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-grow p-6 md:p-10 max-h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
