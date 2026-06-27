import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

function NoticeSlider() {
  const [notices, setNotices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const apiUrl = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch(`${apiUrl}/notices`, {headers: {'ngrok-skip-browser-warning': true} });
        if (res.ok) {
          const data = await res.json();
          setNotices(data || []);
        }
      } catch (error) {
        console.warn('Could not sync live notice slider.');
        throw error;
      }
    };
    fetchNotices();
  }, [apiUrl]);

  useEffect(() => {
    if (notices.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [notices.length]);

  if (notices.length === 0) {
    return (
      <div className='bg-[#800000] text-slate-100 py-2.5 px-4 text-center text-xs font-semibold tracking-wide border-b border-[#87CEEB]/25 flex items-center justify-center gap-2'>
        <Bell
          size={13}
          className='text-[#87CEEB]'
        />
        📢 Welcome to Priesthood Fellowship Church — Sunday Services start at
        7:00 AM
      </div>
    );
  }

  return (
    <div className='hidden md:block bg-[#800000] text-slate-100 py-2.5 px-4 text-center text-xs font-semibold tracking-wide border-b border-[#87CEEB]/25 overflow-hidden relative'>
      <div className='flex justify-center items-center gap-2 max-w-5xl mx-auto'>
        <Bell
          size={14}
          className='text-[#87CEEB] shrink-0 animate-bounce'
        />
        <span className='transition-all duration-700 ease-in-out transform'>
          {notices[currentIndex]?.message}
        </span>
      </div>
    </div>
  );
}

export default NoticeSlider;
