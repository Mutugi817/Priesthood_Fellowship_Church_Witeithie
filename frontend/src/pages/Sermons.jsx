/** @format */

import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { BookOpen } from 'lucide-react';
import { API_BASE } from '../context/AppContext.jsx';

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

export default Sermons;
