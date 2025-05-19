
import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { TaskProvider } from '@/contexts/TaskContext';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const EmployeeDashboardPage = lazy(() => import('@/pages/EmployeeDashboardPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white"></div>
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();


  useEffect(() => {
    // This effect handles redirection after loading and auth state are determined.
    if (!loading) {
      const publicPaths = ['/', '/login'];
      const isPublicPath = publicPaths.includes(location.pathname);

      if (isAuthenticated && location.pathname === '/login') {
        // If authenticated and on login page, redirect based on role
        if (user?.role === 'admin') {
          Navigate({ to: '/admin', replace: true });
        } else if (user?.role === 'employee') {
          Navigate({ to: '/employee', replace: true });
        } else {
          Navigate({ to: '/', replace: true }); // Fallback, though role should exist
        }
      } else if (!isAuthenticated && !isPublicPath) {
        // If not authenticated and trying to access a protected page, redirect to login
        Navigate({ to: '/login', replace: true });
      }
    }
  }, [isAuthenticated, user, loading, location.pathname]);


  if (loading) {
    return <LoadingFallback />;
  }
  
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route 
            path="/login" 
            element={
                isAuthenticated ? (
                    user?.role === 'admin' ? <Navigate to="/admin" replace /> :
                    user?.role === 'employee' ? <Navigate to="/employee" replace /> :
                    <Navigate to="/" replace />
                ) : <LoginPage />
            } 
        />
        
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
          <Route path="/employee" element={<EmployeeDashboardPage />} />
        </Route>
        
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <Suspense fallback={<LoadingFallback />}>
            <AppRoutes />
          </Suspense>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
  