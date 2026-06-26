import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { CheckCircle } from 'lucide-react';
import {clergyData} from '../assets/assets.js';

const About = () => (
  <div className="animate-in fade-in duration-500 min-h-screen bg-white dark:bg-slate-900 font-sans">
    
    {/* Page Header Section */}
    <PageHeader 
      title="Who We Are" 
      subtitle="Raising a royal priesthood built on truth and apostolic mandate." 
    />

    {}
    {/* The Apostolic Call Section (Your original content) */}
    <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-6">
        <h2 className="text-3xl font-extrabold text-[#800000] dark:text-[#87CEEB] uppercase tracking-wide">
          The Apostolic Call
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Priesthood Fellowship Church, Witeithie Branch, is committed to establishing believers firmly in their royal calling. Following the divine blueprints, we mold families, lead societal transformations, and construct altars of genuine prayer along Thika Road.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {[
            "Uncompromised Truth Teachings",
            "Midnight Delivery Altars",
            "Local Mercy & Huduma Ministry",
            "Equipping The Youth Frontier"
          ].map((item, i) => (
             <div key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-bold group">
               <CheckCircle 
                 className="text-[#800000] dark:text-[#87CEEB] transition-transform duration-300 group-hover:scale-125" 
                 size={20} 
               />
               <span>{item}</span>
             </div>
          ))}
        </div>
      </div>
      
      {/* Visual Graphic */}
      <div className="bg-slate-900/10 dark:bg-slate-800 rounded-2xl h-96 flex items-center justify-center shadow-inner relative overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80" 
          alt="Altar Sanctuary" 
          className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#800000]/30 to-[#87CEEB]/10 mix-blend-multiply" />
        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-2xl" />
      </div>
    </div>

    
    {/* NEW SECTION: Our Clergy */}
    <div className="bg-slate-50 dark:bg-slate-800/30 py-24 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#800000] dark:text-[#87CEEB] uppercase tracking-wide">
            Our Clergy
          </h2>
          <div className="w-20 h-1 bg-[#800000] dark:bg-[#87CEEB] mx-auto mt-6 rounded-full opacity-70"></div>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
            Meet the dedicated and anointed spiritual leaders guiding our congregation in truth and apostolic mandate.
          </p>
        </div>

        {/* Clergy Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10">
          {clergyData.map((member, index) => (
            <div 
              key={index} 
              className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-slate-100 dark:border-slate-700/50"
            >
              {/* Image Container with Aspect Ratio */}
              <div className="aspect-[3/4] overflow-hidden bg-slate-200 dark:bg-slate-700 relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
                {/* Subtle gradient overlay for better text contrast if we wanted text over image, 
                    but here it just adds a nice vignette effect at the bottom of the image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Content Container */}
              <div className="p-6 text-center flex-grow flex flex-col justify-center bg-white dark:bg-slate-800 relative z-10">
                <h3 className="text-lg xl:text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                  {member.name}
                </h3>
                <p className="text-sm xl:text-base font-semibold text-[#800000] dark:text-[#87CEEB] uppercase tracking-wider">
                  {member.role}
                </p>
                
                {/* Decorative underline that expands on hover */}
                <div className="w-0 h-0.5 bg-[#800000] dark:bg-[#87CEEB] mx-auto mt-4 transition-all duration-300 group-hover:w-12 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
    
  </div>
);

export default About;
