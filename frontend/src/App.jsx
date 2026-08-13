import React, { useState, useEffect } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, BarChart3, Activity, Clock, Server, Mail, MessageSquare, History, Trash2, BookOpen, ThumbsDown } from 'lucide-react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function App() {
  const [activeTab, setActiveTab] = useState('scanner');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-sky-500/30">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-sky-500/10 p-1.5 rounded-lg border border-sky-500/20 flex items-center justify-center">
                <img src="/favicon.svg" alt="PhishGuard AI Logo" className="w-7 h-7" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                PhishGuard AI
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('scanner')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'scanner'
                    ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                URL Scanner
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'dashboard'
                    ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                Threat Dashboard
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'history'
                    ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                <History className="w-4 h-4" /> History
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'resources'
                    ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                <BookOpen className="w-4 h-4" /> Tips
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'scanner' && <ScannerView />}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'history' && <HistoryView />}
        {activeTab === 'resources' && <ResourcesView />}
      </main>
    </div>
  );
}

function ScannerView() {
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState('url');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [reported, setReported] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!input) return;

    setLoading(true);
    try {
      const response = await axios.post('https://phishguard-ai-xex8.onrender.com/api/analyze', {
        content: input,
        type: inputType,
        timestamp: new Date().toISOString()
      });
      setResult(response.data);
      setReported(false);
      
      try {
        const historyItem = {
          input,
          type: inputType,
          timestamp: new Date().toISOString(),
          result: response.data
        };
        const existingHistory = JSON.parse(localStorage.getItem('scanHistory') || '[]');
        localStorage.setItem('scanHistory', JSON.stringify([historyItem, ...existingHistory].slice(0, 50)));
      } catch (err) {
        console.error('Failed to save history', err);
      }
    } catch (error) {
      console.error('Error scanning:', error);
      alert('Error connecting to the backend. Is it running?');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Real-time <span className="text-sky-400">Threat Detection</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Analyze URLs, emails, and SMS messages instantly using AI and global threat intelligence.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <form onSubmit={handleScan} className="relative z-10 space-y-6">
          <div className="flex gap-4 p-1 bg-slate-900/50 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setInputType('url')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${inputType === 'url' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25' : 'text-slate-400 hover:text-white'
                }`}
            >
              <Search className="w-4 h-4" /> URL
            </button>
            <button
              type="button"
              onClick={() => setInputType('email')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${inputType === 'email' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25' : 'text-slate-400 hover:text-white'
                }`}
            >
              <Mail className="w-4 h-4" /> Email
            </button>
            <button
              type="button"
              onClick={() => setInputType('sms')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${inputType === 'sms' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25' : 'text-slate-400 hover:text-white'
                }`}
            >
              <MessageSquare className="w-4 h-4" /> SMS
            </button>
          </div>

          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Paste a suspicious ${inputType.toUpperCase()} here...`}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all min-h-[120px] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !input}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5" /> Analyze Content
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className={`glass-panel rounded-2xl p-8 animate-in fade-in zoom-in-95 duration-500 border-t-4 ${result.status === 'Safe' ? 'border-t-emerald-500' :
            result.status === 'Suspicious' ? 'border-t-amber-500' : 'border-t-rose-500'
          }`}>
          <div className="flex items-start gap-6">
            <div className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center border-4 ${result.status === 'Safe' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' :
                result.status === 'Suspicious' ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' :
                  'border-rose-500/30 text-rose-500 bg-rose-500/10'
              }`}>
              <span className="text-2xl font-bold">{result.threat_score}%</span>
            </div>

            <div className="flex-grow space-y-4">
              <div>
                <h3 className={`text-2xl font-bold flex items-center gap-2 ${result.status === 'Safe' ? 'text-emerald-500' :
                    result.status === 'Suspicious' ? 'text-amber-500' : 'text-rose-500'
                  }`}>
                  {result.status === 'Safe' && <CheckCircle className="w-6 h-6" />}
                  {result.status === 'Suspicious' && <AlertTriangle className="w-6 h-6" />}
                  {result.status === 'Phishing' && <Shield className="w-6 h-6" />}
                  {result.status}
                </h3>
                <p className="text-slate-400 mt-1">Risk Level: <span className="text-slate-300 font-medium">{result.risk_level}</span></p>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" /> Detection Reasons
                </h4>
                <ul className="space-y-2">
                  {result.reasons.map((reason, idx) => (
                    <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                      <span className="text-sky-500 mt-1">•</span> {reason}
                    </li>
                  ))}
                  {result.reasons.length === 0 && (
                    <li className="text-sm text-slate-500 italic">No specific threat indicators found.</li>
                  )}
                </ul>
              </div>

              {!reported ? (
                <button 
                  onClick={() => setReported(true)}
                  className="mt-4 flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 transition-colors"
                >
                  <ThumbsDown className="w-4 h-4" /> Report incorrect analysis
                </button>
              ) : (
                <p className="mt-4 text-sm text-sky-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Thank you for your feedback!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const mockChartData = [
  { name: 'Mon', threats: 120 },
  { name: 'Tue', threats: 210 },
  { name: 'Wed', threats: 150 },
  { name: 'Thu', threats: 320 },
  { name: 'Fri', threats: 190 },
  { name: 'Sat', threats: 90 },
  { name: 'Sun', threats: 140 },
];

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

function DashboardView() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // In a real app, fetch from backend
    axios.get('https://phishguard-ai-xex8.onrender.com/api/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <div className="text-center text-slate-400 mt-20">Loading dashboard...</div>;

  const pieData = [
    { name: 'Safe', value: stats.safe },
    { name: 'Suspicious', value: stats.suspicious },
    { name: 'Phishing', value: stats.phishing },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Threat Dashboard</h2>
          <p className="text-slate-400">Overview of system analytics and blocked threats.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
          <Server className="w-4 h-4 text-emerald-400" /> API Online
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Scans" value={stats.total_scans.toLocaleString()} icon={<BarChart3 />} color="sky" />
        <StatCard title="Safe URLs" value={stats.safe.toLocaleString()} icon={<CheckCircle />} color="emerald" />
        <StatCard title="Suspicious" value={stats.suspicious.toLocaleString()} icon={<AlertTriangle />} color="amber" />
        <StatCard title="Phishing Blocked" value={stats.phishing.toLocaleString()} icon={<Shield />} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-400" /> Threat Activity (Last 7 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorThreats)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-6">Threat Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-1 text-sm"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Safe</div>
            <div className="flex items-center gap-1 text-sm"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Suspicious</div>
            <div className="flex items-center gap-1 text-sm"><div className="w-3 h-3 rounded-full bg-rose-500"></div> Phishing</div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-400" /> Recent Detections
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400 border-b border-slate-700/50">
              <tr>
                <th className="pb-3 font-medium">URL/Content</th>
                <th className="pb-3 font-medium">Risk Score</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {stats.recent.map((item, idx) => (
                <tr key={idx} className="group hover:bg-slate-800/20 transition-colors">
                  <td className="py-4 text-slate-300 pr-4 max-w-md truncate">{item.url}</td>
                  <td className="py-4">
                    <span className={`font-mono font-medium ${item.score > 70 ? 'text-rose-400' : item.score > 40 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>{item.score}%</span>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${item.status === 'Safe' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        item.status === 'Suspicious' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorMap = {
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 group hover:bg-slate-800/80 transition-colors">
      <div className={`p-3 rounded-xl border ${colorMap[color]}`}>
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
      </div>
      <div>
        <div className="text-slate-400 text-sm font-medium">{title}</div>
        <div className="text-2xl font-bold text-white mt-1 group-hover:scale-105 transition-transform origin-left">{value}</div>
      </div>
    </div>
  );
}

function HistoryView() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      setHistory(JSON.parse(localStorage.getItem('scanHistory') || '[]'));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('scanHistory');
    setHistory([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Scan History</h2>
          <p className="text-slate-400">Your recent threat analyses (stored locally).</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-colors text-sm font-medium border border-rose-500/20"
          >
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center border-dashed">
          <History className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-slate-300">No history yet</h3>
          <p className="text-slate-500 mt-2">Scans you perform will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  item.result.status === 'Safe' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' :
                  item.result.status === 'Suspicious' ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' :
                  'border-rose-500/30 text-rose-500 bg-rose-500/10'
                }`}>
                <span className="font-bold text-sm">{item.result.threat_score}</span>
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    item.type === 'url' ? 'bg-blue-500/20 text-blue-400' :
                    item.type === 'email' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-pink-500/20 text-pink-400'
                  }`}>{item.type}</span>
                  <span className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-slate-300 text-sm truncate" title={item.input}>{item.input}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                 <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                    item.result.status === 'Safe' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    item.result.status === 'Suspicious' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                  {item.result.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResourcesView() {
  const tips = [
    { title: "Check the Sender", desc: "Always verify the sender's email address, not just their display name. Attackers often use look-alike domains (e.g., support@paypa1.com).", icon: <Mail className="w-5 h-5 text-sky-400" /> },
    { title: "Inspect URLs", desc: "Hover over links before clicking. Ensure they lead to the official website. Beware of subtle misspellings or unusual subdomains.", icon: <Search className="w-5 h-5 text-sky-400" /> },
    { title: "Urgency is a Red Flag", desc: "Phishing attempts often create a false sense of urgency (e.g., 'Your account will be suspended in 24 hours'). Stay calm and verify independently.", icon: <AlertTriangle className="w-5 h-5 text-amber-400" /> },
    { title: "Enable 2FA", desc: "Two-Factor Authentication adds a critical layer of security. Even if attackers get your password, they can't log in without the second factor.", icon: <Shield className="w-5 h-5 text-emerald-400" /> }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold text-white">Educational Resources</h2>
        <p className="text-slate-400 text-lg">Learn how to spot and avoid modern phishing attacks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl hover:bg-slate-800/80 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-700">
                {tip.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">{tip.title}</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{tip.desc}</p>
          </div>
        ))}
      </div>
      
      <div className="glass-panel p-8 rounded-2xl border-l-4 border-l-sky-500 mt-8">
        <h3 className="text-xl font-bold text-white mb-2">What is PhishGuard AI?</h3>
        <p className="text-slate-400">
          PhishGuard AI uses advanced heuristic analysis and machine learning to evaluate the structure, origin, and intent of URLs, emails, and SMS messages. By examining hundreds of indicators (like domain age, SSL presence, keyword density, and structural anomalies), it provides a real-time risk assessment to keep you safe.
        </p>
      </div>
    </div>
  );
}

export default App;
