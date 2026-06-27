import { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
const AuthContext = createContext();
const RouteContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE;

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('pfc-theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('pfc-theme', newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
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
            headers: {
              'ngrok-skip-browser-warning': true, Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user || null);
          } else {
            localStorage.removeItem('pfc-token');
          }
        } catch (err) {
          console.warn('Auth check failed', err);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true
       },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('pfc-token', data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    }
    return { success: false, message: data.message };
  };

  const register = async (payload) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true
       },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { success: true };
    const data = await res.json();
    return { success: false, message: data.message };
  };

  const logout = () => {
    localStorage.removeItem('pfc-token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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

export {
  ThemeContext,
  AuthContext,
  RouteContext,
  ThemeProvider,
  AuthProvider,
  RouteProvider,
  API_BASE,
};
