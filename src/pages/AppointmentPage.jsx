import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AppointmentPage = () => {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male', // Default required enum
    phone: '',
    department: 'General', // Default to first dropdown option
    doctor: '',
    symptoms: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [doctorsList, setDoctorsList] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${API_URL}/doctors?department=${formData.department}`);
        const data = await response.json();
        if (response.ok) {
          setDoctorsList(data.data.doctors);
          if (data.data.doctors.length > 0) {
            setFormData(prev => ({ ...prev, doctor: data.data.doctors[0].name }));
          } else {
            setFormData(prev => ({ ...prev, doctor: '' }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch doctors', error);
      }
    };

    fetchDoctors();
  }, [formData.department]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Get session from local storage
      const sessionStr = localStorage.getItem('session');
      if (!sessionStr) {
        throw new Error('No session found. Please log in again.');
      }
      
      const sessionObj = JSON.parse(sessionStr);
      const token = sessionObj?.access_token;
      
      if (!token) {
        throw new Error('Invalid session. Please log in again.');
      }

      // 2. Make API Call
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age), // ensure age is a number
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to book appointment');
      }

      // 3. Navigate straight to dashboard
      navigate('/dashboard');

    } catch (err) {
      if (err.message.includes('log in again')) {
         navigate('/login');
      } else {
         setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f9ff] dark:bg-[#0f172a] transition-colors duration-300 relative">
      <Navbar />
      <div className="flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-2xl p-8 bg-white dark:bg-[#1e293b] rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-300">
          
          <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Book Appointment</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleBookAppointment} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-[#f1f5f9] dark:bg-[#334155] border border-transparent rounded-[10px] focus:bg-white dark:focus:bg-[#1e293b] focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                required
              />
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="age">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="25"
                  className="w-full px-4 py-3 bg-[#f1f5f9] dark:bg-[#334155] border border-transparent rounded-[10px] focus:bg-white dark:focus:bg-[#1e293b] focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="gender">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#f1f5f9] dark:bg-[#334155] border border-transparent rounded-[10px] focus:bg-white dark:focus:bg-[#1e293b] focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
                className="w-full px-4 py-3 bg-[#f1f5f9] dark:bg-[#334155] border border-transparent rounded-[10px] focus:bg-white dark:focus:bg-[#1e293b] focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                required
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="department">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f1f5f9] dark:bg-[#334155] border border-transparent rounded-[10px] focus:bg-white dark:focus:bg-[#1e293b] focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all text-slate-900 dark:text-white"
                required
              >
                <option value="General">General</option>
                <option value="Dental">Dental</option>
                <option value="Eye">Eye</option>
                <option value="Orthopedic">Orthopedic</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="doctor">
                Doctor Name <span className="text-red-500">*</span>
              </label>
              <select
                id="doctor"
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f1f5f9] dark:bg-[#334155] border border-transparent rounded-[10px] focus:bg-white dark:focus:bg-[#1e293b] focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all text-slate-900 dark:text-white disabled:opacity-50"
                required
                disabled={doctorsList.length === 0}
              >
                {doctorsList.length > 0 ? (
                  doctorsList.map((doc) => (
                    <option key={doc._id} value={doc.name}>
                      {doc.name}
                    </option>
                  ))
                ) : (
                  <option value="">No doctors available for this department</option>
                )}
              </select>
            </div>

            {/* Symptoms */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="symptoms">
                Symptoms
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="Briefly describe your symptoms..."
                rows="3"
                className="w-full px-4 py-3 bg-[#f1f5f9] dark:bg-[#334155] border border-transparent rounded-[10px] focus:bg-white dark:focus:bg-[#1e293b] focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all resize-none text-slate-900 dark:text-white"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-[10px] shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 text-lg"
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
