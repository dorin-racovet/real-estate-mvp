import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, LayoutDashboard, Users, UserCircle, Building, Moon, Sun } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">RealEstate Pro</h1>
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all border-2 ${
              theme === 'light' 
                ? 'bg-gray-900 hover:bg-gray-800 border-gray-700' 
                : 'bg-white hover:bg-gray-100 border-gray-300'
            }`}
          >
            {theme === 'light' ? <Moon className="text-white" size={18} /> : <Sun className="text-gray-900" size={18} />}
          </button>
        </div>
        <nav className="px-4 space-y-2 mt-4">
          <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          
          {isAdmin && (
            <>
              <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm font-bold uppercase mt-6">Admin</div>
              <Link to="/admin/agents" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                <Users size={20} />
                <span>Agents</span>
              </Link>
              <Link to="/admin/properties" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                <Building size={20} />
                <span>All Properties</span>
              </Link>
            </>
          )}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t dark:border-gray-700">
          <Link to="/profile" className="flex items-center space-x-2 px-4 py-2 mb-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            <UserCircle size={20} className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};