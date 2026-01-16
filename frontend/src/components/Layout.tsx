import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Users, UserCircle, Building } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">RealEstate Pro</h1>
        </div>
        <nav className="px-4 space-y-2 mt-4">
          <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          
          {isAdmin && (
            <>
              <div className="px-4 py-2 text-gray-500 text-sm font-bold uppercase mt-6">Admin</div>
              <Link to="/admin/agents" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <Users size={20} />
                <span>Agents</span>
              </Link>
              <Link to="/admin/properties" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <Building size={20} />
                <span>All Properties</span>
              </Link>
            </>
          )}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <Link to="/profile" className="flex items-center space-x-2 px-4 py-2 mb-2 hover:bg-gray-100 rounded-md">
            <UserCircle size={20} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
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