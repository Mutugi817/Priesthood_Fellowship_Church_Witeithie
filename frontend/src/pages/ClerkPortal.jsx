/** @format */

import React, { useState } from 'react';
import DashboardWrapper from '../components/DashboardWrapper.jsx';
import { Bell, Calendar, BookOpen, Plus } from 'lucide-react';
import { API_BASE } from '../context/AppContext.jsx';

const ClerkPortal = () => {
  const [activeTab, setActiveTab] = useState('notices');
  const [noticeMsg, setNoticeMsg] = useState('');
  const [feedback, setFeedback] = useState('');

  const sidebarItems = [
    { id: 'notices', name: 'Announcements Board', icon: Bell },
    { id: 'events', name: 'Liturgical Calendar', icon: Calendar },
    { id: 'sermons', name: 'Altar Sermons', icon: BookOpen },
  ];

  const handleNoticeUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/clerk/notices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: noticeMsg }),
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) setNoticeMsg('');
    } catch (err) {
      setFeedback('Error saving notice announcement.');
    }
  };

  return (
    <DashboardWrapper
      roleTitle='Secretariat Clerk'
      sidebarItems={sidebarItems}
      currentSubTab={activeTab}
      onSubTabChange={setActiveTab}>
      <div className='space-y-6'>
        {feedback && (
          <div className='p-4 bg-sky-50 text-xs font-bold text-[#800000] rounded-xl'>
            {feedback}
          </div>
        )}

        {activeTab === 'notices' && (
          <div>
            <h3 className='text-xl font-bold mb-4'>
              <Bell
                size={18}
                className='text-[#800000]'
              />{' '}
              Push Live Top Notice Marquee
            </h3>
            <form
              onSubmit={handleNoticeUpload}
              className='grid grid-cols-1 gap-4'>
              <input
                type='text'
                required
                value={noticeMsg}
                onChange={(e) => setNoticeMsg(e.target.value)}
                placeholder='Announcement message'
                className='px-4 py-3 rounded-xl border'
              />
              <button className='px-5 py-3 bg-[#800000] text-white rounded-xl text-xs uppercase tracking-wide flex items-center gap-2 w-fit'>
                <Plus size={14} /> Update Marquee
              </button>
            </form>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <h3 className='text-xl font-bold mb-4'>
              <Calendar
                size={18}
                className='text-[#800000]'
              />{' '}
              Register Calendar Gathering
            </h3>
            <p className='text-sm text-slate-500'>
              Use the clerk admin tools to schedule calendar events (simplified
              interface here).
            </p>
          </div>
        )}

        {activeTab === 'sermons' && (
          <div>
            <h3 className='text-xl font-bold mb-4'>
              <BookOpen
                size={18}
                className='text-[#800000]'
              />{' '}
              Archive Altar Teachings
            </h3>
            <p className='text-sm text-slate-500'>
              Upload sermons from this workspace or link external media.
            </p>
          </div>
        )}
      </div>
    </DashboardWrapper>
  );
};

export default ClerkPortal;
