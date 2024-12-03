import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  Package, 
  History, 
  Users, 
  BarChart3, 
  LogOut 
} from 'lucide-react';

export function Layout() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const navigation = [
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Transfers', href: '/transfers', icon: BarChart3 },
    { name: 'History', href: '/history', icon: History },
    { name: 'Users', href: '/users', icon: Users, adminOnly: true },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white h-screen shadow-lg">
          <div className="flex flex-col h-full">
            <div className="p-4">
              <h1 className="text-2xl font-bold text-gray-800">Mafirol</h1>
              <p className="text-sm text-gray-600">{user?.division}</p>
            </div>
            
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                if (item.adminOnly && user?.role !== 'ADMIN') return null;
                
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t">
              <button className="flex items-center text-red-600 hover:text-red-700">
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}