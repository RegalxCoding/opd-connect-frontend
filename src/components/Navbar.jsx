import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from '../services/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const [isDoctor, setIsDoctor] = useState(false);

  useEffect(() => {
    const checkRole = () => {
      const sessionStr = localStorage.getItem('session');
      if (sessionStr) {
        try {
          const sessionObj = JSON.parse(sessionStr);
          setIsDoctor(sessionObj?.user?.role === 'doctor');
        } catch (e) {
          setIsDoctor(false);
        }
      } else {
        setIsDoctor(false);
      }
    };
    
    checkRole();
    window.addEventListener('authStateChange', checkRole);
    return () => window.removeEventListener('authStateChange', checkRole);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(); // This will clear session and dispatchauthStateChange
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback manual clearance just in case
      localStorage.removeItem('session');
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white dark:bg-[#1e293b] shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                +
              </div>
              <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">
                OPD Connect
              </span>
            </Link>
          </div>

          {/* Nav Links */}
          <div className="flex items-center space-x-4">
            {!isDoctor && (
              <Link 
                to="/" 
                className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Home
              </Link>
            )}
            <Link 
              to={isDoctor ? "/doctor-dashboard" : "/dashboard"} 
              className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Dashboard
            </Link>
            {!isDoctor && (
              <Link 
                to="/appointment" 
                className="px-4 py-2 rounded-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
              >
                Book Appointment
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
