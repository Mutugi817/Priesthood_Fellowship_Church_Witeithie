import { useState } from "react";
import DashboardWrapper from "../components/DashboardWrapper";
import { DollarSign } from "lucide-react";

// --- TREASURER PORTAL ---
const TreasurerPortal = () => {
  const [givingRecords, setGivingRecords] = useState([]);
  const [memberName, setMemberName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('Tithe');
  const [feedback, setFeedback] = useState('');

  const fetchLogs = async () => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/treasurer/giving`, {
        headers: { 'Authorization': `Bearer ${token}`,
      'ngrok-skip-browser-warning': true }
      });
      if (res.ok) {
        const data = await res.json();
        setGivingRecords(data);
      }
    } catch (err) {
      console.error("Could not fetch giving ledger.");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleGivingPost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/treasurer/giving`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': true
        },
        body: JSON.stringify({ memberName, email, amount: Number(amount), purpose })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) {
        setMemberName(''); setEmail(''); setAmount('');
        fetchLogs();
      }
    } catch (err) {
      setFeedback('Error writing to financial database.');
    }
  };

  return (
    <DashboardWrapper roleTitle="Ministry Treasurer" sidebarItems={[{ id: 'ledger', name: 'Financial Ledger', icon: DollarSign }]} currentSubTab="ledger">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 border-r border-slate-100 dark:border-slate-800 pr-0 lg:pr-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4 flex items-center gap-2">
            <DollarSign size={18} className="text-[#800000]" /> Record New Contribution
          </h3>
          <form onSubmit={handleGivingPost} className="space-y-4">
            {feedback && (
              <div className="p-4 bg-sky-50 dark:bg-sky-950/40 text-xs font-bold text-[#800000] dark:text-[#448ee4] rounded-xl text-center">
                {feedback}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Contributor Name</label>
              <input 
                type="text" 
                required 
                value={memberName}
                onChange={e => setMemberName(e.target.value)}
                placeholder="e.g. Esther M." 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Primary Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="registered-email@pfc.org" 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Amount (KES)</label>
              <input 
                type="number" 
                required 
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Amount in Shillings" 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Classification Purpose</label>
              <select 
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none"
              >
                <option value="Tithe">Tithe</option>
                <option value="Thanksgiving">Thanksgiving</option>
                <option value="Building Fund">Building Fund</option>
                <option value="Offertory">Offertory</option>
                <option value="General Ministry">General Ministry</option>
              </select>
            </div>
            <button className="w-full bg-[#800000] text-white py-3.5 rounded-xl font-bold hover:bg-rose-950 transition-all text-sm uppercase tracking-wider">
              Log giving transaction
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Financial Audit Ledger</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                  <th className="py-3 px-2">Contributor</th>
                  <th className="py-3 px-2">Allocation</th>
                  <th className="py-3 px-2 text-right">Amount (KES)</th>
                </tr>
              </thead>
              <tbody>
                {givingRecords.map((r) => (
                  <tr key={r._id} className="border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    <td className="py-3 px-2 capitalize">{r.memberName}</td>
                    <td className="py-3 px-2">{r.purpose}</td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-green-600">+{r.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
};


export default TreasurerPortal