import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, LayoutDashboard, User, ClipboardList, Calendar, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { img } from '@/lib/utils'

const navLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Mis Datos', path: '/dashboard/datos', icon: User },
  { label: 'Plan Nutricional', path: '/dashboard/plan', icon: ClipboardList },
  { label: 'Reservas', path: '/dashboard/reservas', icon: Calendar },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-nutri-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-[rgba(74,124,89,0.08)] flex flex-col transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[rgba(74,124,89,0.08)]">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-nutri-primary" strokeWidth={2} />
            <span className="font-display font-bold text-lg text-nutri-primary">NutriVida</span>
          </Link>
        </div>

        {/* User info */}
        <div className="p-6 border-b border-[rgba(74,124,89,0.08)]">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar ? img(user.avatar) : img('/images/avatar-default.jpg')}
              alt={user?.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold text-sm text-[#2D3436]">{user?.name || 'Paciente'}</div>
              <div className="text-xs text-[#636E72] capitalize">{user?.role === 'admin' ? 'Administrador' : 'Paciente'}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(link.path)
                  ? 'bg-[rgba(74,124,89,0.1)] text-nutri-primary'
                  : 'text-[#636E72] hover:bg-[rgba(74,124,89,0.05)] hover:text-nutri-primary'
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[rgba(74,124,89,0.08)]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#636E72] hover:bg-[rgba(74,124,89,0.05)] hover:text-nutri-primary transition-all duration-200 w-full"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-[rgba(74,124,89,0.08)] px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-[#636E72] hover:text-nutri-primary transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-display font-semibold text-nutri-primary">NutriVida</span>
          <div className="w-10" />
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
