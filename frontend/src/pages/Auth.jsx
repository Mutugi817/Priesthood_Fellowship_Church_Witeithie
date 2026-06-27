import React, { useState, useContext } from 'react';
import { AuthContext, RouteContext } from '../context/AppContext.jsx';
import { assets } from '../assets/assets.js';

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
        <div className='text-center'>
          <div className="w-20 mx-auto bg-linear-to-tr from-[#800000] to-rose-950 rounded-xl flex items-center justify-center shadow-lg">
            <img className="w-20 mx-auto bg-linear-to-tr from-[#800000] to-rose-950 rounded-xl flex items-center justify-center shadow-lg" src={assets.logo} alt="logo" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
            {isLogin ? 'Ecclesiastical Portal' : 'Register Member Account'}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isLogin ? "Authenticate To Login" : "Partner formally with PFC Witeithie Branch"}
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
                placeholder="Lucy Mumbi" 
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
              placeholder="lucymumbi@gmail.com" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-250 dark:border-slate-650 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#800000] text-sm" 
              placeholder="••••••••" 
            />
          </div>

          <button type="submit" className="w-full bg-[#800000] text-white py-3.5 rounded-xl font-bold hover:bg-rose-950 transition-all text-sm uppercase tracking-wider shadow-md cursor-pointer">
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

export default Auth;
