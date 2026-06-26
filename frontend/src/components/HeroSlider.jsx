import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {slides} from '../assets/assets.js'

const HeroSlider = () => {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-[90vh] min-h-[500px] w-full overflow-hidden bg-[#0e498df0]">
      {slides.map((s, idx) => (
        <div 
          key={idx}
          className={`absolute h-full inset-0 transition-opacity duration-1000 ease-in-out ${idx === slide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <img 
            src={s.img} 
            alt={s.title}
            className="w-full h-full object-cover opacity-35 transform scale-105 transition-transform duration-10000"
          />
          {/* <div className="relative h-full inset-0 bg-linear-to-t from-slate-950 via-slate-900/40 to-transparent" /> */}
          <div className="hero-content absolute inset-0 flex flex-col justify-end pb-6 items-center px-4 text-center max-w-5xl mx-auto z-10">
            <span className="py-1 px-4 rounded-full bg-rose-900/65 text-slate-100 font-bold tracking-widest text-xs mb-4 uppercase border border-[#448ee4]/40 animate-fade-in">
              PRIESTHOOD FELLOWSHIP CHURCH
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2 select-none uppercase ">
              {s.title}
            </h1>
            <p className="text-base sm:text-xl text-slate-200 max-w-2xl select-none font-semibold">
              {s.sub}
            </p>
          </div>
        </div>
      ))}
      <button 
        onClick={() => setSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-[#800000] transition-all z-20"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={() => setSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-[#800000] transition-all z-20"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default HeroSlider