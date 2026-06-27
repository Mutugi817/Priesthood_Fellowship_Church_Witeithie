import { useEffect, useState } from "react";
import DashboardWrapper from "../components/DashboardWrapper";
import { Heart } from "lucide-react";

const HeadPortal = () => {
  const [prayers, setPrayers] = useState([]);
  const API_BASE = import.meta.env.VITE_API_BASE;

  const fetchPrayers = async () => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/pastor/prayers`, {
        headers: { 'Authorization': `Bearer ${token}`,
    'ngrok-skip-browser-warning': true }
      });
      if (res.ok) {
        const data = await res.json();
        setPrayers(data);
      }
    } catch (err) {
      console.error("Could not fetch pastoral petition book.");
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, []);

  const handleAltarIntercession = async (id, status) => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/pastor/prayers/${id}/intercede`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': true
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchPrayers();
      }
    } catch (err) {
      console.error("Failed to update status.");
    }
  };

  return (
    <DashboardWrapper roleTitle="Head Pastor Portal" sidebarItems={[{ id: 'pastor', name: 'Altar Petitions', icon: Heart }]} currentSubTab="pastor">
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Intercessory Altar Petition Book</h3>
        <div className="space-y-4">
          {prayers.map((p) => (
            <div key={p._id} className="p-6 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-400">Petitioner:</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">{p.memberName}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{p.request}"</p>
                <span className={`inline-block mt-3 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide rounded-full ${
                  p.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                }`}>
                  Altar: {p.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleAltarIntercession(p._id, 'Prayed For')}
                  className="px-4 py-2 bg-[#800000] text-white text-xs font-bold rounded-lg hover:bg-rose-950 transition-all"
                >
                  Confirm Altar Prayer
                </button>
                <button 
                  onClick={() => handleAltarIntercession(p._id, 'Answered')}
                  className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-all"
                >
                  Mark Answered / Testimony
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default HeadPortal