import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDoctorQueue = async () => {
    try {
      const sessionStr = localStorage.getItem('session');
      if (!sessionStr) {
        navigate('/doctor-login');
        return;
      }
      const sessionObj = JSON.parse(sessionStr);
      const token = sessionObj?.access_token;

      if (!token || sessionObj?.user?.role !== 'doctor') {
        navigate('/doctor-login');
        return;
      }

      const response = await fetch(`${API_URL}/appointments/doctor`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setAppointments(data.data.appointments);
      } else {
        throw new Error(data.message || 'Failed to fetch appointments');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorQueue();
    // Real-time update every 3 seconds
    const interval = setInterval(() => {
      fetchDoctorQueue();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [navigate]);

  const handleComplete = async (id) => {
    try {
      const sessionStr = localStorage.getItem('session');
      const sessionObj = JSON.parse(sessionStr);
      const token = sessionObj?.access_token;

      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'completed' })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      fetchDoctorQueue();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSkip = async (id) => {
    try {
      const sessionStr = localStorage.getItem('session');
      const sessionObj = JSON.parse(sessionStr);
      const token = sessionObj?.access_token;

      const response = await fetch(`${API_URL}/appointments/skip/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to skip patient');
      }

      fetchDoctorQueue();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCallNext = async () => {
    if (appointments.length > 0) {
      await handleComplete(appointments[0]._id);
      if (appointments.length > 1) {
        const nextPatient = appointments[1];
        toast.info(`Calling Next: ${nextPatient.name} (Token #${nextPatient.tokenNumber})`, {
          icon: "👨‍⚕️",
          style: {
            background: "var(--color-primary, #3b82f6)",
            color: "white",
            fontWeight: "bold"
          }
        });
      } else {
        toast.success("Queue is empty. Great job!", {
          icon: "🎉",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f9ff] dark:bg-[#0f172a] transition-colors duration-300">
        <Navbar />
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const activeAppointment = appointments.length > 0 ? appointments[0] : null;
  const queue = appointments.length > 1 ? appointments.slice(1) : [];

  return (
    <div className="min-h-screen bg-[#f5f9ff] dark:bg-[#0f172a] transition-colors duration-300">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Doctor Dashboard</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Patient Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col h-full transition-colors">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Now Serving</h2>
              
              {activeAppointment ? (
                <div className="flex flex-col flex-grow text-center">
                  <div className="w-32 h-32 mx-auto bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6 border-4 border-primary/20">
                    <span className="text-4xl font-bold text-primary">#{activeAppointment.tokenNumber}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{activeAppointment.name}</h3>
                  <div className="flex flex-wrap items-center justify-center gap-3 text-slate-500 dark:text-slate-400 mb-6">
                    <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-sm">{activeAppointment.age} Yrs</span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-sm">{activeAppointment.gender}</span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-sm">{activeAppointment.phone}</span>
                  </div>

                  {activeAppointment.symptoms && (
                    <div className="text-left bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mb-6 flex-grow">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Symptoms:</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{activeAppointment.symptoms}</p>
                    </div>
                  )}

                  <div className="space-y-3 mt-auto pt-4">
                    <button 
                      onClick={() => handleComplete(activeAppointment._id)}
                      className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-sm transition-colors"
                    >
                      Mark as Completed
                    </button>
                    <button 
                      onClick={handleCallNext}
                      className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl shadow-sm transition-colors"
                    >
                      Call Next
                    </button>
                    <button 
                      onClick={() => handleSkip(activeAppointment._id)}
                      className="w-full py-3 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 font-semibold rounded-xl shadow-sm transition-colors"
                    >
                      Remove (No Show)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 py-12">
                  <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  <p>No patients in queue</p>
                </div>
              )}
            </div>
          </div>

          {/* Queue Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Waiting Queue</h2>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {queue.length} Waiting
                </span>
              </div>

              {queue.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
                  <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Token</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient Info</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Symptoms</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-[#1e293b] divide-y divide-slate-100 dark:divide-slate-800">
                      {queue.map((apt) => (
                        <tr key={apt._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                              #{apt.tokenNumber}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-slate-900 dark:text-white">{apt.name}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">{apt.age}y • {apt.gender}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-xs" title={apt.symptoms}>
                              {apt.symptoms || '-'}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  The queue is currently empty.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
