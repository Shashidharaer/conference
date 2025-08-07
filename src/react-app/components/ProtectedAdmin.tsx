import { useState, useEffect } from 'react';
import { LogOut, Shield } from 'lucide-react';
import AdminLogin from './AdminLogin';
import AdminPage from '../pages/Admin';

export default function ProtectedAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Session timeout (24 hours)
  const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const authStatus = localStorage.getItem('adminAuth');
    const authTime = localStorage.getItem('adminAuthTime');

    if (authStatus === 'authenticated' && authTime) {
      const timeElapsed = Date.now() - parseInt(authTime);

      if (timeElapsed < SESSION_TIMEOUT) {
        setIsAuthenticated(true);
      } else {
        // Session expired
        logout();
      }
    }

    setIsLoading(false);
  };

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
  };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminAuthTime');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="relative">
      {/* Admin Header with Logout */}
      <div className="bg-red-50 border-b border-red-200 p-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-base font-medium text-red-800">
              Administrative Access - Authorized Personnel Only
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-base font-medium"
          >
            <LogOut className="w-3 h-3 mr-1" />
            Logout
          </button>
        </div>
      </div>

      {/* Admin Dashboard */}
      <AdminPage />
    </div>
  );
}
