import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '../services/auth';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playNote = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.5, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playNote(523.25, now, 0.4); // C5
    playNote(659.25, now + 0.2, 0.6); // E5
  } catch (err) {
    console.error("Audio playback failed", err);
  }
};

const isPastAppointment = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const apptDate = new Date(dateString);
  apptDate.setHours(0, 0, 0, 0);
  return apptDate < today;
};

const getDisplayStatus = (appt) => {
  if (appt.status === 'waiting') {
    if (isPastAppointment(appt.createdAt)) {
      return { text: 'Not Completed', colorClass: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' };
    }
    return { text: 'Waiting', colorClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' };
  }
  if (appt.status === 'completed') {
    return { text: 'Completed', colorClass: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' };
  }
  if (appt.status === 'skipped') {
    return { text: 'No Show', colorClass: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
  }
  return { text: appt.status.charAt(0).toUpperCase() + appt.status.slice(1), colorClass: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' };
};

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [queueInfo, setQueueInfo] = useState(null);
  const [fetchingQueue, setFetchingQueue] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchQueueStatus = async (appointmentId, accessToken) => {
    try {
      setFetchingQueue(true);
      const res = await fetch(`${API_URL}/appointments/queue/${appointmentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setQueueInfo(data.data);
      }
    } catch (error) {
      console.error('Error fetching queue status:', error);
    } finally {
      setFetchingQueue(false);
    }
  };

  const prevPositionRef = useRef(null);

  useEffect(() => {
    if (queueInfo) {
      if (queueInfo.position === 1 && prevPositionRef.current !== 1 && prevPositionRef.current !== null) {
        playNotificationSound();
        toast.success("It's your turn! Please proceed to the doctor's cabin.", {
          icon: "🩺",
          autoClose: 10000,
          style: {
            background: "var(--color-primary, #10b981)",
            color: "white",
            fontWeight: "bold"
          }
        });
      }
      prevPositionRef.current = queueInfo.position;
    }
  }, [queueInfo]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const sessionStr = localStorage.getItem('session');
        if (!sessionStr) {
          navigate('/login');
          return;
        }
        const session = JSON.parse(sessionStr);
        if (loading) setUser(session.user);

        // Fetch My Appointments
        const res = await fetch(`${API_URL}/appointments/my`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          const fetchedAppointments = data.data.appointments || [];
          setAppointments(fetchedAppointments);
          
          if (fetchedAppointments.length > 0 && fetchedAppointments[0].status === 'waiting') {
            if (!isPastAppointment(fetchedAppointments[0].createdAt)) {
              await fetchQueueStatus(fetchedAppointments[0]._id, session.access_token);
            }
          }
        }
      } catch (error) {
        console.error('Dashboard polling error:', error);
      } finally {
        if (loading) setLoading(false);
      }
    };

    fetchPatientData();
    
    // Real-time update every 3 seconds
    const interval = setInterval(() => {
      fetchPatientData();
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f9ff] dark:bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // The first item is physically the newest/latest if sorted properly from the backend. 
  const latestAppointment = appointments.length > 0 ? appointments[0] : null;

  return (
    <div className="min-h-screen bg-[#f5f9ff] dark:bg-[#0f172a] transition-colors duration-300">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user?.name || user?.email?.split('@')[0]}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your queue and track your upcoming appointments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Latest Appointment */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
              Your Latest Appointment
            </h2>
            
            {latestAppointment ? (
              <div className="p-6 sm:p-8 bg-white dark:bg-[#1e293b] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors">
                <div className="flex flex-col gap-8">
                  {/* Token & Status Section */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-stretch">
                    <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-800 rounded-2xl p-6 text-center w-full">
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Token No.</p>
                      <div className="text-5xl font-black text-blue-700 dark:text-blue-500">
                        #{latestAppointment.tokenNumber}
                      </div>
                    </div>

                    {latestAppointment.status === 'waiting' && !isPastAppointment(latestAppointment.createdAt) && queueInfo && (
                      <div className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-800 rounded-2xl p-4 text-center relative overflow-hidden group w-full flex flex-col justify-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/50 to-teal-50/50 dark:from-emerald-800/30 dark:to-teal-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10 flex justify-between items-center mb-2">
                          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Live Position</p>
                          <button 
                            onClick={() => fetchQueueStatus(latestAppointment._id, user?.token || localStorage.getItem('token'))}
                            disabled={fetchingQueue}
                            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 p-1 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-800/50 transition-colors"
                            title="Refresh Status"
                          >
                            <svg className={`w-4 h-4 ${fetchingQueue ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                          </button>
                        </div>
                        <div className="text-3xl font-black text-emerald-700 dark:text-emerald-500 mb-2">
                          {queueInfo.position === 1 ? 'Now' : `#${queueInfo.position}`}
                        </div>
                        <div className="bg-emerald-100/50 dark:bg-emerald-800/40 rounded-lg p-2 text-xs font-medium text-emerald-800 dark:text-emerald-300">
                          Est. wait: <span className="font-bold">{queueInfo.estimatedWaitTime} mins</span>
                        </div>
                      </div>
                    )}

                    {latestAppointment.status === 'skipped' && (
                      <div className="flex-1 bg-red-50 dark:bg-red-900/20 border-2 border-red-100 dark:border-red-800 rounded-2xl p-4 text-center w-full flex flex-col justify-center">
                        <div className="text-red-600 dark:text-red-400 font-bold mb-1">
                          <svg className="w-8 h-8 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                          No Show
                        </div>
                        <div className="text-sm text-red-800 dark:text-red-300">
                          Removed from queue
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Details Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Department</p>
                      <p className="font-medium text-slate-900 dark:text-white mt-1">{latestAppointment.department}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Doctor</p>
                      <p className="font-medium text-slate-900 dark:text-white mt-1">{latestAppointment.doctor}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Status</p>
                      <span className={`inline-flex mt-1 items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDisplayStatus(latestAppointment).colorClass}`}>
                        {getDisplayStatus(latestAppointment).text}
                      </span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Date</p>
                      <p className="font-medium text-slate-900 dark:text-white mt-1">
                        {new Date(latestAppointment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-6xl mb-4">🏥</div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No active appointments</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Book an appointment to see it here.</p>
                <button 
                  onClick={() => navigate('/appointment')}
                  className="inline-flex py-2.5 px-5 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg shadow transition-colors"
                 >
                  Book Appointment
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Appointment History */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-slate-400 dark:bg-slate-600 rounded-full inline-block"></span>
              Past Appointments
            </h2>
            
            <div className="flex flex-col gap-4">
              {appointments.slice(1).length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-slate-500 dark:text-slate-400">No past appointments found.</p>
                </div>
              ) : (
                appointments.slice(1).map((appt) => (
                  <div key={appt._id} className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{appt.department}</span>
                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{appt.doctor}</h4>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-lg px-3 py-1 rounded-lg">
                        #{appt.tokenNumber}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-medium">{new Date(appt.createdAt).toLocaleDateString()}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getDisplayStatus(appt).colorClass}`}>
                        {getDisplayStatus(appt).text}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
