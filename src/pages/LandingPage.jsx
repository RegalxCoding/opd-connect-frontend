import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-primary/30">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-950/90 shadow-sm backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
                +
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">OPD Connect</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors font-medium">Home</a>
              <a href="#features" className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors font-medium">How It Works</a>
            </div>
            <div className="flex items-center">
              <Link
                to="/login"
                className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Login & Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-24 pb-32 overflow-hidden bg-linear-to-b from-[#E3F2FD] to-white dark:from-slate-900 dark:to-slate-950">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Live Queue Management
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
                Smart OPD Appointment & <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-500">Queue System</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0">
                Book your OPD appointment online, receive a digital token, and track your queue position with estimated waiting time — all from your phone.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 text-lg flex items-center justify-center gap-2"
                >
                  Login & Book Appointment
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-lg lg:max-w-none relative perspective-1000">
              <div className="relative rounded-2xl bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-800 p-2 transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out">
                {/* Minimal mockup illustration */}
                <div className="rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 aspect-4/3 relative flex flex-col">
                  {/* Mock Navbar */}
                  <div className="h-12 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between bg-white dark:bg-slate-900">
                    <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">JD</div>
                  </div>
                  {/* Mock Content */}
                  <div className="p-6 flex-1 flex flex-col gap-4">
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 flex justify-between items-center">
                      <div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">CURRENT TOKEN</div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">#42</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500 mb-1">EST. TIME</div>
                        <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">15 mins</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2">Live Queue Overview</div>
                    <div className="flex-1 flex flex-col gap-2">
                      {[40, 41, 42].map((num, i) => (
                        <div key={num} className={`p-3 rounded-lg border flex justify-between items-center ${i === 2 ? 'bg-primary/10 border-primary text-primary' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}>
                          <div className="flex items-center gap-3">
                            <span className="font-bold">#{num}</span>
                            <span className="text-sm">{i === 0 ? 'Consulting' : i === 1 ? 'Next' : 'You'}</span>
                          </div>
                          {i === 0 && <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">Features</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Everything you need for a hassle-free OPD experience.</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Digital Token System</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Patients receive automatic token numbers after booking — no paper slips needed.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Live Queue Tracking</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                See your real-time queue position so you know exactly when to arrive.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Estimated Waiting Time</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                The system calculates expected consultation time based on patients ahead of you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-400">Three simple steps to skip the waiting room.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-linear-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>

            {/* Step 1 */}
            <div className="relative text-center z-10">
              <div className="w-20 h-20 mx-auto bg-white dark:bg-slate-900 border-4 border-[#E3F2FD] dark:border-slate-800 rounded-full shadow-md flex items-center justify-center mb-6 text-2xl font-bold text-primary">
                1
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Login to OPD Connect</h4>
              <p className="text-slate-600 dark:text-slate-400">Create an account or login to access the system.</p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center z-10">
              <div className="w-20 h-20 mx-auto bg-primary text-white border-4 border-[#E3F2FD] dark:border-slate-800 rounded-full shadow-md shadow-primary/30 flex items-center justify-center mb-6 text-2xl font-bold">
                2
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Book Appointment & Get Token</h4>
              <p className="text-slate-600 dark:text-slate-400">Select a doctor and receive your digital queue token instantly.</p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center z-10">
              <div className="w-20 h-20 mx-auto bg-white dark:bg-slate-900 border-4 border-[#E3F2FD] dark:border-slate-800 rounded-full shadow-md flex items-center justify-center mb-6 text-2xl font-bold text-primary">
                3
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Track Queue & Waiting Time</h4>
              <p className="text-slate-600 dark:text-slate-400">Monitor your position live and arrive right on time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-linear-to-r from-primary to-primary-hover text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to skip the waiting room?</h2>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of patients who book their OPD appointments online and track their queue live.
          </p>
          <Link
            to="/login"
            className="inline-flex px-8 py-4 bg-white text-primary hover:bg-slate-50 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
                +
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">OPD Connect</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
              Smart OPD management for modern clinics
            </p>
            <div className="w-full h-px bg-slate-200 dark:bg-slate-800 mb-8"></div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © 2026 OPD Connect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
