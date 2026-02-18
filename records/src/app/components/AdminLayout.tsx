import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Users,
  Truck,
  BarChart3,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/add-bill', icon: FileText, label: 'Add New Bill' },
    { path: '/admin/bills', icon: Receipt, label: 'Bill Records' },
    { path: '/admin/customers', icon: Users, label: 'Customer Records' },
    { path: '/admin/suppliers', icon: Truck, label: 'Supplier Records' },
    { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#FAFAF8]">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black border-r border-[#D4AF37]/20 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#D4AF37]/20">
          <h1 className="text-2xl tracking-widest text-[#D4AF37]">VISHAL</h1>
          <p className="text-xs text-[#F5E6D3]/70 tracking-wider mt-1">SELECTION</p>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? 'bg-[#D4AF37] text-black'
                    : 'text-[#F5E6D3] hover:bg-[#1A1A1A] hover:text-[#D4AF37]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-[#D4AF37]/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-[#F5E6D3] hover:bg-[#1A1A1A] hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="tracking-wide">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-[#D4AF37]/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-black hover:text-[#D4AF37] transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h2 className="text-xl text-black tracking-wide">
              {menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-black">Welcome back</p>
              <p className="text-xs text-[#D4AF37]">Admin</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
