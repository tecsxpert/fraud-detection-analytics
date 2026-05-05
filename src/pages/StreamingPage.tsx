import React, { useState, useEffect, useRef } from 'react';
import { 
  Waves, 
  Play, 
  Square, 
  Terminal, 
  Download,
  AlertCircle,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface StreamLog {
  id: string;
  timestamp: string;
  event: string;
  status: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export default function StreamingPage() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [logs, setLogs] = useState<StreamLog[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: any;
    if (isStreaming) {
      interval = setInterval(() => {
        const newLog: StreamLog = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toLocaleTimeString(),
          event: ['FETCH', 'CALC', 'POST', 'SYNC'][Math.floor(Math.random() * 4)],
          status: ['info', 'success', 'warning'][Math.floor(Math.random() * 3)] as any,
          message: `Processed block ${Math.floor(Math.random() * 9999)} - Integrity check ${Math.random() > 0.9 ? 'FAILED' : 'PASSED'}`
        };
        setLogs(prev => [newLog, ...prev].slice(0, 50));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  const toggleStream = () => {
    if (!isStreaming) {
      setLogs([]);
    }
    setIsStreaming(!isStreaming);
  };

  const exportLogs = () => {
    if (logs.length === 0) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,Event,Status,Message\n"
      + logs.map(e => `${e.timestamp},${e.event},${e.status},"${e.message}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `stream_logs_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Real-Time Data Streaming</h1>
          <p className="text-slate-500">Monitor system events and database synchronization in real-mode.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleStream}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all shadow-md active:scale-[0.98] min-h-[44px]",
              isStreaming 
                ? "bg-red-500 text-white hover:bg-red-600" 
                : "bg-green-600 text-white hover:bg-green-700"
            )}
          >
            {isStreaming ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isStreaming ? 'Stop Stream' : 'Start Feed'}
          </button>
          <button 
            onClick={exportLogs}
            disabled={logs.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-bold min-h-[44px] disabled:opacity-50"
          >
             <Download className="w-4 h-4" />
             Export Logs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
        {/* Control & Details */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-2 mb-4 text-[#1B4F8A]">
                <Waves className={cn("w-5 h-5", isStreaming && "animate-pulse")} />
                <h2 className="font-bold">Connection Status</h2>
             </div>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                   <span className="text-sm font-medium text-slate-500">Endpoint</span>
                   <span className="text-sm font-bold text-slate-900">/api/v1/stream</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                   <span className="text-sm font-medium text-slate-500">Stability</span>
                   <span className="text-sm font-bold text-green-600">99.9% Reliable</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                   <span className="text-sm font-medium text-slate-500">Latency</span>
                   <span className="text-sm font-bold text-slate-900">24ms</span>
                </div>
             </div>
          </div>

          <div className="bg-[#1B4F8A] text-white p-6 rounded-2xl shadow-lg">
             <div className="p-3 bg-white/10 rounded-xl w-fit mb-4">
                <FileText className="w-6 h-6" />
             </div>
             <h3 className="text-lg font-bold mb-2">Streaming Protocol</h3>
             <p className="text-blue-100 text-sm leading-relaxed">
               Events are pushed using Server-Sent Events (SSE). This maintains an open HTTP connection for low-latency updates without the overhead of WebSockets.
             </p>
          </div>
        </div>

        {/* Console Log */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
           <div className="p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2">
                 <Terminal className="w-4 h-4 text-slate-400" />
                 <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Live Monitor Output</span>
              </div>
              {isStreaming && (
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                   <span className="text-[10px] font-bold text-green-500 uppercase">Live Feed</span>
                </div>
              )}
           </div>

           <div 
             ref={scrollRef}
             className="flex-1 overflow-auto p-4 font-mono text-sm space-y-2 scroll-smooth"
           >
              {!isStreaming && logs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                   <AlertCircle className="w-12 h-12 opacity-20" />
                   <p>System idle. Click 'Start Feed' to begin monitoring.</p>
                </div>
              )}
              
              <AnimatePresence initial={false}>
                {logs.map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-4 py-1 border-b border-slate-800/50"
                  >
                    <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>
                    <span className={cn(
                      "font-bold shrink-0 min-w-[60px]",
                      log.status === 'success' ? "text-green-400" : log.status === 'warning' ? "text-amber-400" : "text-blue-400"
                    )}>
                      {log.event}
                    </span>
                    <span className="text-slate-300 italic">{log.message}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
