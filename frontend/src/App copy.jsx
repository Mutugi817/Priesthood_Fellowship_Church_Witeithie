import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Moon, Sun, Phone, MapPin, Mail, 
  Heart, Calendar, Camera, User, LogOut, Edit, Trash2, Plus, 
  Clock, Info, Shield, Video, BookOpen, Send
} from 'lucide-react';


// --- MOCK DATABASE & API LAYER ---
// In a production environment, these would be replaced by fetch() calls to your Node.js/MySQL backend.
const initialDb = {
  settings: {
    topBarMessage: "Welcome to Priesthood Fellowship Church, Witeithie Branch. Join us this Sunday!",
  },
  events: [
    { id: '1', title: 'Annual Youth Conference', date: '2026-08-15', desc: 'A time of refreshing and empowerment for the youth.', img: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800' },
    { id: '2', title: 'Women of Valor Seminar', date: '2026-09-05', desc: 'Debora Women Ministry presents a day of prayer and teaching.', img: 'https://images.unsplash.com/photo-1544427920-c49ccf112450?auto=format&fit=crop&q=80&w=800' }
  ],
  sermons: [
    { id: '1', title: 'The Power of Faith - Apostle Consolata', videoId: 'dQw4w9WgXcQ' },
    { id: '2', title: 'Walking in Righteousness', videoId: 'jNQXAC9IVRw' }
  ],
  portfolio: [
    { id: '1', title: 'Sunday Worship Service', img: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800' },
    { id: '2', title: 'Community Outreach', img: 'https://images.unsplash.com/photo-1593113514090-67c29fb9ceec?auto=format&fit=crop&q=80&w=800' }
  ]
};

// --- MAIN APPLICATION COMPONENT ---
export default function App() {
  const [theme, setTheme] = useState('light');
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [db, setDb] = useState(initialDb);
  const [toast, setToast] = useState(null);

  // Theme toggle logic
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const showMessage = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Mock API updater
  const updateDb = (section, action, payload) => {
    setDb(prev => {
      const newDb = { ...prev };
      if (action === 'set') newDb[section] = payload;
      if (action === 'add') newDb[section] = [...newDb[section], { ...payload, id: Math.random().toString(36).substring(7) }];
      if (action === 'delete') newDb[section] = newDb[section].filter(item => item.id !== payload);
      return newDb;
    });
    showMessage(`Successfully updated ${section}!`);
  };

  // Render Engine
  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage db={db} />;
      case 'about': return <AboutPage />;
      case 'give': return <GivePage showMessage={showMessage} currentUser={currentUser} />;
      case 'sermons': return <SermonsPage db={db} />;
      case 'events': return <EventsPage db={db} />;
      case 'ministries': return <MinistriesPage />;
      case 'portfolio': return <PortfolioPage db={db} />;
      case 'contact': return <ContactPage showMessage={showMessage} />;
      case 'login': return <LoginPage setCurrentUser={setCurrentUser} setCurrentPage={setCurrentPage} showMessage={showMessage} />;
      case 'dashboard': return <Dashboard db={db} updateDb={updateDb} currentUser={currentUser} showMessage={showMessage} />;
      default: return <HomePage db={db} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded shadow-lg text-white font-medium animate-bounce ${toast.type === 'error' ? 'bg-red-600' : 'bg-[#004b87]'}`}>
          {toast.msg}
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-[#800000] text-white text-sm py-2 px-4 text-center flex justify-between items-center">
        <span className="hidden sm:inline">📞 +254 758 931 179 | 📍 Witeithie, Juja</span>
        <span className="flex-1 text-center font-medium animate-pulse">{db.settings.topBarMessage}</span>
        <button onClick={toggleTheme} className="p-1 hover:bg-white/20 rounded-full transition" title="Toggle Theme">
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} currentUser={currentUser} setCurrentUser={setCurrentUser} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}

// --- COMPONENTS ---

const Navbar = ({ currentPage, setCurrentPage, currentUser, setCurrentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'ministries', label: 'Ministries' },
    { id: 'sermons', label: 'Sermons' },
    { id: 'events', label: 'Events' },
    { id: 'portfolio', label: 'Gallery' },
    { id: 'give', label: 'Give' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNav = (id) => {
    setCurrentPage(id);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-slate-950 shadow-md border-b-4 border-[#004b87]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => handleNav('home')}>
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="w-12 h-12 bg-[#800000] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-[#004b87]">
                PFC
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl sm:text-2xl text-[#800000] dark:text-[#ff4d4d] leading-none uppercase tracking-tight">Priesthood</span>
                <span className="font-semibold text-sm sm:text-base text-[#004b87] dark:text-[#3399ff] leading-none uppercase">Fellowship Church</span>
              </div>
            </div>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`px-3 py-2 rounded-md text-sm font-bold uppercase transition-colors ${
                  currentPage === link.id 
                    ? 'bg-[#004b87] text-white' 
                    : 'text-slate-700 dark:text-slate-200 hover:text-[#800000] dark:hover:text-[#ff4d4d]'
                }`}
              >
                {link.label}
              </button>
            ))}
            {currentUser ? (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-300 dark:border-slate-700">
                <button onClick={() => handleNav('dashboard')} className="flex items-center gap-1 text-sm font-bold text-[#800000] dark:text-[#ff4d4d] hover:underline">
                  <Shield size={16}/> {currentUser.name}
                </button>
                <button onClick={() => {setCurrentUser(null); handleNav('home');}} className="p-2 text-slate-500 hover:text-red-600 rounded-full">
                  <LogOut size={18}/>
                </button>
              </div>
            ) : (
              <button onClick={() => handleNav('login')} className="ml-4 p-2 text-slate-500 hover:text-[#004b87] rounded-full">
                <User size={18}/>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 hover:text-[#800000]">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 shadow-xl border-t dark:border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`block w-full text-left px-3 py-4 rounded-md text-base font-bold uppercase ${
                  currentPage === link.id 
                    ? 'bg-[#004b87] text-white' 
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
            {currentUser ? (
              <div className="flex justify-between items-center px-3 py-4 border-t dark:border-slate-700">
                <button onClick={() => handleNav('dashboard')} className="font-bold text-[#800000] flex items-center gap-2">
                  <Shield size={18}/> Dashboard
                </button>
                <button onClick={() => {setCurrentUser(null); handleNav('home');}} className="text-red-600 font-bold flex items-center gap-2">
                  <LogOut size={18}/> Logout
                </button>
              </div>
            ) : (
              <button onClick={() => handleNav('login')} className="block w-full text-left px-3 py-4 text-[#800000] font-bold border-t dark:border-slate-700">
                Admin / Clergy Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const FacebookIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const YoutubeIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);

const Footer = ({ setCurrentPage }) => (
  <footer className="bg-slate-900 text-slate-300 pt-12 pb-6 border-t-4 border-[#800000]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#800000] rounded-full flex items-center justify-center text-white font-bold text-lg">PFC</div>
            <span className="font-extrabold text-white uppercase">Priesthood Fellowship</span>
          </div>
          <p className="text-sm mb-4">Witeithie Branch. Setting the mood of happiness in God through faith, fellowship, and the Word.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-slate-400 hover:text-white transition"><FacebookIcon size={20}/></a>
            <a href="#" className="text-slate-400 hover:text-white transition"><YoutubeIcon size={20}/></a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4 border-b-2 border-[#004b87] inline-block pb-1">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => setCurrentPage('about')} className="hover:text-[#3399ff] transition">About Us</button></li>
            <li><button onClick={() => setCurrentPage('ministries')} className="hover:text-[#3399ff] transition">Our Ministries</button></li>
            <li><button onClick={() => setCurrentPage('give')} className="hover:text-[#3399ff] transition">Give / Tithe</button></li>
            <li><button onClick={() => setCurrentPage('contact')} className="hover:text-[#3399ff] transition">Contact Us</button></li>
          </ul>
        </div>

        {/* Schedule */}
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-white font-bold text-lg mb-4 border-b-2 border-[#004b87] inline-block pb-1">Order of Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex justify-between border-b border-slate-700 py-1"><span>Sunday 1st Service</span> <span className="text-[#3399ff]">7:00 AM - 9:00 AM</span></div>
            <div className="flex justify-between border-b border-slate-700 py-1"><span>Sunday 2nd Service</span> <span className="text-[#3399ff]">9:00 AM - 1:30 PM</span></div>
            <div className="flex justify-between border-b border-slate-700 py-1"><span>Tuesday Office Hrs</span> <span className="text-[#3399ff]">7:00 AM - 10:00 AM</span></div>
            <div className="flex justify-between border-b border-slate-700 py-1"><span>Wed Midweek</span> <span className="text-[#3399ff]">5:00 PM - 8:00 PM</span></div>
            <div className="flex justify-between border-b border-slate-700 py-1"><span>Thursday Huduma</span> <span className="text-[#3399ff]">7:00 AM - 12:00 PM</span></div>
            <div className="flex justify-between border-b border-slate-700 py-1"><span>Kesha (1st Friday)</span> <span className="text-[#3399ff]">Overnight</span></div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center text-xs">
        <p>&copy; {new Date().getFullYear()} Priesthood Fellowship Church, Witeithie. All rights reserved.</p>
        <p className="mt-2 md:mt-0 text-slate-500">
          Developer Contact: <a href="tel:0115793480" className="text-slate-400 hover:text-white">0115793480</a>
        </p>
      </div>
    </div>
  </footer>
);

// --- PAGES ---

const HomePage = ({ db }) => {
  const leaders = [
    { name: "His Eminence Archbishop JJ Gitahi", role: "General Overseer", img: "https://images.unsplash.com/photo-1544367567-0f2fcb046ebf?auto=format&fit=crop&q=80&w=1200" },
    { name: "His Grace Bishop Mwangi Zakayo", role: "Diocesan Bishop", img: "https://images.unsplash.com/photo-1563583219468-1eb2216892bb?auto=format&fit=crop&q=80&w=1200" },
    { name: "Apostle Consolata Wambui", role: "Witeithie Branch Pastor", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200" }
  ];
  const [currentLeader, setCurrentLeader] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLeader(prev => (prev + 1) % leaders.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Slider */}
      <div className="relative h-[60vh] sm:h-[80vh] w-full overflow-hidden bg-slate-900">
        {leaders.map((leader, idx) => (
          <div 
            key={idx} 
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentLeader ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 bg-black/60 z-10" /> {/* Overlay */}
            <img src={leader.img} alt={leader.name} className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white uppercase tracking-wider mb-4 shadow-sm">
                Priesthood Fellowship Church
              </h1>
              <p className="text-xl sm:text-3xl text-white font-medium mb-8">Witeithie Branch</p>
              
              <div className="bg-[#800000]/90 backdrop-blur border border-[#800000] p-6 rounded-lg shadow-2xl transform translate-y-4 max-w-xl w-full">
                <p className="text-[#3399ff] font-bold text-sm tracking-widest uppercase mb-1">{leader.role}</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">{leader.name}</h2>
              </div>
            </div>
          </div>
        ))}
        {/* Slider Controls */}
        <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-2">
          {leaders.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentLeader(idx)} className={`w-3 h-3 rounded-full ${idx === currentLeader ? 'bg-[#3399ff]' : 'bg-white/50'}`} />
          ))}
        </div>
      </div>

      {/* Welcome Section */}
      <section className="py-16 px-4 max-w-5xl mx-auto text-center">
        <Heart className="mx-auto text-[#800000] mb-4" size={48} />
        <h2 className="text-3xl font-bold text-[#004b87] dark:text-[#3399ff] mb-6">Welcome to Your Father's House</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          At Priesthood Fellowship Church, we believe in the transformative power of God's love and the fellowship of believers. 
          Led by Apostle Consolata Wambui, the Witeithie branch is a vibrant family dedicated to raising a generation 
          that worships in truth and spirit. Come as you are, and experience a mood of happiness in God!
        </p>
      </section>

      {/* Services Section */}
      <section className="bg-slate-100 dark:bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#800000] dark:text-[#ff4d4d] inline-flex items-center gap-3">
              <Clock size={32}/> Order of Services
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard title="Sunday 1st Service" time="7:00 AM - 9:00 AM" desc="Early morning worship and the Word." icon={<Sun/>} />
            <ServiceCard title="Sunday 2nd Service" time="9:00 AM - 1:30 PM" desc="Main family service, praise, and powerful ministration." icon={<User/>} />
            <ServiceCard title="Tuesday Office" time="7:00 AM - 10:00 AM" desc="Counseling, prayers, and administrative office hours." icon={<Info/>} />
            <ServiceCard title="Wednesday Midweek" time="5:00 PM - 8:00 PM" desc="Midweek fellowship and deep Bible study." icon={<BookOpen/>} />
            <ServiceCard title="Thursday Huduma" time="7:00 AM - 12:00 PM" desc="Dedicated service for healing, deliverance and special needs." icon={<Heart/>} />
            <ServiceCard title="Monthly Kesha" time="1st Friday, Overnight" desc="All-night prayer, worship, and spiritual warfare." icon={<Moon/>} />
          </div>
        </div>
      </section>

      {/* Dynamic Events Preview */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#004b87] dark:text-[#3399ff] mb-10">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {db.events.slice(0, 2).map(event => (
            <div key={event.id} className="flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-700">
              <img src={event.img} alt={event.title} className="w-full sm:w-48 h-48 object-cover" />
              <div className="p-6 flex flex-col justify-center">
                <div className="text-[#800000] dark:text-[#ff4d4d] text-sm font-bold flex items-center gap-2 mb-2">
                  <Calendar size={16}/> {new Date(event.date).toLocaleDateString('en-GB')}
                </div>
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">{event.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ServiceCard = ({ title, time, desc, icon }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border-t-4 border-[#004b87] hover:shadow-lg transition-shadow">
    <div className="text-[#004b87] dark:text-[#3399ff] mb-4 bg-blue-50 dark:bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-[#800000] dark:text-[#ff4d4d]">{title}</h3>
    <div className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">{time}</div>
    <p className="text-slate-600 dark:text-slate-400 text-sm">{desc}</p>
  </div>
);

const AboutPage = () => {
  const clergy = [
    { name: "Apostle Consolata Wambui", role: "Branch Pastor / Presiding Minister", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
    { name: "Pastor Symon Njiru", role: "Associate Pastor", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" },
    { name: "Evangelist Mary Wanjiru", role: "Lead Evangelist", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400" },
    { name: "Pastor Partricia", role: "Pastoral Care", img: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=400" }
  ];

  return (
    <div className="animate-fade-in py-12 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-[#800000] dark:text-[#ff4d4d] mb-4">About Us</h1>
        <div className="w-24 h-1 bg-[#004b87] mx-auto"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-2xl font-bold text-[#004b87] dark:text-[#3399ff] mb-4">Our Vision & Mission</h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
            Priesthood Fellowship Church, Witeithie branch, operates under the spiritual covering of His Eminence Archbishop JJ Gitahi and His Grace Bishop Mwangi Zakayo. We are a Bible-believing church committed to teaching the undiluted word of God, winning souls, and preparing the bride of Christ for His return.
          </p>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            Our mission is to establish a royal priesthood of believers who are empowered spiritually, socially, and economically to impact their generation.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
          <img src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800" alt="Church Congregation" className="w-full h-auto" />
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-center text-[#800000] dark:text-[#ff4d4d] mb-12">Meet Our Clergy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {clergy.map((person, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 text-center group hover:-translate-y-2 transition-transform duration-300">
              <div className="h-64 overflow-hidden">
                <img src={person.img} alt={person.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-[#004b87] dark:text-[#3399ff] mb-1">{person.name}</h3>
                <p className="text-[#800000] dark:text-[#ff4d4d] text-sm font-medium uppercase tracking-wider">{person.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const GivePage = ({ showMessage, currentUser }) => {
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleMpesaSubmit = (e) => {
    e.preventDefault();
    if (!amount || !phone) {
      showMessage("Please enter amount and phone number", "error");
      return;
    }
    setLoading(true);
    // Simulate API call to Node backend which would initiate Safaricom STK Push
    setTimeout(() => {
      setLoading(false);
      showMessage(`M-Pesa prompt sent to ${phone}. Please enter your PIN to complete the Ksh ${amount} donation.`);
      setAmount('');
    }, 2000);
  };

  return (
    <div className="animate-fade-in py-12 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <Heart className="mx-auto text-[#800000] mb-4" size={48} />
        <h1 className="text-4xl font-extrabold text-[#800000] dark:text-[#ff4d4d] mb-4">Partner With Us</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">Your generosity helps us spread the gospel and impact our community.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Manual Details */}
        <div className="bg-[#004b87] text-white rounded-2xl p-8 shadow-xl flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
            <Heart size={200} />
          </div>
          <h2 className="text-2xl font-bold mb-6 border-b border-white/20 pb-2">Manual Payment Details</h2>
          
          <div className="mb-6">
            <p className="text-blue-200 text-sm uppercase tracking-wide mb-1">M-Pesa Paybill</p>
            <p className="text-3xl font-mono font-bold">522522</p>
            <p className="text-blue-200 text-sm mt-2 uppercase tracking-wide">Account Number</p>
            <p className="text-xl font-mono font-bold">1336031433</p>
          </div>

          <div>
            <p className="text-blue-200 text-sm uppercase tracking-wide mb-1">Send Money (Phone)</p>
            <p className="text-2xl font-mono font-bold">0758 931179</p>
          </div>
        </div>

        {/* STK Push Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-[#800000] dark:text-[#ff4d4d] mb-2">Instant M-Pesa Giving</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Enter details to receive an instant payment prompt on your phone.</p>
          
          <form onSubmit={handleMpesaSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input 
                type="text" 
                placeholder="e.g. 0712345678"
                value={phone}
                onChange={(e) => setPhone(e.currentTarget.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#004b87] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (Ksh)</label>
              <input 
                type="number" 
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.currentTarget.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#004b87] outline-none transition"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-lg font-bold text-white transition flex justify-center items-center gap-2
                ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#18A558] hover:bg-[#128245] shadow-lg hover:shadow-xl'}`}
            >
              {loading ? (
                <><span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> Processing...</>
              ) : (
                <><Send size={20}/> Send to M-Pesa</>
              )}
            </button>
          </form>
          {!currentUser && (
             <p className="mt-4 text-xs text-center text-slate-500">Log in to save your giving details automatically.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const SermonsPage = ({ db }) => {
  return (
    <div className="animate-fade-in py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <Video className="mx-auto text-[#004b87] dark:text-[#3399ff] mb-4" size={48} />
        <h1 className="text-4xl font-extrabold text-[#800000] dark:text-[#ff4d4d] mb-4">Sermons & Messages</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">Watch and listen to powerful messages from our altars.</p>
      </div>

      {db.sermons.length === 0 ? (
        <div className="text-center text-slate-500 py-10">No sermons uploaded yet. Check back soon!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {db.sermons.map(sermon => (
            <div key={sermon.id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 flex flex-col">
              <div className="aspect-video relative bg-slate-800">
                 <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${sermon.videoId}`} 
                    title={sermon.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute inset-0"
                 ></iframe>
              </div>
              <div className="p-4 flex-grow flex items-center">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{sermon.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EventsPage = ({ db }) => {
  return (
    <div className="animate-fade-in py-12 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <Calendar className="mx-auto text-[#800000] dark:text-[#ff4d4d] mb-4" size={48} />
        <h1 className="text-4xl font-extrabold text-[#004b87] dark:text-[#3399ff] mb-4">Church Events</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">Join us in our upcoming gatherings and fellowships.</p>
      </div>

      <div className="space-y-8">
        {db.events.length === 0 ? (
          <div className="text-center text-slate-500 py-10">No upcoming events at the moment.</div>
        ) : (
          db.events.map(event => (
            <div key={event.id} className="flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 group hover:border-[#004b87] transition-colors">
              <div className="md:w-1/3 relative h-64 md:h-auto overflow-hidden">
                <img src={event.img} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-[#800000] text-white px-3 py-1 rounded font-bold text-sm shadow-md">
                  {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div className="md:w-2/3 p-8 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{event.title}</h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{event.desc}</p>
                <div className="mt-auto">
                  <button className="text-[#004b87] dark:text-[#3399ff] font-bold hover:underline flex items-center gap-2">
                    Mark Your Calendar <Calendar size={16}/>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const MinistriesPage = () => {
  const ministries = [
    { title: "Debora Women Ministry", desc: "Empowering women to be pillars in their homes, church, and society through prayer and fellowship.", img: "https://images.unsplash.com/photo-1544427920-c49ccf112450?auto=format&fit=crop&q=80&w=600" },
    { title: "Gedeons Men Ministry", desc: "Raising men of valor who lead by example, providing mentorship and spiritual covering.", img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=600" },
    { title: "Youth Ministry", desc: "A dynamic group for young adults focusing on purpose, purity, and passion for Christ.", img: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=600" },
    { title: "Sunday School", desc: "Laying a strong biblical foundation for children in a fun, safe, and engaging environment.", img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=600" }
  ];

  return (
    <div className="animate-fade-in py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-[#800000] dark:text-[#ff4d4d] mb-4">Our Ministries</h1>
        <div className="w-24 h-1 bg-[#004b87] mx-auto mb-4"></div>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Find your place in the body of Christ. We have a ministry for every age and stage of life.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {ministries.map((min, idx) => (
          <div key={idx} className="relative group rounded-2xl overflow-hidden shadow-xl aspect-[16/9]">
            <img src={min.img} alt={min.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-2xl font-bold text-white mb-2 transform group-hover:-translate-y-2 transition-transform duration-300">{min.title}</h3>
              <p className="text-slate-200 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                {min.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PortfolioPage = ({ db }) => {
  return (
    <div className="animate-fade-in py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <Camera className="mx-auto text-[#004b87] dark:text-[#3399ff] mb-4" size={48} />
        <h1 className="text-4xl font-extrabold text-[#800000] dark:text-[#ff4d4d] mb-4">Church Gallery</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">Capturing moments of grace, worship, and fellowship.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {db.portfolio.map(item => (
          <div key={item.id} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all aspect-square bg-slate-200 dark:bg-slate-800">
            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#800000]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
              <h3 className="text-white font-bold text-lg">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactPage = ({ showMessage }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    showMessage("Message sent successfully! We will get back to you soon.");
    e.currentTarget.reset();
  };

  return (
    <div className="animate-fade-in py-12 px-4 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="bg-[#800000] p-10 text-white flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-6">Get In Touch</h1>
            <p className="text-red-100 mb-10 leading-relaxed">
              We would love to hear from you. Whether you need prayer, have a question, or want to know more about our ministries, reach out!
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur"><MapPin/></div>
                <div>
                  <h4 className="font-bold">Location</h4>
                  <p className="text-red-100 text-sm">Witeithie Branch, Juja</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur"><Phone/></div>
                <div>
                  <h4 className="font-bold">Phone</h4>
                  <p className="text-red-100 text-sm">0115793480 / 0758 931179</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur"><Mail/></div>
                <div>
                  <h4 className="font-bold">Email</h4>
                  <p className="text-red-100 text-sm">info@priesthoodfellowship.org</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Name</label>
              <input required type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#004b87] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email or Phone</label>
              <input required type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#004b87] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
              <textarea required rows="4" className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#004b87] outline-none resize-none"></textarea>
            </div>
            <button type="submit" className="w-full py-4 rounded-lg font-bold text-white bg-[#004b87] hover:bg-[#003366] transition shadow-lg">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({ setCurrentUser, setCurrentPage, showMessage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate Backend Auth Check
    if (username === 'admin' && password === 'password') {
      setCurrentUser({ role: 'admin', name: 'System Admin' });
      showMessage("Welcome Admin!");
      setCurrentPage('dashboard');
    } else if (username === 'apostle' && password === 'password') {
      setCurrentUser({ role: 'apostle', name: 'Apostle Consolata' });
      showMessage("Welcome Apostle Consolata!");
      setCurrentPage('dashboard');
    } else {
      showMessage("Invalid credentials. Try admin/password or apostle/password", "error");
    }
  };

  return (
    <div className="animate-fade-in min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#800000] rounded-full mx-auto flex items-center justify-center text-white mb-4">
            <Shield size={32} />
          </div>
          <h2 className="text-2xl font-bold text-[#004b87] dark:text-[#3399ff]">Secure Portal</h2>
          <p className="text-sm text-slate-500">Clergy and Admin login</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
            <input 
              type="text" 
              required
              value={username} onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#800000] outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-[#800000] outline-none" 
            />
          </div>
          <button type="submit" className="w-full py-3 mt-4 rounded-lg font-bold text-white bg-[#800000] hover:bg-[#660000] transition">
            Login
          </button>
        </form>
        <div className="mt-6 text-xs text-center text-slate-400">
          <p>Test Accounts:</p>
          <p>Admin: admin / password</p>
          <p>Apostle: apostle / password</p>
        </div>
      </div>
    </div>
  );
};

// --- DASHBOARD (ADMIN & APOSTLE) ---
const Dashboard = ({ db, updateDb, currentUser, showMessage }) => {
  const [activeTab, setActiveTab] = useState('events');

  if (!currentUser) return <div className="p-10 text-center">Unauthorized. Please login.</div>;

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800 overflow-hidden sticky top-24">
          <div className="bg-[#004b87] p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-3">
              <User size={32} />
            </div>
            <h3 className="font-bold">{currentUser.name}</h3>
            <span className="text-xs bg-[#800000] px-2 py-1 rounded uppercase tracking-wider mt-2 inline-block">{currentUser.role}</span>
          </div>
          <div className="p-2 space-y-1">
            <DashTab id="events" current={activeTab} set={setActiveTab} icon={<Calendar size={18}/>} label="Manage Events" />
            <DashTab id="sermons" current={activeTab} set={setActiveTab} icon={<Video size={18}/>} label="Manage Sermons" />
            <DashTab id="portfolio" current={activeTab} set={setActiveTab} icon={<Camera size={18}/>} label="Gallery/Portfolio" />
            {isAdmin && <DashTab id="settings" current={activeTab} set={setActiveTab} icon={<Edit size={18}/>} label="Global Settings" />}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800 p-6 min-h-[500px]">
        {activeTab === 'events' && <DashEvents db={db} updateDb={updateDb} />}
        {activeTab === 'sermons' && <DashSermons db={db} updateDb={updateDb} />}
        {activeTab === 'portfolio' && <DashPortfolio db={db} updateDb={updateDb} />}
        {activeTab === 'settings' && isAdmin && <DashSettings db={db} updateDb={updateDb} />}
      </div>
    </div>
  );
};

const DashTab = ({ id, current, set, icon, label }) => (
  <button 
    onClick={() => set(id)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${current === id ? 'bg-[#004b87]/10 text-[#004b87] dark:bg-[#3399ff]/10 dark:text-[#3399ff]' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
  >
    {icon} {label}
  </button>
);

// Form sub-components for Dashboard
const DashEvents = ({ db, updateDb }) => {
  const [form, setForm] = useState({ title: '', date: '', desc: '', img: '' });
  
  const handleAdd = (e) => {
    e.preventDefault();
    updateDb('events', 'add', form);
    setForm({ title: '', date: '', desc: '', img: '' });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 dark:border-slate-700">Manage Events</h2>
      <form onSubmit={handleAdd} className="mb-8 grid gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border dark:border-slate-700">
        <h3 className="font-bold text-[#800000] dark:text-[#ff4d4d]">Add New Event</h3>
        <input required placeholder="Event Title" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="p-2 rounded border dark:bg-slate-900 dark:border-slate-700" />
        <div className="grid grid-cols-2 gap-4">
          <input required type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} className="p-2 rounded border dark:bg-slate-900 dark:border-slate-700" />
          <input required placeholder="Image URL" value={form.img} onChange={e=>setForm({...form, img: e.target.value})} className="p-2 rounded border dark:bg-slate-900 dark:border-slate-700" />
        </div>
        <textarea required placeholder="Description" value={form.desc} onChange={e=>setForm({...form, desc: e.target.value})} className="p-2 rounded border dark:bg-slate-900 dark:border-slate-700 resize-none" rows="3"></textarea>
        <button type="submit" className="bg-[#004b87] text-white py-2 rounded font-bold flex items-center justify-center gap-2"><Plus size={18}/> Add Event</button>
      </form>

      <div className="space-y-4">
        {db.events.map(ev => (
          <div key={ev.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
            <div>
              <h4 className="font-bold">{ev.title}</h4>
              <span className="text-sm text-slate-500">{ev.date}</span>
            </div>
            <button onClick={() => updateDb('events', 'delete', ev.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashSermons = ({ db, updateDb }) => {
  const [form, setForm] = useState({ title: '', videoId: '' });
  
  const handleAdd = (e) => {
    e.preventDefault();
    updateDb('sermons', 'add', form);
    setForm({ title: '', videoId: '' });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 dark:border-slate-700">Manage Sermons</h2>
      <form onSubmit={handleAdd} className="mb-8 grid gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border dark:border-slate-700">
        <h3 className="font-bold text-[#800000] dark:text-[#ff4d4d]">Add YouTube Sermon</h3>
        <input required placeholder="Sermon Title" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="p-2 rounded border dark:bg-slate-900 dark:border-slate-700" />
        <input required placeholder="YouTube Video ID (e.g., dQw4w9WgXcQ from watch?v=...)" value={form.videoId} onChange={e=>setForm({...form, videoId: e.target.value})} className="p-2 rounded border dark:bg-slate-900 dark:border-slate-700" />
        <button type="submit" className="bg-[#004b87] text-white py-2 rounded font-bold flex items-center justify-center gap-2"><Plus size={18}/> Add Sermon</button>
      </form>

      <div className="space-y-4">
        {db.sermons.map(item => (
          <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
            <h4 className="font-bold">{item.title} <span className="text-sm font-normal text-slate-500">(ID: {item.videoId})</span></h4>
            <button onClick={() => updateDb('sermons', 'delete', item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashPortfolio = ({ db, updateDb }) => {
  const [form, setForm] = useState({ title: '', img: '' });
  
  const handleAdd = (e) => {
    e.preventDefault();
    updateDb('portfolio', 'add', form);
    setForm({ title: '', img: '' });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 dark:border-slate-700">Manage Gallery</h2>
      <form onSubmit={handleAdd} className="mb-8 grid gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border dark:border-slate-700">
        <h3 className="font-bold text-[#800000] dark:text-[#ff4d4d]">Add Image</h3>
        <input required placeholder="Image Caption/Title" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="p-2 rounded border dark:bg-slate-900 dark:border-slate-700" />
        <input required placeholder="Image URL" value={form.img} onChange={e=>setForm({...form, img: e.target.value})} className="p-2 rounded border dark:bg-slate-900 dark:border-slate-700" />
        <button type="submit" className="bg-[#004b87] text-white py-2 rounded font-bold flex items-center justify-center gap-2"><Plus size={18}/> Add Image</button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {db.portfolio.map(item => (
          <div key={item.id} className="relative group border rounded-lg overflow-hidden dark:border-slate-700 aspect-square">
            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-2 text-center">
              <span className="text-white text-xs mb-2 font-bold">{item.title}</span>
              <button onClick={() => updateDb('portfolio', 'delete', item.id)} className="bg-red-600 text-white p-2 rounded-full"><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashSettings = ({ db, updateDb }) => {
  const [msg, setMsg] = useState(db.settings.topBarMessage);

  const handleSave = (e) => {
    e.preventDefault();
    updateDb('settings', 'set', { ...db.settings, topBarMessage: msg });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 dark:border-slate-700">Global Settings</h2>
      <form onSubmit={handleSave} className="grid gap-4">
        <div>
          <label className="block font-bold mb-2 text-[#800000] dark:text-[#ff4d4d]">Top Bar Announcement Message</label>
          <input 
            value={msg} 
            onChange={e => setMsg(e.target.value)}
            className="w-full p-3 rounded-lg border dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-[#004b87] outline-none"
          />
        </div>
        <button type="submit" className="bg-[#004b87] text-white py-3 rounded-lg font-bold">Save Settings</button>
      </form>
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
        <strong>Admin Note:</strong> Hero slider leaders and fixed page contents (like About page clergy) can be configured here in a production environment. Currently, they are statically mapped for performance.
      </div>
    </div>
  );
};