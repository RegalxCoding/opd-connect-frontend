import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      return setError('All fields are required')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return setError('Please enter a valid email address')
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters')
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'User already exists')
      }

      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#f5f9ff] dark:bg-[#0f172a] transition-colors duration-300">
      <div className="w-full max-w-md p-8 bg-white dark:bg-[#1e293b] rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-none border-0 transition-colors duration-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400">Join us to manage your queue efficiently</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-lg text-sm text-green-600 dark:text-green-400">
            Account created successfully. Redirecting to login...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-[#f1f5f9] dark:bg-[#334155] border border-transparent rounded-[10px] focus:bg-white dark:focus:bg-[#1e293b] focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
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
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#f1f5f9] dark:bg-[#334155] border border-transparent rounded-[10px] focus:bg-white dark:focus:bg-[#1e293b] focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-[10px] shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading || success}
          >
            {loading ? 'Creating Account...' : 'Continue'}
          </button>
        </form>



        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
