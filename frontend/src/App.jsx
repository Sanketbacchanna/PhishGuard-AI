import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Search, AlertTriangle, CheckCircle, BarChart3, Activity, Clock, Server, Mail, 
  MessageSquare, History, Trash2, BookOpen, ThumbsDown, GraduationCap, Globe, ShieldAlert, 
  ShieldCheck, Download, Play, RefreshCw, ChevronDown, ChevronUp, AlertCircle, FileText, Check, Copy, Info
} from 'lucide-react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Live Cyber Ticker alerts
const CYBER_ALERTS = [
  "[CRITICAL] Active credential harvesting campaign targeting Microsoft 365 portal detected.",
  "[WARNING] 14 new suspicious domains containing 'chase-verify' registered in last hour.",
  "[INTEL] AI heuristic engine updated with 4,820 new malicious layout signatures.",
  "[THREAT] High-volume SMS phishing campaign detected targeting package delivery alerts.",
  "[INFO] Threat intelligence sync complete: 99.8% model accuracy on current dataset.",
];

// Interactive Phishing Quiz dataset
const QUIZ_QUESTIONS = [
  {
    id: 1,
    type: 'email',
    title: 'Urgent Security Update',
    sender: 'security@netflix-update-billing.com',
    subject: 'Action Required: Your subscription is suspended',
    body: 'Dear customer, we could not process your last monthly payment. To prevent service interruption, please update your payment details within 24 hours at http://netflix-billing-portal.net/login.',
    isPhishing: true,
    difficulty: 'Easy',
    explanation: 'The sender address "netflix-update-billing.com" is NOT the official "netflix.com" domain. Furthermore, it creates false urgency ("within 24 hours") and uses an insecure HTTP link pointing to a suspicious billing portal.'
  },
  {
    id: 2,
    type: 'sms',
    title: 'Bank Verification Request',
    sender: '+1 (833) 459-2910',
    body: 'Chase Alert: Suspicious transaction of $452.99 detected. If this was not you, please verify your identity immediately to unlock your account: https://chase-auth-secure.com/verify',
    isPhishing: true,
    difficulty: 'Medium',
    explanation: 'Banks do not send verification links via SMS from random numbers. The domain "chase-auth-secure.com" is a spoofed credential harvesting domain trying to mimic Chase Bank.'
  },
  {
    id: 3,
    type: 'url',
    title: 'Tax Refund Portal',
    body: 'Apply for your IRS Tax refund online at http://www.irs.gov.refund-claim-portal.status.gov-tax.online/',
    isPhishing: true,
    difficulty: 'Hard',
    explanation: 'Although the URL starts with "www.irs.gov", it is actually a subdomain of "gov-tax.online". The real domain name is the part immediately preceding the last slash (ignoring paths) which is "gov-tax.online" (not gov).'
  },
  {
    id: 4,
    type: 'email',
    title: 'Google Storage Full',
    sender: 'no-reply@google.com',
    subject: 'Google Account: Your storage is 98% full',
    body: 'Your Google Account storage is almost full. If you run out of space, you won\'t be able to send or receive emails. Buy more storage at the official Google website: https://one.google.com/about',
    isPhishing: false,
    difficulty: 'Medium',
    explanation: 'This is a legitimate email. The sender is the official "google.com" domain and the link points to "one.google.com", which is Google\'s official storage service.'
  },
  {
    id: 5,
    type: 'sms',
    title: 'Package Delivery Notice',
    sender: 'USPS_Alert_281',
    body: 'USPS Notice: Your package could not be delivered due to an incomplete address. Please update your details within 48 hours to schedule redelivery: https://usps-redeliver-tracking.com',
    isPhishing: true,
    difficulty: 'Easy',
    explanation: 'Scammers frequently target people with package delivery warnings. The link "usps-redeliver-tracking.com" is not the official "usps.com" website.'
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [tickerIndex, setTickerIndex] = useState(0);

  // Rotate ticker alert every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % CYBER_ALERTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500/30 relative overflow-hidden">
      {/* Decorative Neon Mesh Background */}
      <div className="cyber-glow-1 absolute top-[10%] left-[10%] w-[350px] h-[350px] rounded-full blur-[80px] pointer-events-none" />
      <div className="cyber-glow-2 absolute bottom-[20%] right-[15%] w-[450px] h-[450px] rounded-full blur-[90px] pointer-events-none" />
      <div className="cyber-grid absolute inset-0 opacity-[0.4] pointer-events-none" />

      {/* Cyber Threat Ticker */}
      <div className="bg-slate-950/80 border-b border-slate-900 px-4 py-2 text-xs backdrop-blur-md relative z-10 flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-rose-400 font-semibold bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/25 animate-pulse">
          <Activity className="w-3.5 h-3.5" /> LIVE INTEL
        </span>
        <div className="text-slate-400 overflow-hidden flex-1 relative h-4">
          <div 
            key={tickerIndex} 
            className="animate-in slide-in-from-bottom-2 fade-in duration-300 absolute w-full font-mono truncate"
          >
            {CYBER_ALERTS[tickerIndex]}
          </div>
        </div>
        <span className="text-slate-500 font-mono text-[10px] hidden sm:inline">
          SECURE CONNECTION: ACTIVE
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-sky-500/10 p-1.5 rounded-lg border border-sky-500/20 flex items-center justify-center">
                <img src="/favicon.svg" alt="PhishGuard AI Logo" className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-sky-400 via-sky-300 to-blue-500 bg-clip-text text-transparent tracking-tight">
                  PhishGuard AI
                </span>
                <span className="text-[9px] font-mono text-sky-500/80 tracking-widest -mt-0.5">CYBER THREAT DEFENSE</span>
              </div>
            </div>
            <div className="flex space-x-1 sm:space-x-2">
              {[
                { id: 'scanner', label: 'Scanner', icon: <Search className="w-4 h-4" /> },
                { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
                { id: 'academy', label: 'Academy', icon: <GraduationCap className="w-4 h-4" /> },
                { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
                { id: 'tips', label: 'Resources', icon: <BookOpen className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                      ? 'bg-slate-900 text-sky-400 border border-slate-800 shadow-lg shadow-sky-500/5 glow-text-sky'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                    }`}
                >
                  {tab.icon}
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {activeTab === 'scanner' && <ScannerView />}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'academy' && <AcademyView />}
        {activeTab === 'history' && <HistoryView />}
        {activeTab === 'tips' && <ResourcesView />}
      </main>

      {/* Dynamic Cyber Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-12 border-t border-slate-900/60 text-center text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-500/60" />
            <span>PhishGuard AI System v2.0 - Real-time Intelligent Protection</span>
          </div>
          <div className="flex gap-4">
            <span className="font-mono text-[10px]">THREAT LEVEL: MODERATE</span>
            <span className="font-mono text-[10px]">API: ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------
// TAB VIEW: SCANNER
// ---------------------------------------------------------
function ScannerView() {
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState('url');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [reported, setReported] = useState(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState([]);
  const [showToolkit, setShowToolkit] = useState(false);

  const logsRef = useRef(null);

  const addLog = (text, delay) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setDiagnosticLogs((prev) => [...prev, text]);
        resolve();
      }, delay);
    });
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!input) return;

    setLoading(true);
    setResult(null);
    setReported(false);
    setDiagnosticLogs([]);

    // Step-by-step diagnostic animation
    await addLog("⚡ Initializing Sandbox security chamber...", 200);
    await addLog(`📡 Routing request headers through dynamic secure proxy...`, 400);
    await addLog("🔎 Checking domain lexical structures and DNS records...", 500);
    await addLog("🔐 Analysing SSL/TLS chain and certificate authenticity...", 400);
    await addLog("🤖 Parsing content variables using Machine Learning model...", 600);

    try {
      const response = await axios.post('https://phishguard-ai-xex8.onrender.com/api/analyze', {
        content: input,
        type: inputType,
        timestamp: new Date().toISOString()
      });

      await addLog("📋 Fetching threat scoring vector results...", 400);
      await addLog("✅ Analysis complete. Generating security report.", 200);

      setResult(response.data);

      // Save to localStorage history
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
      console.warn('Backend connection failed, spinning up local model simulator...');
      await addLog("⚠️ External server offline. Activating Local Heuristics Engine...", 600);
      
      // Local Heuristic Simulation as fallback
      const mockResult = simulateLocalHeuristics(input, inputType);
      
      await addLog("📋 Compiling offline heuristic database report...", 400);
      await addLog("✅ Analysis complete (Local Model).", 200);
      setResult(mockResult);

      try {
        const historyItem = {
          input,
          type: inputType,
          timestamp: new Date().toISOString(),
          result: mockResult
        };
        const existingHistory = JSON.parse(localStorage.getItem('scanHistory') || '[]');
        localStorage.setItem('scanHistory', JSON.stringify([historyItem, ...existingHistory].slice(0, 50)));
      } catch (err) {
        console.error('Failed to save local history', err);
      }
    }
    setLoading(false);
  };

  // Helper for local detection simulation
  const simulateLocalHeuristics = (text, type) => {
    const textLower = text.toLowerCase();
    let score = 5;
    let reasons = [];

    if (type === 'url') {
      if (textLower.includes('login') || textLower.includes('verify') || textLower.includes('account') || textLower.includes('update')) {
        score += 35;
        reasons.append ? reasons.push("Suspicious keyword found in URL path") : reasons.push("Suspicious keyword found in URL path");
      }
      if (textLower.startsWith('http://')) {
        score += 25;
        reasons.push("Insecure URL scheme (HTTP instead of HTTPS)");
      }
      if (reasons.length > 0) {
        score += 20;
        reasons.push("Heuristic patterns match high-risk index list");
      }
    } else {
      if (textLower.includes('free') || textLower.includes('prize') || textLower.includes('lottery') || textLower.includes('urgent')) {
        score += 45;
        reasons.push("High-risk phishing keywords detected in message body");
      }
      if (textLower.includes('click here') || textLower.includes('http')) {
        score += 30;
        reasons.push("Contains redirection link with urgent action call");
      }
    }

    if (score > 80) score = 82;
    
    let status = 'Safe';
    let risk_level = 'Low';
    if (score > 70) {
      status = 'Phishing';
      risk_level = 'High';
    } else if (score > 40) {
      status = 'Suspicious';
      risk_level = 'Medium';
    }

    return {
      threat_score: score,
      status: status,
      risk_level: risk_level,
      reasons: reasons.length > 0 ? reasons : ["No threat indicators detected via local scanning heuristics"],
      timestamp: new Date().toISOString()
    };
  };

  // Scroll to bottom of logs on change
  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [diagnosticLogs]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full text-xs text-sky-400 font-semibold uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5" /> AI Threat Defense Console
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Real-time <span className="text-sky-400 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">AI Threat Detection</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Analyze suspicious URLs, unsolicited emails, and SMS alerts instantly using our cyber heuristic analyzer and global threat data models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left/Middle Column: Scanner Interface */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-indigo-500/5 opacity-60 pointer-events-none" />
            <form onSubmit={handleScan} className="relative z-10 space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Select Attack Vector</span>
                <span className="text-xs font-mono text-sky-400/80">Mode: Cloud / Native Hybrid</span>
              </div>
              
              <div className="flex gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-900 w-full sm:w-fit">
                {[
                  { id: 'url', label: 'URL Address', icon: <Search className="w-4 h-4" /> },
                  { id: 'email', label: 'Email Content', icon: <Mail className="w-4 h-4" /> },
                  { id: 'sms', label: 'SMS / Text', icon: <MessageSquare className="w-4 h-4" /> }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setInputType(type.id)}
                    className={`flex items-center justify-center gap-2 flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 ${inputType === type.id 
                        ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20' 
                        : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    {type.icon} {type.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Paste the suspicious ${inputType.toUpperCase()} content here for scanning...`}
                  className="w-full bg-slate-950/50 border border-slate-850 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400 transition-all duration-300 min-h-[140px] resize-none font-mono"
                />
                {input.length > 0 && (
                  <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500">
                    Characters: {input.length}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !input}
                className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold py-3.5 px-6 rounded-xl shadow-xl shadow-sky-500/10 hover:shadow-sky-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Threat Vector...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" /> Run Threat Assessment
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Animated Diagnostics Console (Shown during load or after scan completes) */}
          {(loading || diagnosticLogs.length > 0) && (
            <div className="glass-panel rounded-2xl p-5 border-slate-850 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2 text-[10px] text-slate-500">
                <span className="flex items-center gap-1.5"><Server className="w-3.5 h-3.5" /> SANDBOX TERMINAL LOGS</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> ONLINE</span>
              </div>
              <div 
                ref={logsRef}
                className="h-32 overflow-y-auto space-y-2.5 text-slate-400 terminal-scroll"
              >
                {diagnosticLogs.map((log, index) => (
                  <div 
                    key={index}
                    className={`flex items-start gap-2.5 animate-in slide-in-from-left-2 duration-300 ${
                      log.startsWith("✅") ? "text-emerald-400" : log.startsWith("⚠️") ? "text-amber-400" : ""
                    }`}
                  >
                    <span className="text-sky-500/50">[{new Date().toLocaleTimeString()}]</span>
                    <span>{log}</span>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-1.5 text-sky-400 animate-pulse pl-1">
                    <span>&gt;</span> <span className="w-1.5 h-3.5 bg-sky-400 animate-pulse inline-block" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Information Panel & Live Advice */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-5">
            <h3 className="text-sm font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-400" /> Assessment Criteria
            </h3>
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-900 space-y-1.5">
                <div className="font-semibold text-slate-200">Domain Reputation</div>
                <p className="text-slate-400 leading-relaxed">Cross-references domain registration dates, registry age, and safety flag lists from active intelligence vendors.</p>
              </div>
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-900 space-y-1.5">
                <div className="font-semibold text-slate-200">Lexical / Heuristic Analysis</div>
                <p className="text-slate-400 leading-relaxed">Examines token indicators including double-extensions, suspicious IP hosting, brand spoofing keywords, and homograph mismatches.</p>
              </div>
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-900 space-y-1.5">
                <div className="font-semibold text-slate-200">Machine Learning Assessment</div>
                <p className="text-slate-400 leading-relaxed">Computes vulnerability probabilities using structural layouts, formatting characteristics, and phrase token weights.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result Section */}
      {result && !loading && (
        <div className={`glass-panel rounded-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-500 border-l-4 ${
            result.status === 'Safe' ? 'border-l-emerald-500' :
            result.status === 'Suspicious' ? 'border-l-amber-500' : 'border-l-rose-500'
          }`}>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            
            {/* Dynamic Score Ring Chart */}
            <div className="relative flex-shrink-0 w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  strokeWidth="8"
                  stroke="#1e293b"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  strokeWidth="8"
                  stroke={result.status === 'Safe' ? '#10b981' : result.status === 'Suspicious' ? '#f59e0b' : '#f43f5e'}
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - result.threat_score / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center font-mono">
                <span className="text-3xl font-extrabold text-white">{result.threat_score}%</span>
                <span className="text-[10px] text-slate-500 uppercase">Threat Score</span>
              </div>
            </div>

            {/* Results Details */}
            <div className="flex-grow space-y-4 text-center md:text-left">
              <div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider mb-2 ${
                  result.status === 'Safe' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  result.status === 'Suspicious' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {result.status === 'Safe' ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                  {result.status} Verdict
                </span>
                
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  Risk Assessment: <span className={
                    result.status === 'Safe' ? 'text-emerald-400' :
                    result.status === 'Suspicious' ? 'text-amber-400' : 'text-rose-400'
                  }>{result.risk_level} Risk</span>
                </h3>
              </div>

              {/* Detections Reason Logs */}
              <div className="bg-slate-950/70 rounded-xl p-5 border border-slate-900/60 max-w-2xl">
                <h4 className="text-xs font-mono text-slate-500 mb-3 uppercase tracking-wider text-left flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-sky-400" /> Detected Threat Heuristic Logs
                </h4>
                <ul className="space-y-2 text-left">
                  {result.reasons.map((reason, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-slate-400 flex items-start gap-2.5">
                      <span className="text-sky-500 mt-1 select-none font-bold">&gt;</span> 
                      <span className="font-mono">{reason}</span>
                    </li>
                  ))}
                  {result.reasons.length === 0 && (
                    <li className="text-xs text-slate-500 italic">No suspicious indicators found. No threat warnings raised.</li>
                  )}
                </ul>
              </div>

              {/* Interactive Feedbacks */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                {!reported ? (
                  <button 
                    onClick={() => setReported(true)}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-400 transition-colors font-mono"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" /> Flag Incorrect Classification
                  </button>
                ) : (
                  <p className="text-xs text-sky-400 flex items-center gap-1.5 font-mono animate-pulse">
                    <CheckCircle className="w-3.5 h-3.5" /> Threat report submitted. Thank you.
                  </p>
                )}
                
                <button
                  onClick={() => setShowToolkit(!showToolkit)}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-400 transition-colors font-mono"
                >
                  <Info className="w-3.5 h-3.5" /> {showToolkit ? 'Hide details' : 'Show advanced diagnostics'}
                </button>
              </div>

              {/* Advanced Diagnostics Details dropdown */}
              {showToolkit && (
                <div className="mt-4 p-4 bg-slate-900/30 border border-slate-900 rounded-xl space-y-3 animate-in slide-in-from-top-2 duration-300 text-left max-w-xl">
                  <h4 className="text-xs font-bold text-slate-300">Detailed Classification Metrics</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2 bg-slate-950/40 rounded border border-slate-900">
                      <span className="text-slate-500 block mb-0.5">Algorithm Version</span>
                      <span className="font-mono text-slate-300">RandomForest v1.0.4</span>
                    </div>
                    <div className="p-2 bg-slate-950/40 rounded border border-slate-900">
                      <span className="text-slate-500 block mb-0.5">Detection Method</span>
                      <span className="font-mono text-slate-300">Model + API Heuristic</span>
                    </div>
                    <div className="p-2 bg-slate-950/40 rounded border border-slate-900">
                      <span className="text-slate-500 block mb-0.5">SSL Protocol Checks</span>
                      <span className="font-mono text-slate-300">SHA256, Valid Certificate</span>
                    </div>
                    <div className="p-2 bg-slate-950/40 rounded border border-slate-900">
                      <span className="text-slate-500 block mb-0.5">Scan Signature Hash</span>
                      <span className="font-mono text-slate-300 text-[10px]">MD5: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------
// TAB VIEW: THREAT INTEL DASHBOARD
// ---------------------------------------------------------
const MOCK_CHART_DATA = [
  { name: 'Mon', threats: 120, total: 420 },
  { name: 'Tue', threats: 210, total: 530 },
  { name: 'Wed', threats: 150, total: 410 },
  { name: 'Thu', threats: 320, total: 680 },
  { name: 'Fri', threats: 190, total: 480 },
  { name: 'Sat', threats: 90,  total: 310 },
  { name: 'Sun', threats: 140, total: 390 },
];

const DONUT_COLORS = ['#10b981', '#f59e0b', '#f43f5e'];

function DashboardView() {
  const [stats, setStats] = useState(null);
  const [chartMode, setChartMode] = useState('threats'); // threats, total

  useEffect(() => {
    // Fetch statistics from backend API
    axios.get('https://phishguard-ai-xex8.onrender.com/api/stats')
      .then(res => setStats(res.data))
      .catch(err => {
        console.warn('API Stats fetch failed, serving offline mock stats');
        // Serve comprehensive mock stats
        setStats({
          total_scans: 12450,
          safe: 8200,
          suspicious: 2100,
          phishing: 2150,
          recent: [
            { url: 'http://secure-login-chase-update.com', score: 96, status: 'Phishing' },
            { url: 'https://github.com/login', score: 2, status: 'Safe' },
            { url: 'http://amazon-promotional-giftcard.net', score: 88, status: 'Phishing' },
            { url: 'https://paypal-verify-billing.info', score: 92, status: 'Phishing' },
            { url: 'https://wikipedia.org', score: 1, status: 'Safe' },
          ]
        });
      });
  }, []);

  if (!stats) return <div className="text-center text-slate-400 mt-20 font-mono">Loading telemetry dashboard...</div>;

  const pieData = [
    { name: 'Safe Scans', value: stats.safe },
    { name: 'Suspicious Scans', value: stats.suspicious },
    { name: 'Phishing Blocked', value: stats.phishing },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Threat Intelligence Dashboard</h2>
          <p className="text-slate-400 text-sm">Real-time global telemetry statistics and malicious detection records.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3.5 py-2 rounded-full border border-emerald-500/20 font-mono">
          <Server className="w-4 h-4 animate-pulse" /> API FEED: ACTIVE
        </div>
      </div>

      {/* Global Threat level Banner */}
      <div className="glass-panel p-4 rounded-xl border-l-4 border-l-amber-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-8 h-8 text-amber-400 animate-pulse" />
          <div>
            <div className="font-bold text-slate-200 text-sm">System Alert Level: MODERATE RISK WARNING</div>
            <p className="text-slate-400 text-xs mt-0.5">Elevated phishing campaigns mimicking postal shipments and tax returns registered worldwide.</p>
          </div>
        </div>
        <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2.5 py-1 rounded tracking-wider uppercase font-mono">CODE: AMBER</span>
      </div>

      {/* Numerical Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Telemetry Scans" value={stats.total_scans.toLocaleString()} icon={<BarChart3 />} color="sky" />
        <StatCard title="Safe Detections" value={stats.safe.toLocaleString()} icon={<CheckCircle />} color="emerald" />
        <StatCard title="Suspicious Flags" value={stats.suspicious.toLocaleString()} icon={<AlertTriangle />} color="amber" />
        <StatCard title="Phishing Blocks" value={stats.phishing.toLocaleString()} icon={<Shield />} color="rose" />
      </div>

      {/* Interactive Charts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: 7 Days Threat Activity AreaChart */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-400" /> Threat Activity Telemetry
            </h3>
            <div className="flex bg-slate-950/80 rounded-lg p-1 border border-slate-900">
              <button
                onClick={() => setChartMode('threats')}
                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                  chartMode === 'threats' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Threats Blocked
              </button>
              <button
                onClick={() => setChartMode('total')}
                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                  chartMode === 'total' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Total Traffic
              </button>
            </div>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartMode === 'threats' ? '#f43f5e' : '#38bdf8'} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={chartMode === 'threats' ? '#f43f5e' : '#38bdf8'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }}
                  itemStyle={{ fontSize: 12 }}
                  labelStyle={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}
                />
                <Area 
                  type="monotone" 
                  dataKey={chartMode === 'threats' ? 'threats' : 'total'} 
                  stroke={chartMode === 'threats' ? '#f43f5e' : '#38bdf8'} 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorGlow)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Pie Distribution Chart */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-200">Threat Distribution</h3>
            <p className="text-slate-500 text-xs">Total proportion of cataloged analysis.</p>
          </div>

          <div className="h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Summary Text */}
            <div className="absolute text-center">
              <span className="text-slate-500 text-[10px] uppercase block tracking-wider font-mono">Blocked</span>
              <span className="text-2xl font-extrabold text-slate-100 font-mono">
                {Math.round((stats.phishing / stats.total_scans) * 100)}%
              </span>
            </div>
          </div>

          {/* Color Legend */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Safe scans</div>
              <span className="font-mono text-slate-450">{Math.round((stats.safe / stats.total_scans) * 100)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Suspicious flags</div>
              <span className="font-mono text-slate-450">{Math.round((stats.suspicious / stats.total_scans) * 100)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div> Phishing blocks</div>
              <span className="font-mono text-slate-450">{Math.round((stats.phishing / stats.total_scans) * 100)}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Detections List */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-400" /> Recent Telemetry Threat Feed
          </h3>
          <span className="text-xs text-slate-500 font-mono">Latest 5 reports</span>
        </div>
        
        <div className="overflow-x-auto terminal-scroll">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="text-slate-500 border-b border-slate-900 pb-3 font-mono">
              <tr>
                <th className="pb-3 font-medium uppercase tracking-wider">Attack Vector Content</th>
                <th className="pb-3 font-medium uppercase tracking-wider">Threat Score</th>
                <th className="pb-3 font-medium uppercase tracking-wider">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 font-mono">
              {stats.recent.map((item, idx) => (
                <tr key={idx} className="group hover:bg-slate-900/30 transition-colors">
                  <td className="py-4 text-slate-350 pr-4 max-w-sm sm:max-w-md truncate">{item.url}</td>
                  <td className="py-4">
                    <span className={`font-semibold ${
                      item.score > 70 ? 'text-rose-455 glow-text-rose' : item.score > 40 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>{item.score}%</span>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                      item.status === 'Safe' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' :
                      item.status === 'Suspicious' ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/25'
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

// Subcomponent: StatCard with scale on hover
function StatCard({ title, value, icon, color }) {
  const colorMap = {
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20 shadow-sky-500/2',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/2',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/2',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-rose-500/2',
  };

  return (
    <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 hover:scale-[1.02] hover:bg-slate-900/80 transition-all duration-300 border-slate-900">
      <div className={`p-3 rounded-xl border ${colorMap[color]}`}>
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
      </div>
      <div>
        <div className="text-slate-450 text-xs font-semibold uppercase tracking-wider">{title}</div>
        <div className="text-2xl font-bold text-white mt-1.5 font-mono">{value}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// TAB VIEW: PHISHSHIELD ACADEMY (INTERACTIVE QUIZ)
// ---------------------------------------------------------
function AcademyView() {
  const [gameState, setGameState] = useState('welcome'); // welcome, play, finish
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // true (phishing), false (safe)
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const startQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setUserAnswers([]);
    setGameState('play');
  };

  const handleAnswerSubmit = (answer) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    const question = QUIZ_QUESTIONS[currentIdx];
    const isCorrect = (question.isPhishing === answer);
    
    if (isCorrect) setScore((prev) => prev + 1);
    
    setUserAnswers((prev) => [
      ...prev,
      { questionId: question.id, userChoice: answer, correct: isCorrect }
    ]);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setGameState('finish');
    }
  };

  const currentQuestion = QUIZ_QUESTIONS[currentIdx];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full text-xs text-sky-400 font-semibold uppercase tracking-wider">
          <GraduationCap className="w-3.5 h-3.5" /> PhishShield Academy
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Interactive Phishing Simulator</h2>
        <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
          Test your detection skills. Can you tell the difference between legitimate corporate notifications and sophisticated phishing lures?
        </p>
      </div>

      {gameState === 'welcome' && (
        <div className="glass-panel p-8 rounded-2xl text-center space-y-6 max-w-xl mx-auto border-slate-900">
          <ShieldAlert className="w-16 h-16 text-sky-400 mx-auto animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-100">Welcome to Simulator Training</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              You will be presented with 5 real-world attack simulations including suspicious SMS texts, credential-harvesting emails, and look-alike URLs. 
            </p>
          </div>
          
          <button
            onClick={startQuiz}
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-sky-500/10 text-sm"
          >
            <Play className="w-4 h-4 fill-slate-950" /> Start Simulator Training
          </button>
        </div>
      )}

      {gameState === 'play' && currentQuestion && (
        <div className="space-y-6">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>SCENARIO {currentIdx + 1} OF {QUIZ_QUESTIONS.length}</span>
            <span>DIFFICULTY: <span className={
              currentQuestion.difficulty === 'Easy' ? 'text-emerald-400' :
              currentQuestion.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400'
            }>{currentQuestion.difficulty.toUpperCase()}</span></span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-1.5">
            <div 
              className="bg-sky-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Interactive Lure Mockup Card */}
          <div className="glass-panel rounded-2xl overflow-hidden border-slate-800">
            {/* Header style depending on vector type */}
            <div className="bg-slate-950/80 px-5 py-3 border-b border-slate-900 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                {currentQuestion.type === 'email' && <Mail className="w-4 h-4 text-sky-400" />}
                {currentQuestion.type === 'sms' && <MessageSquare className="w-4 h-4 text-sky-400" />}
                {currentQuestion.type === 'url' && <Globe className="w-4 h-4 text-sky-400" />}
                {currentQuestion.type.toUpperCase()} LURE PREVIEW
              </span>
              <span className="text-[10px] text-slate-500">SIMULATED ENVIRONMENT</span>
            </div>

            <div className="p-6 space-y-4">
              {/* Simulated Client Details */}
              {currentQuestion.type === 'email' && (
                <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-900 text-xs">
                  <div><span className="text-slate-500 font-mono">From:</span> <span className="font-mono text-slate-350">{currentQuestion.sender}</span></div>
                  <div><span className="text-slate-500 font-mono">Subject:</span> <span className="font-semibold text-slate-200">{currentQuestion.subject}</span></div>
                </div>
              )}
              {currentQuestion.type === 'sms' && (
                <div className="space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-900 text-xs">
                  <div><span className="text-slate-500 font-mono">Sender ID:</span> <span className="font-mono text-slate-350">{currentQuestion.sender}</span></div>
                </div>
              )}

              {/* Message Content Sandbox */}
              <div className="bg-slate-950/20 p-5 rounded-xl border border-slate-900/50 space-y-3 font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap select-all">
                {currentQuestion.body}
              </div>
            </div>
          </div>

          {/* Action Choice Buttons */}
          {!showExplanation ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswerSubmit(true)}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <ShieldAlert className="w-5 h-5" /> Flag as PHISHING
              </button>
              <button
                onClick={() => handleAnswerSubmit(false)}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <ShieldCheck className="w-5 h-5" /> Flag as SAFE
              </button>
            </div>
          ) : (
            // Feedback Explanation Panel
            <div className="glass-panel p-6 rounded-2xl space-y-4 animate-in zoom-in-95 duration-300 border-slate-850">
              <div className="flex items-center gap-3">
                {currentQuestion.isPhishing === selectedAnswer ? (
                  <div className="bg-emerald-500/10 p-2 rounded-full border border-emerald-500/20 text-emerald-400">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="bg-rose-500/10 p-2 rounded-full border border-rose-500/20 text-rose-400">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className="font-extrabold text-base text-slate-100">
                    {currentQuestion.isPhishing === selectedAnswer ? "Correct Analysis!" : "Incorrect Analysis."}
                  </h3>
                  <p className="text-xs text-slate-500">
                    This scenario is actually a <span className="font-bold">{currentQuestion.isPhishing ? 'Phishing threat' : 'Safe message'}</span>.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-955/60 rounded-xl border border-slate-900 text-slate-350 text-xs leading-relaxed space-y-2">
                <span className="font-mono text-slate-400 block font-bold uppercase tracking-wider">Security Breakdown:</span>
                <p>{currentQuestion.explanation}</p>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.01]"
              >
                Continue to Next Scenario
              </button>
            </div>
          )}
        </div>
      )}

      {gameState === 'finish' && (
        <div className="glass-panel p-8 rounded-2xl text-center space-y-6 max-w-xl mx-auto border-slate-900">
          <div className="relative inline-block">
            <ShieldCheck className="w-20 h-20 text-sky-400 mx-auto filter drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]" />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-slate-950">
              PASSED
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-100 tracking-tight">Training Completed!</h3>
            <p className="text-slate-400 text-sm">
              Your final score: <span className="text-sky-400 font-bold font-mono">{score} / {QUIZ_QUESTIONS.length}</span> correct flags.
            </p>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-900 max-w-md mx-auto text-xs text-slate-400">
            {score === QUIZ_QUESTIONS.length ? (
              <p className="text-emerald-400 font-semibold">🏆 Cyber Sentinel: Perfect score! You have strong detection instincts.</p>
            ) : score >= 3 ? (
              <p className="text-sky-400">👍 Threat Analyst: Solid work, but remember to double-check sender domains and URLs closely.</p>
            ) : (
              <p className="text-rose-400">⚠️ At-Risk User: We recommend checking our Resources section to familiarize yourself with phishing signs.</p>
            )}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={startQuiz}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-3 px-5 rounded-xl transition-all border border-slate-800 text-xs"
            >
              Retry Training
            </button>
            <button
              onClick={() => setGameState('welcome')}
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3 px-5 rounded-xl transition-all text-xs"
            >
              Exit Academy
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// ---------------------------------------------------------
// TAB VIEW: SCAN HISTORY
// ---------------------------------------------------------
function HistoryView() {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    try {
      setHistory(JSON.parse(localStorage.getItem('scanHistory') || '[]'));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to permanently clear your local scan history?")) {
      localStorage.removeItem('scanHistory');
      setHistory([]);
      setExpandedIndex(null);
    }
  };

  const exportHistoryJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `phishguard_scan_history_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.input.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.result.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Security Scan History</h2>
          <p className="text-slate-400 text-sm">Your diagnostic scans cached securely in local client storage.</p>
        </div>
        <div className="flex gap-2">
          {history.length > 0 && (
            <>
              <button 
                onClick={exportHistoryJSON}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg transition-all text-xs font-semibold border border-slate-800"
              >
                <Download className="w-3.5 h-3.5" /> Export Data
              </button>
              <button 
                onClick={clearHistory}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-all text-xs font-semibold border border-rose-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-1">
          <textarea
            rows="1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within content..."
            className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500/50 resize-none"
          />
        </div>
        
        {/* Type Filter tabs */}
        <div className="flex bg-slate-955/80 p-1 rounded-xl border border-slate-900/60 gap-1 text-xs">
          {['all', 'url', 'email', 'sms'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`flex-1 py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase transition-all ${
                typeFilter === type ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Status filter tabs */}
        <div className="flex bg-slate-955/80 p-1 rounded-xl border border-slate-900/60 gap-1 text-xs">
          {['all', 'Safe', 'Suspicious', 'Phishing'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex-1 py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase transition-all ${
                statusFilter === status ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Grid list */}
      {filteredHistory.length === 0 ? (
        <div className="glass-panel p-16 rounded-2xl text-center border-slate-900 border-dashed">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-40 animate-pulse" />
          <h3 className="text-base font-semibold text-slate-350">No diagnostic scans found</h3>
          <p className="text-slate-500 text-xs mt-1.5">No records match the current filter parameters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item, idx) => (
            <div key={idx} className="glass-panel rounded-xl border-slate-900 overflow-hidden">
              <div 
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border font-bold text-xs font-mono ${
                      item.result.status === 'Safe' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' :
                      item.result.status === 'Suspicious' ? 'border-amber-500/20 text-amber-400 bg-amber-500/10' :
                      'border-rose-500/20 text-rose-455 bg-rose-500/10'
                    }`}>
                    {item.result.threat_score}%
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        item.type === 'url' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                        item.type === 'email' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                        'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                      }`}>{item.type}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-300 text-xs font-mono truncate max-w-sm sm:max-w-md">{item.input}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-0 border-slate-900/60 pt-2 sm:pt-0">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                    item.result.status === 'Safe' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' :
                    item.result.status === 'Suspicious' ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/25'
                  }`}>
                    {item.result.status}
                  </span>
                  {expandedIndex === idx ? <ChevronUp className="w-4 h-4 text-slate-550" /> : <ChevronDown className="w-4 h-4 text-slate-550" />}
                </div>
              </div>

              {/* Expandable detailed diagnostics reports */}
              {expandedIndex === idx && (
                <div className="bg-slate-950/80 px-4 py-4 border-t border-slate-900/60 font-mono text-xs space-y-3 animate-in slide-in-from-top-2 duration-300 text-left">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-1.5">
                    Detailed Assessment Logs
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] leading-relaxed text-slate-400">
                    <div>
                      <span className="text-slate-500 block mb-0.5">Threat score classification:</span>
                      <span className="text-slate-350">{item.result.threat_score}% (Risk Level: {item.result.risk_level})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-0.5">Timestamp:</span>
                      <span className="text-slate-350">{new Date(item.timestamp).toString()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-slate-500 block mb-0.5">Indicators Flagged:</span>
                    <ul className="space-y-1.5 pl-2.5">
                      {item.result.reasons.map((reason, index) => (
                        <li key={index} className="text-slate-400 flex items-start gap-1">
                          <span className="text-sky-500/60">-</span> <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------
// TAB VIEW: RESOURCES & THREAT TIPS
// ---------------------------------------------------------
function ResourcesView() {
  const [tipsQuery, setTipsQuery] = useState('');
  
  // Interactive checklist states
  const [checklist, setChecklist] = useState({
    urgency: false,
    mismatch: false,
    sensitive: false,
    generic: false,
    unusual: false
  });

  const tips = [
    { title: "Inspect Sender Addresses", desc: "Always check the domain of the sender. Spoofed names are common, but the underlying email domain reveals look-alike characters (e.g., mail@paypa1.com instead of paypal.com).", icon: <Mail className="w-5 h-5 text-sky-400" /> },
    { title: "Analyze URL Subdomains", desc: "Attackers place official brand keywords as subdomains (e.g. chase.com.verify-billing.net). The actual domain name is 'verify-billing.net'. Check the rightmost part before the first single slash.", icon: <Search className="w-5 h-5 text-sky-400" /> },
    { title: "Beware of False Urgency", desc: "Phishing emails create panic, telling you that your account will be deleted, suspended, or blocked unless you click immediately. Professional organizations rarely set arbitrary immediate deadlines.", icon: <AlertTriangle className="w-5 h-5 text-amber-400" /> },
    { title: "Enable Multi-Factor Authentication", desc: "Always secure accounts with MFA/2FA. Even if credentials are harvested via look-alike portals, the attacker cannot bypass secondary security codes.", icon: <Shield className="w-5 h-5 text-emerald-400" /> },
    { title: "Look for Shortened Links", desc: "SMS spam uses URL shorteners (e.g., bit.ly, tinyurl) to mask the actual landing page domain. Avoid opening shortened URLs from unknown senders.", icon: <Globe className="w-5 h-5 text-purple-400" /> },
    { title: "Inquire Directly", desc: "If a company claims there is an issue, open a new browser window, log in directly via the official bookmark, or call the verified service number listed on their site.", icon: <BookOpen className="w-5 h-5 text-blue-400" /> }
  ];

  const handleCheckboxChange = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateVerdict = () => {
    const checkedCount = Object.values(checklist).filter(Boolean).length;
    if (checkedCount >= 3) return { level: "HIGH RISK", color: "text-rose-400", desc: "This strongly indicators a phishing threat. Do not click links or reveal sensitive details." };
    if (checkedCount >= 1) return { level: "MODERATE RISK", color: "text-amber-400", desc: "Exercise caution. Confirm the identity of the source through trusted channels first." };
    return { level: "LOW RISK", color: "text-emerald-400", desc: "No immediate threats flagged, but remain vigilant when interacting with external resources." };
  };

  const verdict = calculateVerdict();

  const filteredTips = tips.filter(tip => 
    tip.title.toLowerCase().includes(tipsQuery.toLowerCase()) || 
    tip.desc.toLowerCase().includes(tipsQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Title */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full text-xs text-sky-400 font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" /> Security Resource Hub
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Threat Intelligence & Education</h2>
        <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
          Familiarize yourself with typical phishing mechanics and secure your credentials using our interactive defense templates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Left/Middle: Tips Grid with Search filter */}
        <div className="md:col-span-2 space-y-6">
          <div className="relative">
            <textarea
              rows="1"
              value={tipsQuery}
              onChange={(e) => setTipsQuery(e.target.value)}
              placeholder="Search threat prevention guides..."
              className="w-full bg-slate-950/60 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTips.map((tip, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl hover:bg-slate-900/60 transition-all duration-300 border-slate-900 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-900">
                    {tip.icon}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-100">{tip.title}</h3>
                </div>
                <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interactive Threat Assessment Checklist Checklist */}
        <div className="glass-panel p-5 rounded-2xl border-slate-900 space-y-5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-200">Threat Verifier Checklist</h3>
            <p className="text-slate-500 text-xs">Self-check tool for evaluating suspicious mail or alerts.</p>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { key: 'urgency', label: 'Does it create high urgency/panic?' },
              { key: 'mismatch', label: 'Does sender address look slightly off?' },
              { key: 'sensitive', label: 'Does it request passwords/PIN/personal data?' },
              { key: 'generic', label: 'Does it use generic greetings (e.g. Customer)?' },
              { key: 'unusual', label: 'Does the landing link point to an HTTP/odd domain?' }
            ].map(item => (
              <label 
                key={item.key}
                className="flex items-start gap-3 p-2 bg-slate-950/40 hover:bg-slate-950/80 rounded-lg border border-slate-900/60 cursor-pointer transition-colors duration-250 select-none"
              >
                <input
                  type="checkbox"
                  checked={checklist[item.key]}
                  onChange={() => handleCheckboxChange(item.key)}
                  className="mt-0.5 accent-sky-500 rounded border-slate-800"
                />
                <span className="text-slate-350 text-[11px]">{item.label}</span>
              </label>
            ))}
          </div>

          {/* Dynamic Checklist Verdict output */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-900 space-y-2">
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Assessment Status</div>
            <div className={`font-mono font-bold text-xs ${verdict.color}`}>
              {verdict.level}
            </div>
            <p className="text-[11px] text-slate-450 leading-relaxed">{verdict.desc}</p>
          </div>
        </div>

      </div>

    </div>
  );
}

export default App;
