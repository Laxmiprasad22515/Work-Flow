
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, LayoutDashboard, Users, CheckSquare } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';

const Layout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
  ];

  if (isAuthenticated) {
    if (user?.role === 'admin') {
      navItems.push({ path: '/admin', label: 'Admin Dashboard', icon: <LayoutDashboard className="h-5 w-5 mr-2" /> });
    } else if (user?.role === 'employee') {
      navItems.push({ path: '/employee', label: 'My Tasks', icon: <CheckSquare className="h-5 w-5 mr-2" /> });
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white">
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-4 px-6 shadow-lg bg-white/10 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
            Work Flow
          </Link>
          <nav className="flex items-center space-x-4">
            {isAuthenticated && user && (
              <>
                <span className="text-sm hidden md:block">Welcome, {user.username} ({user.role})</span>
                <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/20">
                  <LogOut className="h-5 w-5 mr-2" /> Logout
                </Button>
              </>
            )}
            {!isAuthenticated && (
              <Button variant="ghost" onClick={() => navigate('/login')} className="text-white hover:bg-white/20">
                Login
              </Button>
            )}
          </nav>
        </div>
      </motion.header>
      
      <main className="flex-grow container mx-auto p-6">
        <Outlet />
      </main>

      <motion.footer 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="py-6 text-center bg-black/20 backdrop-blur-md"
      >
        <p className="text-sm text-gray-300">&copy; {new Date().getFullYear()} Work Flow. All rights reserved.</p>
      </motion.footer>
      <Toaster />
    </div>
  );
};

export default Layout;
  