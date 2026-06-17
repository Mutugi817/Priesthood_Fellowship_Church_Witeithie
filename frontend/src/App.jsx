import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Info, BookOpen, Calendar, Heart, Mail, User, LogIn, 
  Menu, X, Moon, Sun, ChevronRight, ChevronLeft, Settings, 
  Shield, Bell, MapPin, Phone, Clock, LogOut, CheckCircle, Plus, DollarSign, Send, Landmark, HelpCircle
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const ThemeContext = createContext();
const AuthContext = createContext();
const RouteContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('pfc-theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('pfc-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('pfc-token');
      if (token) {
        try {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            localStorage.removeItem('pfc-token');
          }
        } catch (err) {
          console.error("Session verification offline.", err);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('pfc-token', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Ecclesiastical server connection error.' };
    }
  };

  const register = async (credentials) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Server unreachable.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('pfc-token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const RouteProvider = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState('home');

  const navigate = (route) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouteContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouteContext.Provider>
  );
};

const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="bg-gradient-to-r from-[#800000] to-rose-950 text-white py-16 px-4 text-center relative overflow-hidden border-b-4 border-[#87CEEB]">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-lg text-slate-200 font-semibold tracking-wide max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
      <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center text-[#800000] dark:text-[#87CEEB] mb-4">
        {Icon && <Icon size={28} />}
      </div>
      <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2 uppercase tracking-wider">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">{message}</p>
    </div>
  );
};

const NoticeSlider = () => {
  const [notices, setNotices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch(`${API_BASE}/notices`);
        if (res.ok) {
          const data = await res.json();
          setNotices(data);
        }
      } catch (err) {
        console.warn("Could not sync live notices slider.");
      }
    };
    fetchNotices();
  }, []);

  useEffect(() => {
    if (notices.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [notices]);

  if (notices.length === 0) {
    return (
      <div className="bg-[#800000] text-slate-100 py-2.5 px-4 text-center text-xs font-semibold tracking-wide border-b border-[#87CEEB]/25 flex items-center justify-center gap-2">
        <Bell size={13} className="text-[#87CEEB]" />
        📢 Welcome to Priesthood Fellowship Church — Sunday Services start at 7:00 AM!
      </div>
    );
  }

  return (
    <div className="bg-[#800000] text-slate-100 py-2.5 px-4 text-center text-xs font-semibold tracking-wide border-b border-[#87CEEB]/25 overflow-hidden relative">
      <div className="flex justify-center items-center gap-2 max-w-5xl mx-auto">
        <Bell size={14} className="text-[#87CEEB] shrink-0 animate-bounce" />
        <span className="transition-all duration-700 ease-in-out transform">
          {notices[currentIndex]?.message}
        </span>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const { currentRoute, navigate } = useContext(RouteContext);
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', route: 'home' },
    { name: 'About', route: 'about' },
    { name: 'Sermons', route: 'sermons' },
    { name: 'Events', route: 'events' },
    { name: 'Ministries', route: 'ministries' },
    { name: 'Give', route: 'give' },
    { name: 'Contact', route: 'contact' },
  ];

  const handleNav = (route) => {
    navigate(route);
    setIsOpen(false);
  };

  const getDashboardRoute = (role) => {
    switch(role) {
      case 'admin': return 'admin';
      case 'head': return 'head';
      case 'treasurer': return 'treasurer';
      case 'clerk': return 'clerk';
      default: return 'member';
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex-shrink-0 flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNav('home')}
          >
            <div className="w-15 to-rose-900 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-all shadow-md">
              <img src="https://d1csarkz8obe9u.cloudfront.net/uploads/thumbs/b152ba41d77fa8bd52b4c49ec1138bdf.png?" alt="logo" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base leading-tight text-[#800000] dark:text-slate-100 uppercase tracking-wider">PRIESTHOOD FELLOWSHIP</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-widest">WITEITHIE BRANCH</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleNav(link.route)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                  currentRoute === link.route
                    ? 'text-[#800000] dark:text-[#87CEEB] bg-rose-50 dark:bg-slate-800'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#800000] dark:hover:text-[#87CEEB] hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all">
              {theme === 'dark' ? <Sun size={19} className="text-[#87CEEB]" /> : <Moon size={19} className="text-[#800000]" />}
            </button>
            
            {user ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate(getDashboardRoute(user.role))}
                  className="flex items-center gap-2 bg-[#800000] text-white px-5 py-2.5 rounded-full hover:bg-rose-950 transition-all shadow-md hover:shadow-lg font-semibold text-sm"
                >
                  <User size={15} />
                  <span className="capitalize">{user.name}</span>
                </button>
                <button onClick={logout} className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all" title="Logout">
                  <LogOut size={19} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('auth')}
                className="flex items-center gap-2 bg-gradient-to-r from-[#800000] to-rose-900 text-white font-bold px-6 py-2.5 rounded-full hover:shadow-lg transition-all border border-[#87CEEB]/20 text-sm"
              >
                <LogIn size={15} />
                Portal Sign-In
              </button>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full text-slate-600 dark:text-slate-300">
              {theme === 'dark' ? <Sun size={20} className="text-[#87CEEB]" /> : <Moon size={20} className="text-[#800000]" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 dark:text-slate-300 hover:text-[#800000] p-2"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-xl absolute w-full max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2">
          <div className="px-3 pt-3 pb-6 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleNav(link.route)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold ${
                  currentRoute === link.route
                    ? 'text-[#800000] dark:text-[#87CEEB] bg-rose-50 dark:bg-slate-800'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </button>
            ))}
            <div className="border-t border-slate-100 dark:border-slate-800 mt-4 pt-4 px-4">
              {user ? (
                <div className="flex flex-col gap-3">
                   <button 
                    onClick={() => handleNav(getDashboardRoute(user.role))}
                    className="flex items-center justify-center gap-2 w-full bg-[#800000] text-white py-3 rounded-xl font-bold"
                  >
                    <User size={16} /> My Portal Dashboard
                  </button>
                  <button onClick={logout} className="flex items-center justify-center gap-2 w-full border border-red-500 text-red-500 py-3 rounded-xl font-bold">
                    <LogOut size={16} /> Logout Session
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNav('auth')}
                  className="flex items-center justify-center gap-2 w-full bg-[#800000] text-white py-3 rounded-xl font-bold"
                >
                  <LogIn size={16} /> Sign In / Create Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const HeroSlider = () => {
  const [slide, setSlide] = useState(0);
  const slides = [
    {
      title: "Walk in Devotion",
      sub: "Sunday Early Service starts 7:00 AM — 9:00 AM",
      img: "https://plus.unsplash.com/premium_photo-1726743775422-9b6377b48b57?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Join the Family Service",
      sub: "Sunday Second Service 9:00 AM — 1:30 PM",
      img: "https://images.unsplash.com/photo-1745357081650-e0857e7cd6ae?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Wednesday Fellowship",
      sub: "Midweek Spiritual Recharge from 5:00 PM",
      img: "https://images.unsplash.com/photo-1579975096649-e773152b04cb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-[75vh] min-h-[500px] w-full overflow-hidden bg-slate-900">
      {slides.map((s, idx) => (
        <div 
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === slide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <img 
            src={s.img} 
            alt={s.title}
            className="w-full h-full object-cover opacity-35 transform scale-105 transition-transform duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-center max-w-5xl mx-auto z-10">
            <span className="py-1 px-4 rounded-full bg-rose-900/65 text-slate-100 font-bold tracking-widest text-xs mb-4 uppercase border border-[#87CEEB]/40 animate-fade-in">
              PRIESTHOOD FELLOWSHIP
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4 select-none uppercase">
              {s.title}
            </h1>
            <p className="text-base sm:text-xl text-slate-200 max-w-2xl select-none font-semibold">
              {s.sub}
            </p>
          </div>
        </div>
      ))}
      <button 
        onClick={() => setSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-[#800000] transition-all z-20"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={() => setSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-[#800000] transition-all z-20"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

const Home = () => {
  const { navigate } = useContext(RouteContext);

  const services = [
    { title: "Sunday Devotional Service", time: "7:00 AM — 9:00 AM", desc: "An early morning intense atmosphere of worship, morning glory devotion, and deep biblical foundations." },
    { title: "Sunday Family Service", time: "9:00 AM — 1:30 PM", desc: "Our main celebratory worship service designed for families, with full children church ministries and powerful sermons." },
    { title: "Tuesday Pastor Office Hours", time: "7:00 AM — 10:00 AM", desc: "Confidential counseling, guidance, and direct interaction with our church pastoral board." },
    { title: "Wednesday Midweek Fellowship", time: "5:00 PM — 8:00 PM", desc: "Midweek spiritual fuel focusing on systematic Bible study, cell networks and intense corporate prayer sessions." },
    { title: "Thursday Huduma Ministry", time: "7:00 AM — 12:00 PM", desc: "Mercy ministry outreaches, counseling setups, and local community service works." },
    { title: "Monthly Midnight Kesha", time: "Every First Friday (9:00 PM)", desc: "A fiery night vigil of deliverance, corporate intercessory prayers, and deep spiritual declarations." }
  ];

  return (
    <div className="w-full">
      <HeroSlider />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">Liturgical Order & Assemblies</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Weekly encounters designed to model, equip, and manifest a royal priesthood.</p>
          <div className="mt-4 h-1 w-24 bg-[#800000] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700/50 p-8 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/40 rounded-xl flex items-center justify-center text-[#800000] mb-6">
                  <Clock size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <span className="inline-block px-3 py-1 bg-sky-50 dark:bg-[#800000]/20 rounded-full text-xs font-bold text-[#800000] dark:text-[#87CEEB] mb-4">
                  {item.time}
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{item.desc}</p>
              </div>
              <button 
                onClick={() => navigate('about')} 
                className="text-[#800000] dark:text-[#87CEEB] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all mt-auto"
              >
                Learn More <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const clergyData = [
  {
    name: "Apostle Consolata Wambui",
    role: "Head of Church & Main Preacher",
    // Placeholder image - replace with actual URL
    image: "https://d1csarkz8obe9u.cloudfront.net/uploads/thumbs/6988bd82dc52de240a616ee4d61b699b.png?",
  },
  {
    name: "Evangelist Mary Wanjiru",
    role: "Evangelist",
    // Placeholder image - replace with actual URL
    image: "https://d1csarkz8obe9u.cloudfront.net/uploads/thumbs/176a5595e5021763a51e450792584976.png?",
  },
  {
    name: "Pastor Symon Njiru",
    role: "Pastor",
    // Placeholder image - replace with actual URL
    image: "https://d1csarkz8obe9u.cloudfront.net/uploads/thumbs/5b3b7a24320c1836cdcfef8d305d5840.png?",
  },
  {
    name: "Pastor Patricia",
    role: "Pastor",
    // Placeholder image - replace with actual URL
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
  }
];

const About = () => (
  <div className="animate-in fade-in duration-500 min-h-screen bg-white dark:bg-slate-900 font-sans">
    
    {/* Page Header Section */}
    <PageHeader 
      title="Who We Are" 
      subtitle="Raising a royal priesthood built on truth and apostolic mandate." 
    />

    {}
    {/* The Apostolic Call Section (Your original content) */}
    <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-6">
        <h2 className="text-3xl font-extrabold text-[#800000] dark:text-[#87CEEB] uppercase tracking-wide">
          The Apostolic Call
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Priesthood Fellowship Church, Witeithie Branch, is committed to establishing believers firmly in their royal calling. Following the divine blueprints, we mold families, lead societal transformations, and construct altars of genuine prayer along Thika Road.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {[
            "Uncompromised Truth Teachings",
            "Midnight Delivery Altars",
            "Local Mercy & Huduma Ministry",
            "Equipping The Youth Frontier"
          ].map((item, i) => (
             <div key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-bold group">
               <CheckCircle 
                 className="text-[#800000] dark:text-[#87CEEB] transition-transform duration-300 group-hover:scale-125" 
                 size={20} 
               />
               <span>{item}</span>
             </div>
          ))}
        </div>
      </div>
      
      {/* Visual Graphic */}
      <div className="bg-slate-900/10 dark:bg-slate-800 rounded-2xl h-96 flex items-center justify-center shadow-inner relative overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80" 
          alt="Altar Sanctuary" 
          className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#800000]/30 to-[#87CEEB]/10 mix-blend-multiply" />
        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-2xl" />
      </div>
    </div>

    
    {/* NEW SECTION: Our Clergy */}
    <div className="bg-slate-50 dark:bg-slate-800/30 py-24 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#800000] dark:text-[#87CEEB] uppercase tracking-wide">
            Our Clergy
          </h2>
          <div className="w-20 h-1 bg-[#800000] dark:bg-[#87CEEB] mx-auto mt-6 rounded-full opacity-70"></div>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
            Meet the dedicated and anointed spiritual leaders guiding our congregation in truth and apostolic mandate.
          </p>
        </div>

        {/* Clergy Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10">
          {clergyData.map((member, index) => (
            <div 
              key={index} 
              className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-slate-100 dark:border-slate-700/50"
            >
              {/* Image Container with Aspect Ratio */}
              <div className="aspect-[3/4] overflow-hidden bg-slate-200 dark:bg-slate-700 relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
                {/* Subtle gradient overlay for better text contrast if we wanted text over image, 
                    but here it just adds a nice vignette effect at the bottom of the image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Content Container */}
              <div className="p-6 text-center flex-grow flex flex-col justify-center bg-white dark:bg-slate-800 relative z-10">
                <h3 className="text-lg xl:text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                  {member.name}
                </h3>
                <p className="text-sm xl:text-base font-semibold text-[#800000] dark:text-[#87CEEB] uppercase tracking-wider">
                  {member.role}
                </p>
                
                {/* Decorative underline that expands on hover */}
                <div className="w-0 h-0.5 bg-[#800000] dark:bg-[#87CEEB] mx-auto mt-4 transition-all duration-300 group-hover:w-12 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
    
  </div>
);


const Sermons = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const res = await fetch(`${API_BASE}/sermons`);
        if (res.ok) {
          const data = await res.json();
          setSermons(data);
        }
      } catch (err) {
        console.error("Could not fetch sermon library.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSermons();
  }, []);

  return (
    <div className="animate-in fade-in">
      <PageHeader title="Sermon Archive" subtitle="Systematic biblical teachings to resource your home daily." />
      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#800000]" />
          </div>
        ) : sermons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sermons.map((s) => (
              <div key={s._id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-rose-50 dark:bg-rose-950/40 text-[#800000] dark:text-rose-300 text-xs font-bold rounded-full">
                      {s.duration}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold">{s.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-4">Preacher: {s.preacher}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {s.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <a 
                  href={s.link} 
                  className="w-full py-2.5 rounded-lg border border-[#800000]/20 text-[#800000] hover:bg-[#800000] hover:text-white dark:text-white text-center font-bold text-sm block transition-all"
                >
                  Listen / Watch Altar
                </a>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={BookOpen} title="Sermons Synchronization" message="Archived teachings are uploading. Visit during our next active assembly cycle." />
        )}
      </div>
    </div>
  );
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE}/events`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (err) {
        console.error("Could not fetch upcoming events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="animate-in fade-in">
      <PageHeader title="Liturgical Gatherings" subtitle="Stay synchronized with special convocations and covenant weeks." />
      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#800000]" />
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((e) => (
              <div key={e._id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{e.title}</h3>
                  <div className="flex flex-col gap-2.5 my-4">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                      <Clock size={14} className="text-[#800000]" /> {new Date(e.date).toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                      <MapPin size={14} className="text-[#800000]" /> {e.location}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-4">{e.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Calendar} title="No Convocations Listed" message="Special assemblies are broadcasted directly from the altar during our standard liturgies." />
        )}
      </div>
    </div>
  );
};

const Ministries = () => (
  <div className="animate-in fade-in">
    <PageHeader title="Apostolic Fronts" subtitle="Find your specialized area of growth and societal mandate." />
    <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
      {[
        { title: "Men of Valour", desc: "Equipping household priests, modeling authentic fatherhood, leadership development, and structural community stewardship." },
        { title: "Virtuous Women Ministry", desc: "Constructing spiritual foundations inside families, maternal health systems, and structured small-scale business support." },
        { title: "Youth Elite Frontier", desc: "Leading campus outreaches, artistic and tech masterclasses, crossover nights, and career incubation blocks." },
        { title: "Junior Sanctuary Church", desc: "Familiarizing our children with the voice of the Spirit, creative scriptures workshops, and foundational values modeling." }
      ].map((item, idx) => (
        <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700/50 shadow-md">
          <h3 className="text-2xl font-bold text-[#800000] dark:text-[#87CEEB] mb-3 uppercase tracking-wide">{item.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const Give = () => {
  return (
    <div className="animate-in fade-in">
      <PageHeader title="Altar Covenant Partnering" subtitle="Support church building expansions and missionary Huduma campaigns." />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border-t-4 border-[#800000]">
          <h3 className="text-2xl font-bold text-center mb-8 text-[#800000] dark:text-[#87CEEB] uppercase tracking-wide">Secured Channels</h3>
          <div className="space-y-6">
            <div className="p-6 border border-slate-150 dark:border-slate-700 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-extrabold text-lg shrink-0">
                MP
              </div>
              <div>
                <h4 className="font-bold text-lg dark:text-white">M-PESA Covenant Line</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Business Till: <span className="font-mono font-bold text-slate-800 dark:text-white">5023910</span></p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Account: <span className="font-semibold text-slate-800 dark:text-white">Your Name / Altar Support</span></p>
              </div>
            </div>
            
            <div className="p-6 border border-slate-150 dark:border-slate-700 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <Landmark size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg dark:text-white">National Bank Transfer</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Co-operative Bank — Thika Superhighway Branch</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Account No: <span className="font-mono font-bold text-slate-800 dark:text-white">01129384910239</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg(data.message);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatusMsg(data.message);
      }
    } catch (err) {
      setStatusMsg('Communication server offline.');
    }
  };

  return (
    <div className="animate-in fade-in">
      <PageHeader title="Reach The Secretariat" subtitle="Have inquiries about office hours, counseling requests, or memberships?" />
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white uppercase tracking-wide">Send Correspondence</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {statusMsg && (
              <div className="p-4 bg-sky-50 dark:bg-sky-950/40 text-xs font-bold text-[#800000] dark:text-[#87CEEB] rounded-lg">
                {statusMsg}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Your Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-250 dark:border-slate-650 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#800000] outline-none transition-all text-sm font-medium" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-250 dark:border-slate-650 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#800000] outline-none transition-all text-sm font-medium" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Message / Inquiry Details</label>
              <textarea 
                rows="4" 
                required 
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-250 dark:border-slate-650 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#800000] outline-none transition-all text-sm font-medium"
              ></textarea>
            </div>
            <button className="w-full bg-[#800000] text-white font-bold py-3.5 rounded-xl hover:bg-rose-950 transition-all text-sm uppercase tracking-wider">
              Submit Correspondence
            </button>
          </form>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 flex flex-col justify-center border border-slate-250 dark:border-slate-750">
          <EmptyState icon={MapPin} title="Sanctuary Directions" message="We are located at Witeithie, along Thika Super Highway, Juja District. Drop by during active service cycles." />
        </div>
      </div>
    </div>
  );
};

const Auth = () => {
  const { login, register } = useContext(AuthContext);
  const { navigate } = useContext(RouteContext);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      const result = await login({ email, password });
      if (result.success) {
        navigate('home');
      } else {
        setError(result.message);
      }
    } else {
      const result = await register({ name, email, password });
      if (result.success) {
        setIsLogin(true);
        setError('Registration successful! Please sign in.');
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-2xl border border-slate-150 dark:border-slate-800">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto bg-gradient-to-tr from-[#800000] to-rose-950 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            P
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
            {isLogin ? 'Ecclesiastical Portal' : 'Register Member Account'}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isLogin ? "Authenticate to access role portfolios" : "Partner formally with PFC Witeithie Branch"}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-xs font-bold text-[#800000] dark:text-rose-300 text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-250 dark:border-slate-650 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#800000] text-sm" 
                placeholder="John Doe" 
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-250 dark:border-slate-650 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#800000] text-sm" 
              placeholder="e.g. member@pfc.org" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Access Token Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-250 dark:border-slate-650 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#800000] text-sm" 
              placeholder="••••••••" 
            />
          </div>

          <button type="submit" className="w-full bg-[#800000] text-white py-3.5 rounded-xl font-bold hover:bg-rose-950 transition-all text-sm uppercase tracking-wider shadow-md">
            {isLogin ? 'Sign In' : 'Complete Registration'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button onClick={() => setIsLogin(!isLogin)} className="text-xs font-bold text-slate-500 hover:text-[#800000] transition-colors">
            {isLogin ? "No account? Register standard member profile" : "Already have role access? Connect session"}
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardWrapper = ({ roleTitle, children, sidebarItems = [], currentSubTab = '', onSubTabChange = () => {} }) => {
  const { user, logout } = useContext(AuthContext);
  const { navigate } = useContext(RouteContext);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
      <div className="w-full lg:w-72 bg-slate-900 text-white flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#800000] rounded-lg flex items-center justify-center font-bold text-[#87CEEB]">
            P
          </div>
          <div>
            <h2 className="font-extrabold tracking-wide text-sm uppercase">{roleTitle}</h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase">{user?.role} Mode</span>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto">
          <ul className="space-y-1.5">
            {sidebarItems.map((item) => (
              <li 
                key={item.id}
                onClick={() => onSubTabChange(item.id)}
                className={`p-3.5 rounded-xl font-bold text-sm cursor-pointer transition-all flex items-center gap-3 ${
                  currentSubTab === item.id 
                    ? 'bg-[#800000] text-white border-l-4 border-[#87CEEB]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon && <item.icon size={16} />}
                {item.name}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => { logout(); navigate('home'); }}
            className="w-full mt-8 flex items-center justify-center gap-2 border border-slate-800 p-3 rounded-xl hover:bg-red-900/20 hover:text-red-400 transition-all text-xs font-bold uppercase tracking-wider"
          >
            <LogOut size={14} /> Clear Portfolios
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">Altar Workstation</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Role operator: <span className="font-bold text-[#800000] capitalize">{user?.name}</span></p>
          </div>
          <button onClick={() => navigate('home')} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-full hover:bg-slate-200 transition-all">
            Return to Frontpage
          </button>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 lg:p-10">
          {children}
        </div>
      </div>
    </div>
  );
};


// --- CLERK PORTAL ---
const ClerkPortal = () => {
  const [activeTab, setActiveTab] = useState('notices');
  const [title, setTitle] = useState('');
  const [preacher, setPreacher] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [tags, setTags] = useState('');
  const [feedback, setFeedback] = useState('');

  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLoc, setEventLoc] = useState('');
  const [eventDesc, setEventDesc] = useState('');

  const [noticeMsg, setNoticeMsg] = useState('');

  const sidebarItems = [
    { id: 'notices', name: 'Announcements Board', icon: Bell },
    { id: 'events', name: 'Liturgical Calendar', icon: Calendar },
    { id: 'sermons', name: 'Altar Sermons', icon: BookOpen },
  ];

  const handleSermonUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/clerk/sermons`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, preacher, date, duration, tags: tags.split(',').map(t=>t.trim()) })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) {
        setTitle(''); setPreacher(''); setDate(''); setDuration(''); setTags('');
      }
    } catch (err) {
      setFeedback('Error saving archived sermon.');
    }
  };

  const handleEventUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/clerk/events`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: eventTitle, date: eventDate, location: eventLoc, description: eventDesc })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) {
        setEventTitle(''); setEventDate(''); setEventLoc(''); setEventDesc('');
      }
    } catch (err) {
      setFeedback('Error recording event.');
    }
  };

  const handleNoticeUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/clerk/notices`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: noticeMsg })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) setNoticeMsg('');
    } catch (err) {
      setFeedback('Error saving notice announcement.');
    }
  };

  return (
    <DashboardWrapper roleTitle="Secretariat Clerk" sidebarItems={sidebarItems} currentSubTab={activeTab} onSubTabChange={setActiveTab}>
      <div className="space-y-6">
        {feedback && (
          <div className="p-4 bg-sky-50 dark:bg-sky-950/40 text-xs font-bold text-[#800000] dark:text-[#87CEEB] rounded-xl text-center">
            {feedback}
          </div>
        )}

        {activeTab === 'notices' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4 flex items-center gap-2">
              <Bell size={18} className="text-[#800000]" /> Push Live Top Notice Marquee
            </h3>
            <form onSubmit={handleNoticeUpload} className="grid grid-cols-1 gap-4">
              <input 
                type="text" 
                required 
                value={noticeMsg}
                onChange={e => setNoticeMsg(e.target.value)}
                placeholder="e.g. Next First Friday Monthly Kesha begins at exactly 9:00 PM!" 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none"
              />
              <button className="px-5 py-3 bg-[#800000] text-white font-bold rounded-xl text-xs uppercase tracking-wide flex items-center gap-2 justify-center w-fit">
                <Plus size={14} /> Update Marquee announcements
              </button>
            </form>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-[#800000]" /> Register Calendar Gathering
            </h3>
            <form onSubmit={handleEventUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                required 
                value={eventTitle}
                onChange={e => setEventTitle(e.target.value)}
                placeholder="Gathering Title" 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm animate-in"
              />
              <input 
                type="datetime-local" 
                required 
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="text" 
                required 
                value={eventLoc}
                onChange={e => setEventLoc(e.target.value)}
                placeholder="Location e.g. Sanctuary Hall" 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm md:col-span-2"
              />
              <textarea 
                required 
                value={eventDesc}
                onChange={e => setEventDesc(e.target.value)}
                placeholder="Describe event focus or liturgical mandate..."
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm md:col-span-2"
              ></textarea>
              <button className="px-5 py-3 bg-[#800000] text-white font-bold rounded-xl text-xs uppercase tracking-wide flex items-center gap-2 justify-center w-fit">
                <Plus size={14} /> Schedule Event
              </button>
            </form>
          </div>
        )}

        {activeTab === 'sermons' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-[#800000]" /> Archive Altar Teachings
            </h3>
            <form onSubmit={handleSermonUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                required 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Sermon Title" 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="text" 
                required 
                placeholder="Preacher" 
                value={preacher}
                onChange={e => setPreacher(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="date" 
                required 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="text" 
                required 
                placeholder="Duration e.g. 50 mins" 
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="text" 
                required 
                placeholder="Keywords / Tags (separated by comma)" 
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm md:col-span-2"
              />
              <button className="px-5 py-3 bg-[#800000] text-white font-bold rounded-xl text-xs uppercase tracking-wide flex items-center gap-2 justify-center w-fit">
                <Plus size={14} /> Archive Sermon Record
              </button>
            </form>
          </div>
        )}
      </div>
    </DashboardWrapper>
  );
};

// --- TREASURER PORTAL ---
const TreasurerPortal = () => {
  const [givingRecords, setGivingRecords] = useState([]);
  const [memberName, setMemberName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('Tithe');
  const [feedback, setFeedback] = useState('');

  const fetchLogs = async () => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/treasurer/giving`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGivingRecords(data);
      }
    } catch (err) {
      console.error("Could not fetch giving ledger.");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleGivingPost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/treasurer/giving`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ memberName, email, amount: Number(amount), purpose })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) {
        setMemberName(''); setEmail(''); setAmount('');
        fetchLogs();
      }
    } catch (err) {
      setFeedback('Error writing to financial database.');
    }
  };

  return (
    <DashboardWrapper roleTitle="Ministry Treasurer" sidebarItems={[{ id: 'ledger', name: 'Financial Ledger', icon: DollarSign }]} currentSubTab="ledger">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 border-r border-slate-100 dark:border-slate-800 pr-0 lg:pr-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4 flex items-center gap-2">
            <DollarSign size={18} className="text-[#800000]" /> Record New Contribution
          </h3>
          <form onSubmit={handleGivingPost} className="space-y-4">
            {feedback && (
              <div className="p-4 bg-sky-50 dark:bg-sky-950/40 text-xs font-bold text-[#800000] dark:text-[#87CEEB] rounded-xl text-center">
                {feedback}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Contributor Name</label>
              <input 
                type="text" 
                required 
                value={memberName}
                onChange={e => setMemberName(e.target.value)}
                placeholder="e.g. Esther M." 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Primary Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="registered-email@pfc.org" 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Amount (KES)</label>
              <input 
                type="number" 
                required 
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Amount in Shillings" 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Classification Purpose</label>
              <select 
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none"
              >
                <option value="Tithe">Tithe</option>
                <option value="Thanksgiving">Thanksgiving</option>
                <option value="Building Fund">Building Fund</option>
                <option value="Offertory">Offertory</option>
                <option value="General Ministry">General Ministry</option>
              </select>
            </div>
            <button className="w-full bg-[#800000] text-white py-3.5 rounded-xl font-bold hover:bg-rose-950 transition-all text-sm uppercase tracking-wider">
              Log giving transaction
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Financial Audit Ledger</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                  <th className="py-3 px-2">Contributor</th>
                  <th className="py-3 px-2">Allocation</th>
                  <th className="py-3 px-2 text-right">Amount (KES)</th>
                </tr>
              </thead>
              <tbody>
                {givingRecords.map((r) => (
                  <tr key={r._id} className="border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    <td className="py-3 px-2 capitalize">{r.memberName}</td>
                    <td className="py-3 px-2">{r.purpose}</td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-green-600">+{r.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
};

// --- MEMBER PORTAL ---
const MemberPortal = () => {
  const [personalGivings, setPersonalGivings] = useState([]);
  const [prayerReq, setPrayerReq] = useState('');
  const [feedback, setFeedback] = useState('');

  const fetchPersonalLogs = async () => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/member/giving`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPersonalGivings(data);
      }
    } catch (err) {
      console.error("Failed to load giving ledger.");
    }
  };

  useEffect(() => {
    fetchPersonalLogs();
  }, []);

  const handlePrayerRequest = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/member/prayer`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ request: prayerReq })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) setPrayerReq('');
    } catch (err) {
      setFeedback('Petition server offline.');
    }
  };

  return (
    <DashboardWrapper roleTitle="Member Portal" sidebarItems={[{ id: 'member', name: 'Member Home', icon: User }]} currentSubTab="member">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4 flex items-center gap-2">
            <Send size={18} className="text-[#800000]" /> Place petition on Altar
          </h3>
          <form onSubmit={handlePrayerRequest} className="space-y-4">
            {feedback && (
              <div className="p-4 bg-sky-50 dark:bg-sky-950/40 text-xs font-bold text-[#800000] dark:text-[#87CEEB] rounded-xl text-center">
                {feedback}
              </div>
            )}
            <textarea 
              required 
              rows="5"
              value={prayerReq}
              onChange={e => setPrayerReq(e.target.value)}
              placeholder="Type your family or individual petitions here..."
              className="w-full p-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm"
            ></textarea>
            <button className="px-6 py-3 bg-[#800000] text-white font-bold rounded-xl text-xs uppercase tracking-wide shadow-md">
              Place Petition On Altar
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">My Financial Contributions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2 text-right">Amount (KES)</th>
                </tr>
              </thead>
              <tbody>
                {personalGivings.map((g, index) => (
                  <tr key={index} className="border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    <td className="py-3 px-2">{g.purpose}</td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-green-600">+{g.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
};

// --- HEAD PASTOR PORTAL ---
const HeadPortal = () => {
  const [prayers, setPrayers] = useState([]);

  const fetchPrayers = async () => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/pastor/prayers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPrayers(data);
      }
    } catch (err) {
      console.error("Could not fetch pastoral petition book.");
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, []);

  const handleAltarIntercession = async (id, status) => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/pastor/prayers/${id}/intercede`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchPrayers();
      }
    } catch (err) {
      console.error("Failed to update status.");
    }
  };

  return (
    <DashboardWrapper roleTitle="Head Pastor Portal" sidebarItems={[{ id: 'pastor', name: 'Altar Petitions', icon: Heart }]} currentSubTab="pastor">
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Intercessory Altar Petition Book</h3>
        <div className="space-y-4">
          {prayers.map((p) => (
            <div key={p._id} className="p-6 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-400">Petitioner:</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">{p.memberName}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{p.request}"</p>
                <span className={`inline-block mt-3 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide rounded-full ${
                  p.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                }`}>
                  Altar: {p.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleAltarIntercession(p._id, 'Prayed For')}
                  className="px-4 py-2 bg-[#800000] text-white text-xs font-bold rounded-lg hover:bg-rose-950 transition-all"
                >
                  Confirm Altar Prayer
                </button>
                <button 
                  onClick={() => handleAltarIntercession(p._id, 'Answered')}
                  className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-all"
                >
                  Mark Answered / Testimony
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardWrapper>
  );
};

// --- SYSTEM ADMIN WORKSPACE (UNIVERSAL OVERRIDE PORTAL) ---
const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState({});
  const [users, setUsers] = useState([]);
  const [givingRecords, setGivingRecords] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [feedback, setFeedback] = useState('');

  // Form Fields State
  const [editConfigKey, setEditConfigKey] = useState('');
  const [editConfigVal, setEditConfigVal] = useState('');

  const [notTitle, setNotTitle] = useState('');
  const [notPreacher, setNotPreacher] = useState('');
  const [notDate, setNotDate] = useState('');
  const [notDuration, setNotDuration] = useState('');
  const [notTags, setNotTags] = useState('');

  const [evTitle, setEvTitle] = useState('');
  const [evDate, setEvDate] = useState('');
  const [evLoc, setEvLoc] = useState('');
  const [evDesc, setEvDesc] = useState('');

  const [notMsg, setNotMsg] = useState('');

  const [conName, setConName] = useState('');
  const [conEmail, setConEmail] = useState('');
  const [conAmount, setConAmount] = useState('');
  const [conPurpose, setConPurpose] = useState('Tithe');

  const [slideTitle, setSlideTitle] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideUrl, setSlideUrl] = useState('');
  const [slides, setSlides] = useState([]);

  const sidebarItems = [
    { id: 'overview', name: 'Workstation Home', icon: Shield },
    { id: 'users', name: 'User Directory', icon: User },
    { id: 'config', name: 'System Configurations', icon: Settings },
    { id: 'giving', name: 'Treasury & Giving', icon: DollarSign },
    { id: 'prayers', name: 'Pastoral Prayer Book', icon: Heart },
    { id: 'contacts', name: 'Contact Inboxes', icon: Mail },
    { id: 'notices', name: 'Announcements (Notices)', icon: Bell },
    { id: 'events', name: 'Calendar Scheduling', icon: Calendar },
    { id: 'sermons', name: 'Sermon Library', icon: BookOpen },
    { id: 'slider', name: 'Hero Image Slider', icon: ChevronRight },
  ];

  const fetchMetrics = async () => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/metrics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Could not load admin stats.");
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch user profiles.");
    }
  };

  const fetchGivings = async () => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/treasurer/giving`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGivingRecords(data);
      }
    } catch (err) {
      console.error("Failed to load global transaction logs.");
    }
  };

  const fetchPrayers = async () => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/pastor/prayers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPrayers(data);
      }
    } catch (err) {
      console.error("Failed to load pastoral petition records.");
    }
  };

  const fetchContacts = async () => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/contacts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (err) {
      console.error("Failed to load contact logs.");
    }
  };

  const fetchSlides = async () => {
    try {
      const res = await fetch(`${API_BASE}/slides`);
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
      }
    } catch (err) {
      console.error("Failed to load hero configurations.");
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchUsers();
    fetchGivings();
    fetchPrayers();
    fetchContacts();
    fetchSlides();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) fetchUsers();
    } catch (err) {
      setFeedback('Failed to adjust user dynamic authorization rules.');
    }
  };

  const handleUserDelete = async (userId) => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) fetchUsers();
    } catch (err) {
      setFeedback('Error purging member configuration profile.');
    }
  };

  const handleConfigUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/configs`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ key: editConfigKey, value: editConfigVal })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) {
        setEditConfigKey(''); setEditConfigVal('');
      }
    } catch (err) {
      setFeedback('Failed to synchronize global settings.');
    }
  };

  const handleContributionSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/treasurer/giving`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ memberName: conName, email: conEmail, amount: Number(conAmount), purpose: conPurpose })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) {
        setConName(''); setConEmail(''); setConAmount('');
        fetchGivings();
      }
    } catch (err) {
      setFeedback('Failed to write contribution to ledger.');
    }
  };

  const handleNoticeUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/clerk/notices`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: notMsg })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) setNotMsg('');
    } catch (err) {
      setFeedback('Error creating announcement.');
    }
  };

  const handleEventUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/clerk/events`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: evTitle, date: evDate, location: evLoc, description: evDesc })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) {
        setEvTitle(''); setEvDate(''); setEvLoc(''); setEvDesc('');
        fetchMetrics();
      }
    } catch (err) {
      setFeedback('Failed to create calendar convocation.');
    }
  };

  const handleSermonUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/clerk/sermons`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: notTitle, preacher: notPreacher, date: notDate, duration: notDuration, tags: notTags.split(',').map(t=>t.trim()) })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) {
        setNotTitle(''); setNotPreacher(''); setNotDate(''); setNotDuration(''); setNotTags('');
        fetchMetrics();
      }
    } catch (err) {
      setFeedback('Failed to archive sermon.');
    }
  };

  const handleSlideUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/slides`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: slideTitle, subtitle: slideSubtitle, imageUrl: slideUrl })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) {
        setSlideTitle(''); setSlideSubtitle(''); setSlideUrl('');
        fetchSlides();
      }
    } catch (err) {
      setFeedback('Failed to record layout slide.');
    }
  };

  const handleSlideToggle = async (id, activeStatus) => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/slides/${id}/toggle`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ active: activeStatus })
      });
      if (res.ok) fetchSlides();
    } catch (err) {
      console.error("Failed to alter slide state.");
    }
  };

  const handleSlideDelete = async (id) => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/slides/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchSlides();
    } catch (err) {
      console.error("Failed to clear slide state.");
    }
  };

  const handleAltarIntercession = async (id, status) => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/pastor/prayers/${id}/intercede`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchPrayers();
    } catch (err) {
      console.error("Failed to intercede.");
    }
  };

  const handleContactToggle = async (id, readStatus) => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/contacts/${id}/read`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ read: readStatus })
      });
      if (res.ok) fetchContacts();
    } catch (err) {
      console.error("Failed to change read state.");
    }
  };

  return (
    <DashboardWrapper roleTitle="System Administrator" sidebarItems={sidebarItems} currentSubTab={activeTab} onSubTabChange={setActiveTab}>
      <div className="space-y-12">
        {feedback && (
          <div className="p-4 bg-sky-50 dark:bg-sky-950/40 text-xs font-bold text-[#800000] dark:text-[#87CEEB] rounded-xl text-center">
            {feedback}
          </div>
        )}

        {activeTab === 'overview' && (
          <div>
            <h3 className="text-xl font-bold text-[#800000] dark:text-white uppercase mb-6">Environment Database Health & Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Registered Members</span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics?.totalRegisteredMembers || 0}</span>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Archived Sermons</span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics?.archivedSermons || 0}</span>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Gatherings</span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics?.upcomingEvents || 0}</span>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Unread Enquiries</span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics?.unreadInteractions || 0}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">User Dynamic Access Control Panel</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-150 dark:border-slate-800 text-slate-400 font-bold">
                    <th className="py-3 px-2">Name</th>
                    <th className="py-3 px-2">Email</th>
                    <th className="py-3 px-2">Authorization Role</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-slate-100 dark:border-slate-850 text-slate-600 dark:text-slate-300">
                      <td className="py-4 px-2 font-bold capitalize">{u.name}</td>
                      <td className="py-4 px-2">{u.email}</td>
                      <td className="py-4 px-2">
                        <select 
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded px-2.5 py-1.5 outline-none border border-slate-200 dark:border-slate-700 capitalize"
                        >
                          <option value="member">Member</option>
                          <option value="clerk">Clerk</option>
                          <option value="treasurer">Treasurer</option>
                          <option value="head">Head Pastor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <button 
                          onClick={() => handleUserDelete(u._id)}
                          className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200"
                        >
                          Purge Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Global Church Constant Parameters</h3>
            <form onSubmit={handleConfigUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                required 
                value={editConfigKey}
                onChange={e => setEditConfigKey(e.target.value)}
                placeholder="Key (e.g. till_number)" 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="text" 
                required 
                value={editConfigVal}
                onChange={e => setEditConfigVal(e.target.value)}
                placeholder="Setting Value" 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <button className="px-5 py-3 bg-[#800000] text-white font-bold rounded-xl text-xs uppercase tracking-wide flex items-center gap-2 justify-center w-fit md:col-span-2">
                Commit Config Changes
              </button>
            </form>
          </div>
        )}

        {activeTab === 'giving' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in">
            <div className="lg:col-span-1 border-r border-slate-100 dark:border-slate-800 pr-0 lg:pr-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Add Direct Contribution</h3>
              <form onSubmit={handleContributionSubmit} className="space-y-4">
                <input 
                  type="text" required value={conName} onChange={e=>setConName(e.target.value)}
                  placeholder="Contributor Name" 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
                <input 
                  type="email" required value={conEmail} onChange={e=>setConEmail(e.target.value)}
                  placeholder="Contributor Email" 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
                <input 
                  type="number" required value={conAmount} onChange={e=>setConAmount(e.target.value)}
                  placeholder="Amount (KES)" 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
                <select 
                  value={conPurpose} onChange={e=>setConPurpose(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none"
                >
                  <option value="Tithe">Tithe</option>
                  <option value="Thanksgiving">Thanksgiving</option>
                  <option value="Building Fund">Building Fund</option>
                  <option value="Offertory">Offertory</option>
                  <option value="General Ministry">General Ministry</option>
                </select>
                <button className="w-full bg-[#800000] text-white py-3.5 rounded-xl font-bold hover:bg-rose-950 transition-all text-sm uppercase tracking-wider">
                  Log Contribution
                </button>
              </form>
            </div>
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Audit Ledger View</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2">Type</th>
                      <th className="py-3 px-2 text-right">KES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {givingRecords.map((r) => (
                      <tr key={r._id} className="border-b border-slate-100 dark:border-slate-850 text-slate-600 dark:text-slate-300">
                        <td className="py-3 px-2 capitalize">{r.memberName}</td>
                        <td className="py-3 px-2">{r.purpose}</td>
                        <td className="py-3 px-2 text-right font-mono font-bold text-green-600">+{r.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prayers' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Intercessory Altar Petitions</h3>
            <div className="space-y-4 animate-in">
              {prayers.map((p) => (
                <div key={p._id} className="p-6 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-400">Petitioner:</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">{p.memberName}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{p.request}"</p>
                    <span className={`inline-block mt-3 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide rounded-full ${
                      p.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                    }`}>
                      Altar: {p.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAltarIntercession(p._id, 'Prayed For')}
                      className="px-4 py-2 bg-[#800000] text-white text-xs font-bold rounded-lg hover:bg-rose-950 transition-all"
                    >
                      Mark Prayed For
                    </button>
                    <button 
                      onClick={() => handleAltarIntercession(p._id, 'Answered')}
                      className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-750 transition-all"
                    >
                      Answered Testimony
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Contact Inbox Messages</h3>
            <div className="space-y-4">
              {contacts.map((c) => (
                <div key={c._id} className="p-6 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-400">{new Date(c.createdAt).toLocaleString()}</span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1 capitalize">{c.name} ({c.email})</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 italic">"{c.message}"</p>
                  </div>
                  <div>
                    {c.read ? (
                      <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/20 px-3 py-1 rounded-full">Read</span>
                    ) : (
                      <button 
                        onClick={() => handleContactToggle(c._id, true)}
                        className="px-4 py-2 bg-[#800000] text-white text-xs font-bold rounded-lg hover:bg-rose-950 transition-all"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notices' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Upload Live Announcement Marquee</h3>
            <form onSubmit={handleNoticeUpload} className="grid grid-cols-1 gap-4 animate-in">
              <input 
                type="text" required value={notMsg} onChange={e => setNotMsg(e.target.value)}
                placeholder="Alert Message Content" 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <button className="px-5 py-3 bg-[#800000] text-white font-bold rounded-xl text-xs uppercase tracking-wide flex items-center gap-2 justify-center w-fit">
                <Plus size={14} /> Update Slider
              </button>
            </form>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Register Gathering Calendar</h3>
            <form onSubmit={handleEventUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in">
              <input 
                type="text" required value={evTitle} onChange={e => setEvTitle(e.target.value)}
                placeholder="Gathering Title" 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="datetime-local" required value={evDate} onChange={e => setEvDate(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="text" required value={evLoc} onChange={e => setEvLoc(e.target.value)}
                placeholder="Location" 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm md:col-span-2"
              />
              <textarea 
                required value={evDesc} onChange={e => setEvDesc(e.target.value)}
                placeholder="Details of structural mandate..."
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm md:col-span-2"
              ></textarea>
              <button className="px-5 py-3 bg-[#800000] text-white font-bold rounded-xl text-xs uppercase tracking-wide flex items-center gap-2 justify-center w-fit">
                <Plus size={14} /> Schedule Gathering
              </button>
            </form>
          </div>
        )}

        {activeTab === 'sermons' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Archive Teachings Altar</h3>
            <form onSubmit={handleSermonUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in">
              <input 
                type="text" required value={notTitle} onChange={e => setNotTitle(e.target.value)}
                placeholder="Sermon Title" 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="text" required placeholder="Preacher" value={notPreacher} onChange={e => setNotPreacher(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="date" required value={notDate} onChange={e => setNotDate(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="text" required placeholder="Duration e.g. 50 mins" value={notDuration} onChange={e => setNotDuration(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="text" required placeholder="Tags (separated by comma)" value={notTags} onChange={e => setNotTags(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm md:col-span-2"
              />
              <button className="px-5 py-3 bg-[#800000] text-white font-bold rounded-xl text-xs uppercase tracking-wide flex items-center gap-2 justify-center w-fit">
                <Plus size={14} /> Archive Sermon Record
              </button>
            </form>
          </div>
        )}

        {activeTab === 'slider' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Register Dynamic Hero Image Slide</h3>
              <form onSubmit={handleSlideUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" required value={slideTitle} onChange={e => setSlideTitle(e.target.value)}
                  placeholder="Slide Main Title" 
                  className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm animate-in"
                />
                <input 
                  type="text" required value={slideSubtitle} onChange={e => setSlideSubtitle(e.target.value)}
                  placeholder="Slide Subtitle Description" 
                  className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
                <input 
                  type="text" required value={slideUrl} onChange={e => setSlideUrl(e.target.value)}
                  placeholder="Hero Photo URL Link (eg: https://images.unsplash.com/...)" 
                  className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm md:col-span-2"
                />
                <button className="px-5 py-3 bg-[#800000] text-white font-bold rounded-xl text-xs uppercase tracking-wide flex items-center gap-2 justify-center w-fit">
                  <Plus size={14} /> Add Hero Slide
                </button>
              </form>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Dynamic Slide Index</h3>
              <div className="space-y-4">
                {slides.map((s) => (
                  <div key={s._id} className="p-4 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-2xl flex flex-col md:flex-row items-center gap-4 justify-between">
                    <div className="flex items-center gap-4">
                      <img src={s.imageUrl} alt={s.title} className="w-16 h-12 object-cover rounded-lg border border-slate-200" />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{s.title}</h4>
                        <span className="text-xs text-slate-400 block">{s.subtitle}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleSlideToggle(s._id, !s.active)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                          s.active ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {s.active ? 'Disable' : 'Enable'}
                      </button>
                      <button 
                        onClick={() => handleSlideDelete(s._id)}
                        className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardWrapper>
  );
};

const Footer = () => {
  const { navigate } = useContext(RouteContext);
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 border-t-4 border-[#800000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-[#800000] to-rose-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              P
            </div>
            <span className="font-extrabold text-white uppercase tracking-wider text-base">PFC WITEITHIE</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Raising a royal priesthood, transforming families through the uncompromised Word of God along Thika Road.
          </p>
        </div>
        
        <div>
          <h3 className="text-[#87CEEB] font-bold text-sm uppercase tracking-widest mb-5">Quick Access</h3>
          <ul className="space-y-3 text-sm">
            <li><button onClick={() => navigate('about')} className="hover:text-white transition-colors">Our History</button></li>
            <li><button onClick={() => navigate('sermons')} className="hover:text-white transition-colors">Sermon Archives</button></li>
            <li><button onClick={() => navigate('events')} className="hover:text-white transition-colors">Liturgical Calendar</button></li>
            <li><button onClick={() => navigate('give')} className="hover:text-white transition-colors">Kingdom Partnership</button></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[#87CEEB] font-bold text-sm uppercase tracking-widest mb-5">Church Office</h3>
          <ul className="space-y-3.5 text-sm">
            <li className="flex items-start gap-2 text-slate-400"><MapPin size={16} className="text-[#800000] shrink-0 mt-0.5"/> Witeithie, Juja, Thika Road</li>
            <li className="flex items-center gap-2 text-slate-400"><Phone size={16} className="text-[#800000] shrink-0"/> +254 (0) 7XX XXX XXX</li>
            <li className="flex items-center gap-2 text-slate-400"><Mail size={16} className="text-[#800000] shrink-0"/> info@pfcwiteithie.org</li>
          </ul>
        </div>

        <div>
          <h3 className="text-[#87CEEB] font-bold text-sm uppercase tracking-widest mb-5">Weekly Services</h3>
          <ul className="space-y-2 text-xs">
            <li className="flex justify-between border-b border-slate-800 pb-1.5"><span>Sunday 1st Service</span> <span className="font-semibold text-white">7:00 AM</span></li>
            <li className="flex justify-between border-b border-slate-800 pb-1.5"><span>Sunday 2nd Service</span> <span className="font-semibold text-white">9:00 AM</span></li>
            <li className="flex justify-between border-b border-slate-800 pb-1.5"><span>Wednesday Fellowship</span> <span className="font-semibold text-white">5:00 PM</span></li>
            <li className="flex justify-between pb-1.5"><span>First Friday Night Vigil</span> <span className="font-semibold text-white">Monthly Kesha</span></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-xs text-center text-slate-500">
        &copy; {new Date().getFullYear()} Priesthood Fellowship Church Witeithie. All rights reserved. Equipped for ministry.
      </div>
    </footer>
  );
};

const AppRouter = () => {
  const { currentRoute } = useContext(RouteContext);
  const { user } = useContext(AuthContext);

  const renderPage = () => {
    switch (currentRoute) {
      case 'home': return <Home />;
      case 'about': return <About />;
      case 'sermons': return <Sermons />;
      case 'events': return <Events />;
      case 'ministries': return <Ministries />;
      case 'give': return <Give />;
      case 'contact': return <Contact />;
      case 'auth': return <Auth />;
      
      // Portals
      case 'admin': return user?.role === 'admin' ? <AdminPortal /> : <Home />;
      case 'head': return user?.role === 'head' ? <HeadPortal /> : <Home />;
      case 'treasurer': return user?.role === 'treasurer' ? <TreasurerPortal /> : <Home />;
      case 'clerk': return user?.role === 'clerk' ? <ClerkPortal /> : <Home />;
      case 'member': return user?.role === 'member' ? <MemberPortal /> : <Home />;
        
      default: return <Home />;
    }
  };

  const isDashboard = ['admin', 'head', 'treasurer', 'clerk', 'member'].includes(currentRoute);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col">
      {!isDashboard && <NoticeSlider />}
      {!isDashboard && <Navbar />}
      
      <main className="flex-grow flex flex-col">
        {renderPage()}
      </main>

      {!isDashboard && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouteProvider>
          <AppRouter />
        </RouteProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}