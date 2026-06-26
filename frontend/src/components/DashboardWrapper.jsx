/** @format */

import React, { useContext } from 'react';
import { AuthContext, RouteContext } from '../context/AppContext.jsx';
import { LogOut } from 'lucide-react';

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

export default DashboardWrapper;
