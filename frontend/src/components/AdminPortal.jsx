const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState({});
  const [users, setUsers] = useState([]);
  const [givingRecords, setGivingRecords] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [feedback, setFeedback] = useState('');

  // Form Fields State
  const [editConfigKey, setEditConfigKey] = useState('');
  const [editConfigVal, setEditConfigVal] = useState('');

  const [notTitle, setNotTitle] = useState('');
  const [notPreacher, setNotPreacher] = useState('');
  const [notDate, setNotDate] = useState('');
  const [notDuration, setNotDuration] = useState('');
  const [notTags, setNotTags] = useState('');

  const [evTitle, setEvTitle] = useState('');
  const [evDate, setEvDate] = useState('');
  const [evLoc, setEvLoc] = useState('');
  const [evDesc, setEvDesc] = useState('');

  const [notMsg, setNotMsg] = useState('');

  const [conName, setConName] = useState('');
  const [conEmail, setConEmail] = useState('');
  const [conAmount, setConAmount] = useState('');
  const [conPurpose, setConPurpose] = useState('Tithe');

  const [slideTitle, setSlideTitle] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideUrl, setSlideUrl] = useState('');
  const [slides, setSlides] = useState([]);

  const sidebarItems = [
    { id: 'overview', name: 'Workstation Home', icon: Shield },
    { id: 'users', name: 'User Directory', icon: User },
    { id: 'config', name: 'System Configurations', icon: Settings },
    { id: 'giving', name: 'Treasury & Giving', icon: DollarSign },
    { id: 'prayers', name: 'Pastoral Prayer Book', icon: Heart },
    { id: 'contacts', name: 'Contact Inboxes', icon: Mail },
    { id: 'notices', name: 'Announcements (Notices)', icon: Bell },
    { id: 'events', name: 'Calendar Scheduling', icon: Calendar },
    { id: 'sermons', name: 'Sermon Library', icon: BookOpen },
    { id: 'slider', name: 'Hero Image Slider', icon: ChevronRight },
  ];

  const fetchMetrics = async () => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/metrics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Could not load admin stats.");
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch user profiles.");
    }
  };

  const fetchGivings = async () => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/treasurer/giving`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGivingRecords(data);
      }
    } catch (err) {
      console.error("Failed to load global transaction logs.");
    }
  };

  const fetchPrayers = async () => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/pastor/prayers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPrayers(data);
      }
    } catch (err) {
      console.error("Failed to load pastoral petition records.");
    }
  };

  const fetchContacts = async () => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/contacts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (err) {
      console.error("Failed to load contact logs.");
    }
  };

  const fetchSlides = async () => {
    try {
      const res = await fetch(`${API_BASE}/slides`);
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
      }
    } catch (err) {
      console.error("Failed to load hero configurations.");
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchUsers();
    fetchGivings();
    fetchPrayers();
    fetchContacts();
    fetchSlides();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) fetchUsers();
    } catch (err) {
      setFeedback('Failed to adjust user dynamic authorization rules.');
    }
  };

  const handleUserDelete = async (userId) => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) fetchUsers();
    } catch (err) {
      setFeedback('Error purging member configuration profile.');
    }
  };

  const handleConfigUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/configs`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ key: editConfigKey, value: editConfigVal })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) {
        setEditConfigKey(''); setEditConfigVal('');
      }
    } catch (err) {
      setFeedback('Failed to synchronize global settings.');
    }
  };

  const handleContributionSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/treasurer/giving`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ memberName: conName, email: conEmail, amount: Number(conAmount), purpose: conPurpose })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) {
        setConName(''); setConEmail(''); setConAmount('');
        fetchGivings();
      }
    } catch (err) {
      setFeedback('Failed to write contribution to ledger.');
    }
  };

  const handleNoticeUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/clerk/notices`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: notMsg })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) setNotMsg('');
    } catch (err) {
      setFeedback('Error creating announcement.');
    }
  };

  const handleEventUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/clerk/events`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: evTitle, date: evDate, location: evLoc, description: evDesc })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) {
        setEvTitle(''); setEvDate(''); setEvLoc(''); setEvDesc('');
        fetchMetrics();
      }
    } catch (err) {
      setFeedback('Failed to create calendar convocation.');
    }
  };

  const handleSermonUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/clerk/sermons`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: notTitle, preacher: notPreacher, date: notDate, duration: notDuration, tags: notTags.split(',').map(t=>t.trim()) })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) {
        setNotTitle(''); setNotPreacher(''); setNotDate(''); setNotDuration(''); setNotTags('');
        fetchMetrics();
      }
    } catch (err) {
      setFeedback('Failed to archive sermon.');
    }
  };

  const handleSlideUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/slides`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: slideTitle, subtitle: slideSubtitle, imageUrl: slideUrl })
      });
      const data = await res.json();
      setFeedback(data.message);
      if (res.ok) {
        setSlideTitle(''); setSlideSubtitle(''); setSlideUrl('');
        fetchSlides();
      }
    } catch (err) {
      setFeedback('Failed to record layout slide.');
    }
  };

  const handleSlideToggle = async (id, activeStatus) => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/slides/${id}/toggle`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ active: activeStatus })
      });
      if (res.ok) fetchSlides();
    } catch (err) {
      console.error("Failed to alter slide state.");
    }
  };

  const handleSlideDelete = async (id) => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/slides/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchSlides();
    } catch (err) {
      console.error("Failed to clear slide state.");
    }
  };

  const handleAltarIntercession = async (id, status) => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/pastor/prayers/${id}/intercede`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchPrayers();
    } catch (err) {
      console.error("Failed to intercede.");
    }
  };

  const handleContactToggle = async (id, readStatus) => {
    const token = localStorage.getItem('pfc-token');
    try {
      const res = await fetch(`${API_BASE}/admin/contacts/${id}/read`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ read: readStatus })
      });
      if (res.ok) fetchContacts();
    } catch (err) {
      console.error("Failed to change read state.");
    }
  };

  return (
    <DashboardWrapper roleTitle="System Administrator" sidebarItems={sidebarItems} currentSubTab={activeTab} onSubTabChange={setActiveTab}>
      <div className="space-y-12">
        {feedback && (
          <div className="p-4 bg-sky-50 dark:bg-sky-950/40 text-xs font-bold text-[#800000] dark:text-[#87CEEB] rounded-xl text-center">
            {feedback}
          </div>
        )}

        {activeTab === 'overview' && (
          <div>
            <h3 className="text-xl font-bold text-[#800000] dark:text-white uppercase mb-6">Environment Database Health & Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Registered Members</span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics?.totalRegisteredMembers || 0}</span>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Archived Sermons</span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics?.archivedSermons || 0}</span>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Gatherings</span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics?.upcomingEvents || 0}</span>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Unread Enquiries</span>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics?.unreadInteractions || 0}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">User Dynamic Access Control Panel</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-150 dark:border-slate-800 text-slate-400 font-bold">
                    <th className="py-3 px-2">Name</th>
                    <th className="py-3 px-2">Email</th>
                    <th className="py-3 px-2">Authorization Role</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-slate-100 dark:border-slate-850 text-slate-600 dark:text-slate-300">
                      <td className="py-4 px-2 font-bold capitalize">{u.name}</td>
                      <td className="py-4 px-2">{u.email}</td>
                      <td className="py-4 px-2">
                        <select 
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded px-2.5 py-1.5 outline-none border border-slate-200 dark:border-slate-700 capitalize"
                        >
                          <option value="member">Member</option>
                          <option value="clerk">Clerk</option>
                          <option value="treasurer">Treasurer</option>
                          <option value="head">Head Pastor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <button 
                          onClick={() => handleUserDelete(u._id)}
                          className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200"
                        >
                          Purge Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Global Church Constant Parameters</h3>
            <form onSubmit={handleConfigUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                required 
                value={editConfigKey}
                onChange={e => setEditConfigKey(e.target.value)}
                placeholder="Key (e.g. till_number)" 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="text" 
                required 
                value={editConfigVal}
                onChange={e => setEditConfigVal(e.target.value)}
                placeholder="Setting Value" 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <button className="px-5 py-3 bg-[#800000] text-white font-bold rounded-xl text-xs uppercase tracking-wide flex items-center gap-2 justify-center w-fit md:col-span-2">
                Commit Config Changes
              </button>
            </form>
          </div>
        )}

        {activeTab === 'giving' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in">
            <div className="lg:col-span-1 border-r border-slate-100 dark:border-slate-800 pr-0 lg:pr-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Add Direct Contribution</h3>
              <form onSubmit={handleContributionSubmit} className="space-y-4">
                <input 
                  type="text" required value={conName} onChange={e=>setConName(e.target.value)}
                  placeholder="Contributor Name" 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
                <input 
                  type="email" required value={conEmail} onChange={e=>setConEmail(e.target.value)}
                  placeholder="Contributor Email" 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
                <input 
                  type="number" required value={conAmount} onChange={e=>setConAmount(e.target.value)}
                  placeholder="Amount (KES)" 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
                <select 
                  value={conPurpose} onChange={e=>setConPurpose(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none"
                >
                  <option value="Tithe">Tithe</option>
                  <option value="Thanksgiving">Thanksgiving</option>
                  <option value="Building Fund">Building Fund</option>
                  <option value="Offertory">Offertory</option>
                  <option value="General Ministry">General Ministry</option>
                </select>
                <button className="w-full bg-[#800000] text-white py-3.5 rounded-xl font-bold hover:bg-rose-950 transition-all text-sm uppercase tracking-wider">
                  Log Contribution
                </button>
              </form>
            </div>
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Audit Ledger View</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2">Type</th>
                      <th className="py-3 px-2 text-right">KES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {givingRecords.map((r) => (
                      <tr key={r._id} className="border-b border-slate-100 dark:border-slate-850 text-slate-600 dark:text-slate-300">
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
        )}

        {activeTab === 'prayers' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Intercessory Altar Petitions</h3>
            <div className="space-y-4 animate-in">
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
                      Mark Prayed For
                    </button>
                    <button 
                      onClick={() => handleAltarIntercession(p._id, 'Answered')}
                      className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-750 transition-all"
                    >
                      Answered Testimony
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Contact Inbox Messages</h3>
            <div className="space-y-4">
              {contacts.map((c) => (
                <div key={c._id} className="p-6 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-400">{new Date(c.createdAt).toLocaleString()}</span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1 capitalize">{c.name} ({c.email})</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 italic">"{c.message}"</p>
                  </div>
                  <div>
                    {c.read ? (
                      <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/20 px-3 py-1 rounded-full">Read</span>
                    ) : (
                      <button 
                        onClick={() => handleContactToggle(c._id, true)}
                        className="px-4 py-2 bg-[#800000] text-white text-xs font-bold rounded-lg hover:bg-rose-950 transition-all"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notices' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Upload Live Announcement Marquee</h3>
            <form onSubmit={handleNoticeUpload} className="grid grid-cols-1 gap-4 animate-in">
              <input 
                type="text" required value={notMsg} onChange={e => setNotMsg(e.target.value)}
                placeholder="Alert Message Content" 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <button className="px-5 py-3 bg-[#800000] text-white font-bold rounded-xl text-xs uppercase tracking-wide flex items-center gap-2 justify-center w-fit">
                <Plus size={14} /> Update Slider
              </button>
            </form>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Register Gathering Calendar</h3>
            <form onSubmit={handleEventUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in">
              <input 
                type="text" required value={evTitle} onChange={e => setEvTitle(e.target.value)}
                placeholder="Gathering Title" 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="datetime-local" required value={evDate} onChange={e => setEvDate(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="text" required value={evLoc} onChange={e => setEvLoc(e.target.value)}
                placeholder="Location" 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm md:col-span-2"
              />
              <textarea 
                required value={evDesc} onChange={e => setEvDesc(e.target.value)}
                placeholder="Details of structural mandate..."
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm md:col-span-2"
              ></textarea>
              <button className="px-5 py-3 bg-[#800000] text-white font-bold rounded-xl text-xs uppercase tracking-wide flex items-center gap-2 justify-center w-fit">
                <Plus size={14} /> Schedule Gathering
              </button>
            </form>
          </div>
        )}

        {activeTab === 'sermons' && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Archive Teachings Altar</h3>
            <form onSubmit={handleSermonUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in">
              <input 
                type="text" required value={notTitle} onChange={e => setNotTitle(e.target.value)}
                placeholder="Sermon Title" 
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="text" required placeholder="Preacher" value={notPreacher} onChange={e => setNotPreacher(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="date" required value={notDate} onChange={e => setNotDate(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="text" required placeholder="Duration e.g. 50 mins" value={notDuration} onChange={e => setNotDuration(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <input 
                type="text" required placeholder="Tags (separated by comma)" value={notTags} onChange={e => setNotTags(e.target.value)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm md:col-span-2"
              />
              <button className="px-5 py-3 bg-[#800000] text-white font-bold rounded-xl text-xs uppercase tracking-wide flex items-center gap-2 justify-center w-fit">
                <Plus size={14} /> Archive Sermon Record
              </button>
            </form>
          </div>
        )}

        {activeTab === 'slider' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Register Dynamic Hero Image Slide</h3>
              <form onSubmit={handleSlideUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" required value={slideTitle} onChange={e => setSlideTitle(e.target.value)}
                  placeholder="Slide Main Title" 
                  className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm animate-in"
                />
                <input 
                  type="text" required value={slideSubtitle} onChange={e => setSlideSubtitle(e.target.value)}
                  placeholder="Slide Subtitle Description" 
                  className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
                <input 
                  type="text" required value={slideUrl} onChange={e => setSlideUrl(e.target.value)}
                  placeholder="Hero Photo URL Link (eg: https://images.unsplash.com/...)" 
                  className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm md:col-span-2"
                />
                <button className="px-5 py-3 bg-[#800000] text-white font-bold rounded-xl text-xs uppercase tracking-wide flex items-center gap-2 justify-center w-fit">
                  <Plus size={14} /> Add Hero Slide
                </button>
              </form>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase mb-4">Dynamic Slide Index</h3>
              <div className="space-y-4">
                {slides.map((s) => (
                  <div key={s._id} className="p-4 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-2xl flex flex-col md:flex-row items-center gap-4 justify-between">
                    <div className="flex items-center gap-4">
                      <img src={s.imageUrl} alt={s.title} className="w-16 h-12 object-cover rounded-lg border border-slate-200" />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{s.title}</h4>
                        <span className="text-xs text-slate-400 block">{s.subtitle}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleSlideToggle(s._id, !s.active)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                          s.active ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {s.active ? 'Disable' : 'Enable'}
                      </button>
                      <button 
                        onClick={() => handleSlideDelete(s._id)}
                        className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardWrapper>
  );
};