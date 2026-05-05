import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const DoctorLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim()) {
      return setError('Email and password cannot be empty')
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('http://localhost:5000/api/doctors/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials')
      }

      // Store token on success
      localStorage.setItem('session', JSON.stringify(data.session))

      // 🔥 trigger re-check in App.jsx
      window.dispatchEvent(new Event('authStateChange'))

      navigate('/doctor-dashboard')
    } catch (err) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#f5f9ff] dark:bg-[#0f172a] transition-colors duration-300">
      <div className="w-full max-w-md p-8 bg-white dark:bg-[#1e293b] rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-none border-0 transition-colors duration-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Doctor Portal</h1>
          <p className="text-slate-500 dark:text-slate-400">Sign in to manage your appointments</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="doctor@hospital.com"
              className="w-full px-4 py-3 bg-[#f1f5f9] dark:bg-[#334155] border border-transparent rounded-[10px] focus:bg-white dark:focus:bg-[#1e293b] focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#f1f5f9] dark:bg-[#334155] border border-transparent rounded-[10px] focus:bg-white dark:focus:bg-[#1e293b] focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-[10px] shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Not registered?{' '}
          <Link to="/doctor-signup" className="font-semibold text-primary hover:text-primary-hover transition-colors">
            Register as Doctor
          </Link>
        </p>
        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
          Are you a patient?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
            Patient Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default DoctorLogin
