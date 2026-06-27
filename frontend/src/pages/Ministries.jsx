/** @format */

import React from 'react';
import PageHeader from '../components/PageHeader.jsx';

const Ministries = () => (
  <div className="animate-in fade-in">
    <PageHeader title="Apostolic Fronts" subtitle="Find your specialized area of growth and societal mandate." />
    <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
      {[
        { title: "Gideons Men Ministry", desc: "Equipping household priests, modeling authentic fatherhood, leadership development, and structural community stewardship." },
        { title: "Debora Women Ministry", desc: "Constructing spiritual foundations inside families, maternal health systems, and structured small-scale business support." },
        { title: "Youth", desc: "Leading campus outreaches, artistic and tech masterclasses, crossover nights, and career incubation blocks." },
        { title: "Sunday School", desc: "Familiarizing our children with the voice of the Spirit, creative scriptures workshops, and foundational values modeling." }
      ].map((item, idx) => (
        <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700/50 shadow-md">
          <h3 className="text-2xl font-bold text-[#800000] dark:text-[#448ee4] mb-3 uppercase tracking-wide">{item.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Ministries;
