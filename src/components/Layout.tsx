import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListTodo, 
  BarChart3, 
  LogOut, 
  Menu,
  X,
  User,
  Settings,
  Waves,
  Sparkles,
  Send,
  Loader2,
  RefreshCcw,
  Activity,
  Video,
  Circle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../services/aiService';
import ReactMarkdown from 'react-markdown';
import { useScreenRecorder } from '../hooks/useScreenRecorder';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ListTodo, label: 'Records', path: '/records' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Waves, label: 'Streaming', path: '/streaming' },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const { isRecording, recordingTime, startRecording, stopRecording } = useScreenRecorder();
  const [query, setQuery] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const navigate = useNavigate();

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentQuery = query.trim();
    if (!currentQuery) return;
    
    setLastQuery(currentQuery);
    setQuery('');
    setAiResponse('');
    setIsAiLoading(true);
    try {
      // Gather rich context about the current view and system state
      const context = {
        currentPage: window.location.pathname,
        currentTitle: document.title,
        viewStats: {
          path: window.location.pathname,
          timestamp: new Date().toLocaleTimeString(),
          user: user?.name,
          role: 'System Administrator',
          healthStatus: '94.2% Uptime'
        },
        availableActions: [
          'Generate JSON Reports',
          'Export CSV Streaming Logs',
          'Real-time Data visualization',
          'Session Recording'
        ]
      };
      const response = await aiService.askAI(currentQuery, context);
      setAiResponse(response || '');
    } catch (error) {
      setAiResponse('Sorry, the AI assistant is currently unavailable.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const toggleRecording = async () => {
    try {
      if (isRecording) {
        stopRecording();
      } else {
        await startRecording();
      }
    } catch (err: any) {
      alert(`Recording failed: ${err.message || 'Permission denied'}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] p-4 lg:p-6 gap-6">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border border-slate-200 rounded-2xl shadow-sm transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-0",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1B4F8A] rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-[#1B4F8A]">VitePulse</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-slate-50 rounded-lg">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 min-h-[44px] group",
                  isActive 
                    ? "bg-[#1B4F8A]/5 text-[#1B4F8A] font-bold" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                )}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn("w-5 h-5", isActive ? "text-[#1B4F8A]" : "text-slate-400 group-hover:text-slate-600")} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 mt-auto">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
               <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               </div>
               <div className="space-y-2">
                  <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                     <div className="h-full bg-[#1B4F8A] w-[94%]" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 text-center">94.2% Uptime - Enterprise v4</p>
               </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center w-full gap-3 px-4 py-2.5 text-slate-500 transition-all rounded-xl hover:bg-red-50 hover:text-red-600 min-h-[44px]"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 gap-6">
        <header className="h-16 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-slate-400">
              <span>Enterprise Console</span>
              <span>/</span>
              <span className="text-slate-900 font-bold capitalize">
                {window.location.pathname === '/' ? 'Dashboard' : window.location.pathname.split('/')[1]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleRecording}
              className={cn(
                "hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all min-h-[44px]",
                isRecording 
                  ? "bg-red-50 text-red-600 border border-red-100 shadow-sm" 
                  : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
              )}
            >
              {isRecording ? (
                <>
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                  REC SESSION
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  DEMO RECORD
                </>
              )}
            </button>

            <button 
              onClick={() => setIsAiPanelOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#1B4F8A]/5 border border-[#1B4F8A]/10 text-[#1B4F8A] rounded-xl text-xs font-bold hover:bg-[#1B4F8A]/10 transition-all min-h-[44px]"
            >
              <Sparkles className="w-4 h-4" />
              ASK AI ASSISTANT
            </button>
            
            <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>

            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-black">Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1B4F8A] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0 bg-transparent">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* AI Panel Drawer */}
      <AnimatePresence>
        {isAiPanelOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAiPanelOpen(false)}
              className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-white border-l border-slate-200 shadow-2xl z-[70] flex flex-col"
            >
              <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1B4F8A]/5 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#1B4F8A]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 leading-tight">Insight Engine</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise AI v4.0</p>
                  </div>
                </div>
                <button onClick={() => setIsAiPanelOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-6 space-y-6 bg-slate-50/30">
                {(lastQuery || aiResponse) ? (
                  <div className="space-y-6">
                    {lastQuery && (
                      <div className="flex justify-end">
                        <div className="max-w-[85%] bg-[#1B4F8A] text-white p-4 rounded-2xl rounded-tr-none shadow-sm">
                          <p className="text-sm font-medium">{lastQuery}</p>
                        </div>
                      </div>
                    )}
                    
                    {aiResponse && (
                      <div className="space-y-4">
                        <div className="bg-white p-6 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm relative group overflow-hidden">
                          <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setAiResponse(''); setLastQuery(''); }} className="p-1 hover:bg-slate-100 rounded text-slate-400">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="markdown-body">
                            <ReactMarkdown>{aiResponse}</ReactMarkdown>
                          </div>
                        </div>
                        {aiResponse.includes('unavailable') && (
                          <button 
                            onClick={() => handleAiAsk({ preventDefault: () => {} } as any)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#1B4F8A] text-white rounded-xl font-bold text-xs"
                          >
                            <RefreshCcw className="w-3 h-3" /> Retry Generation
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-center mb-6">
                      <Sparkles className="w-8 h-8 text-[#1B4F8A]" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">How can I help today?</h3>
                    <p className="text-slate-500 max-w-[240px]">Ask me anything about your project data, revenue analysis, or system health.</p>
                  </div>
                )}
                {isAiLoading && (
                  <div className="flex items-center gap-3 text-[#1B4F8A] bg-white p-4 rounded-xl border border-[#1B4F8A]/10 shadow-sm animate-pulse-slow">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-xs font-black uppercase tracking-widest">Synthesizing intelligence...</span>
                  </div>
                ) }
              </div>

              <div className="p-6 bg-white border-t border-slate-100">
                <form onSubmit={handleAiAsk} className="relative">
                  <input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe the analysis you need..."
                    className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1B4F8A]/5 focus:border-[#1B4F8A] focus:bg-white transition-all min-h-[44px] text-sm"
                  />
                  <button 
                    disabled={isAiLoading || !query.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#1B4F8A] text-white rounded-xl hover:bg-[#164070] disabled:opacity-50 transition-all shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
                <div className="mt-5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Prompts</p>
                  <div className="flex flex-wrap gap-2">
                    {['Revenue analysis', 'Project health', 'Market risk'].map(hint => (
                      <button 
                        key={hint}
                        onClick={() => setQuery(hint)}
                        className="text-[10px] font-bold text-slate-500 hover:text-[#1B4F8A] hover:bg-[#1B4F8A]/5 border border-slate-200 px-3 py-1.5 rounded-lg transition-all"
                      >
                        {hint}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Recording Overlay */}
      <AnimatePresence>
        {isRecording && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 right-10 z-[100] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-800"
          >
            <div className="flex items-center gap-1.5">
              <Circle className="w-3 h-3 text-red-500 fill-current animate-pulse" />
              <span className="text-xs font-black tracking-widest uppercase">Recording Demo</span>
            </div>
            <div className="w-px h-4 bg-slate-700" />
            <span className="text-xs font-mono text-slate-400">{recordingTime}</span>
            <button 
              onClick={stopRecording}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-colors"
            >
              STOP & SAVE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
