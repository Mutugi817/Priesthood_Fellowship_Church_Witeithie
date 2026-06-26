import { useContext, useState } from "react";
import { AuthContext, RouteContext, ThemeContext } from "../context/AppContext";
import { LogIn, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { assets } from "../assets/assets";

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
    <nav className="fixed w-full top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex-shrink-0 flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNav('home')}
          >
            <div className="w-10 to-rose-900 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-all shadow-md">
              <img src="https://d1csarkz8obe9u.cloudfront.net/uploads/thumbs/b152ba41d77fa8bd52b4c49ec1138bdf.png?" alt="logo" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold leading-tight text-[#800000] dark:text-slate-100 uppercase tracking-wider text-xs">PRIESTHOOD FELLOWSHIP</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-widest">CHURCH WITEITHIE BRANCH</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => handleNav(link.route)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                  currentRoute === link.route
                    ? 'text-[#800000] dark:text-[#448ee4] bg-rose-50 dark:bg-slate-800'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#800000] dark:hover:text-[#448ee4] hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all">
              {theme === 'dark' ? <Sun size={19} className="text-[#448ee4]" /> : <Moon size={19} className="text-[#800000]" />}
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
                className="flex items-center gap-2 bg-gradient-to-r from-[#800000] to-rose-900 text-white font-bold px-6 py-2.5 rounded-full hover:shadow-lg transition-all border border-[#448ee4]/20 text-sm"
              >
                <LogIn size={15} />
                Portal Sign-In
              </button>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-2">
            {/* <button onClick={toggleTheme} className="p-2 rounded-full text-slate-600 dark:text-slate-300">
              {theme === 'dark' ? <Sun size={20} className="text-[#448ee4]" /> : <Moon size={20} className="text-[#800000]" />}
            </button> */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="absolute text-slate-600 cursor-pointer dark:text-slate-300 hover:text-[#800000] p-2"
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
                    ? 'text-[#800000] dark:text-[#448ee4] bg-rose-50 dark:bg-slate-800'
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

export default Navbar;