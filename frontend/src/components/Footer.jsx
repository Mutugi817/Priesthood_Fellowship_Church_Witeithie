
import React, { useContext } from 'react';
import { RouteContext } from '../context/AppContext';
import {assets} from '../assets/assets.js'
import { Code, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const { navigate } = useContext(RouteContext);
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 border-t-4 border-[#800000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-20 bg-gradient-to-tr from-[#800000] to-rose-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              <img src={assets.logo} alt='logo' />
            </div>
            <span className="font-extrabold text-white uppercase tracking-wider text-base">PFC WITEITHIE</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Raising a royal priesthood, transforming families through the uncompromised Word of God along Thika Road.
          </p>
        </div>
        
        <div>
          <h3 className="text-[#448ee4] font-bold text-sm uppercase tracking-widest mb-5">Quick Access</h3>
          <ul className="space-y-3 text-sm">
            <li><button onClick={() => navigate('about')} className="hover:text-white transition-colors">Our History</button></li>
            <li><button onClick={() => navigate('sermons')} className="hover:text-white transition-colors">Sermon Archives</button></li>
            <li><button onClick={() => navigate('events')} className="hover:text-white transition-colors">Liturgical Calendar</button></li>
            <li><button onClick={() => navigate('give')} className="hover:text-white transition-colors">Kingdom Partnership</button></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[#448ee4] font-bold text-sm uppercase tracking-widest mb-5">Church Office</h3>
          <ul className="space-y-3.5 text-sm">
            <li className="flex items-start gap-2 text-slate-400"><MapPin size={16} className="text-[#800000] shrink-0 mt-0.5"/> Witeithie, Juja, Thika Road</li>
            <li className="flex items-center gap-2 text-slate-400"><Phone size={16} className="text-[#800000] shrink-0"/><a href="tel:+254758931179">0758 931 179</a></li>
            <li className="flex items-center gap-2 text-slate-400"><Phone size={16} className="text-[#800000] shrink-0"/><a href="tel:+254758931179">0725 590 163</a></li>
            <li className="flex items-center gap-2 text-slate-400"><Mail size={16} className="text-[#800000] shrink-0"/><a href="mailto:consolatawambui377@gmail.com">wambuiconsolata377@gmail.com</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[#448ee4] font-bold text-sm uppercase tracking-widest mb-5">Weekly Services</h3>
          <ul className="space-y-2 text-xs">
            <li className="flex justify-between border-b border-slate-800 pb-1.5"><span>Sunday 1st Service</span> <span className="font-semibold text-white">7:00 AM - 9:00 AM</span></li>
            <li className="flex justify-between border-b border-slate-800 pb-1.5"><span>Sunday 2nd Service</span> <span className="font-semibold text-white">9:00 AM - 1:30 PM</span></li>
            <li className="flex justify-between border-b border-slate-800 pb-1.5"><span>Wednesday Fellowship</span> <span className="font-semibold text-white">5:00 PM - 8:00 PM</span></li>
            <li className="flex justify-between border-b border-slate-800 pb-1.5"><span>Huduma Thursday</span> <span className="font-semibold text-white">7:00 PM - 11:00 AM</span></li>
            <li className="flex justify-between pb-1.5"><span>Friday Monthly Kesha</span> <span className="font-semibold text-white">9:00 PM - 5:00 AM</span></li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-slate-500 text-sm sm:flex-col">
        <p className='hover:text-[#448ee4] transition-colors'>&copy; {new Date().getFullYear()} Priesthood Fellowship Church Witeithie. All rights reserved. Equipped for ministry.</p>
        <a className='hover:text-[#448ee4] transition-colors' href="tel:+254115793480" className="text-left">Contact developer: 0115 793 480</a>
      </div>
    </footer>
  );
};

export default Footer;
