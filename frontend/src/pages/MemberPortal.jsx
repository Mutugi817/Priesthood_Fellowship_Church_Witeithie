import { useEffect, useState } from "react";
import DashboardWrapper from "../components/DashboardWrapper";
import { Send, User } from "lucide-react";

// --- MEMBER PORTAL ---
const MemberPortal = () => {

    const API_BASE = import.meta.env.VITE_API_BASE;
  const [personalGivings, setPersonalGivings] = useState([]);
  const [prayerReq, setPrayerReq] = useState('');
  const [feedback, setFeedback] = useState('');

  const fetchPersonalLogs = async () => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/member/giving`, {
        headers: { 'Authorization': `Bearer ${token}`,
    'ngrok-skip-browser-warning': true }
      });
      if (res.ok) {
        const data = await res.json();
        setPersonalGivings(data);
      }
    } catch (err) {
      console.error("Failed to load giving ledger.");
    }
  };

  useEffect(() => {
    fetchPersonalLogs();
  }, []);

  const handlePrayerRequest = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/member/prayer`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': true
        },
        body: JSON.stringify({ request: prayerReq })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) setPrayerReq('');
    } catch (err) {
      setFeedback('Petition server offline.');
    }
  };

  return (
    <DashboardWrapper roleTitle="Member Portal" sidebarItems={[{ id: 'member', name: 'Member Home', icon: User }]} currentSubTab="member">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4 flex items-center gap-2">
            <Send size={18} className="text-[#800000]" /> Place petition on Altar
          </h3>
          <form onSubmit={handlePrayerRequest} className="space-y-4">
            {feedback && (
              <div className="p-4 bg-sky-50 dark:bg-sky-950/40 text-xs font-bold text-[#800000] dark:text-[#448ee4] rounded-xl text-center">
                {feedback}
              </div>
            )}
            <textarea 
              required 
              rows="5"
              value={prayerReq}
              onChange={e => setPrayerReq(e.target.value)}
              placeholder="Type your family or individual petitions here..."
              className="w-full p-4 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm"
            ></textarea>
            <button className="px-6 py-3 bg-[#800000] text-white font-bold rounded-xl text-xs uppercase tracking-wide shadow-md">
              Place Petition On Altar
            </button>
          </form>
        </div>

        {/* <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">My Financial Contributions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2 text-right">Amount (KES)</th>
                </tr>
              </thead>
              <tbody>
                {personalGivings.map((g, index) => (
                  <tr key={index} className="border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    <td className="py-3 px-2">{g.purpose}</td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-green-600">+{g.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}
      </div>
    </DashboardWrapper>
  );
};

export default MemberPortal