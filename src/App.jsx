import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { getSession } from './services/auth'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import PatientDashboard from './pages/PatientDashboard'
import LandingPage from './pages/LandingPage'
import AppointmentPage from './pages/AppointmentPage'
import ThemeToggle from './components/ThemeToggle'
import DoctorDashboard from './pages/DoctorDashboard'
import DoctorLogin from './pages/DoctorLogin'
import DoctorSignup from './pages/DoctorSignup'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const activeSession = await getSession();
        setSession(activeSession);
      } catch (error) {
        console.error("Session check failed", error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    // Initial check
    checkSession();

    // Listen for custom auth events (same window)
    window.addEventListener('authStateChange', checkSession);
    
    // Listen for storage changes (cross-tab)
    const handleStorageChange = (e) => {
      if(e.key === 'session') {
        checkSession();
      }
    }
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('authStateChange', checkSession);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        <ThemeToggle />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <Routes>
          <Route 
            path="/login" 
            element={!session ? <LoginPage /> : <Navigate to={session?.user?.role === 'doctor' ? '/doctor-dashboard' : '/dashboard'} replace />} 
          />
          <Route 
            path="/register" 
            element={!session ? <RegisterPage /> : <Navigate to={session?.user?.role === 'doctor' ? '/doctor-dashboard' : '/dashboard'} replace />} 
          />
          <Route 
            path="/dashboard" 
            element={session ? <PatientDashboard /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/appointment" 
            element={session ? <AppointmentPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/doctor-login" 
            element={!session ? <DoctorLogin /> : <Navigate to={session?.user?.role === 'doctor' ? '/doctor-dashboard' : '/dashboard'} replace />} 
          />
          <Route 
            path="/doctor-signup" 
            element={!session ? <DoctorSignup /> : <Navigate to={session?.user?.role === 'doctor' ? '/doctor-dashboard' : '/dashboard'} replace />} 
          />
          <Route 
            path="/doctor-dashboard" 
            element={session ? <DoctorDashboard /> : <Navigate to="/doctor-login" replace />} 
          />
          <Route 
            path="/" 
            element={<LandingPage />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
