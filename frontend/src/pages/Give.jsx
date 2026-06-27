/** @format */

import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { Landmark } from 'lucide-react';


const Give = () => {
  return (
    <div className="animate-in fade-in">
      <PageHeader title="Altar Covenant Partnering" subtitle="Support church building expansions and missionary Huduma campaigns." />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border-t-4 border-[#800000]">
          <h3 className="text-2xl font-bold text-center mb-8 text-[#800000] dark:text-[#448ee4] uppercase tracking-wide">Secured Channels</h3>
          <div className="space-y-6">
            <div className="p-6 border border-slate-150 dark:border-slate-700 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-extrabold text-lg shrink-0">
                MP
              </div>
              <div>
                <h4 className="font-bold text-lg dark:text-white">M-PESA Covenant Line</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Phone Number: <span className="font-mono font-bold text-slate-800 dark:text-white">0758 931 179</span></p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-6 border border-slate-150 dark:border-slate-700 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-extrabold text-lg shrink-0">
                MP
              </div>
              <div>
                <h4 className="font-bold text-lg dark:text-white">M-PESA Paybill</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Paybill Number: <span className="font-mono font-bold text-slate-800 dark:text-white">522522</span></p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Account Number: <span className="font-mono font-bold text-slate-800 dark:text-white">1336031433</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Give;
