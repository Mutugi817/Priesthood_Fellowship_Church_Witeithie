import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { API_BASE } from '../context/AppContext.jsx';
import { assets } from '../assets/assets.js';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE}/events`, {headers: {'ngrok-skip-browser-warning': true}});
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
              <div key={e._id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
                <img className='w-full rounded-2xl' src={e.image} />
                <div className='p-8'>
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

export default Events;
