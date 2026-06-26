/** @format */

import React, { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { MapPin } from 'lucide-react';
import { API_BASE } from '../context/AppContext.jsx';

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

export default Contact;
