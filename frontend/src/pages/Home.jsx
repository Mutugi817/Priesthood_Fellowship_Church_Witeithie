/** @format */

import React, { useContext } from 'react';
import HeroSlider from '../components/HeroSlider.jsx';
import { RouteContext } from '../context/AppContext.jsx';
import { Clock, ChevronRight } from 'lucide-react';

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
                <span className="inline-block px-3 py-1 bg-sky-50 dark:bg-[#800000]/20 rounded-full text-xs font-bold text-[#800000] dark:text-[#448ee4] mb-4">
                  {item.time}
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{item.desc}</p>
              </div>
              <button 
                onClick={() => navigate('about')} 
                className="text-[#800000] dark:text-[#448ee4] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all mt-auto"
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

export default Home;
