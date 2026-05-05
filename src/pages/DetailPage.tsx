import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  Tag, 
  BarChart, 
  CheckCircle,
  MessageSquare,
  Sparkles,
  RefreshCcw,
  Loader2,
  Activity
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { aiService } from '../services/aiService';
import { AppRecord } from '../types/api.types';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<AppRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchRecord(id);
    }
  }, [id]);

  const fetchRecord = async (recordId: string) => {
    try {
      const data = await apiService.getRecordById(recordId);
      setRecord(data);
    } catch (error) {
      console.error('Failed to fetch record', error);
      navigate('/records');
    } finally {
      setIsLoading(false);
    }
  };

  const runAnalysis = async () => {
    if (!record) return;
    setIsAiLoading(true);
    try {
      const result = await aiService.analyzeRecord(record);
      setAiAnalysis(result || '');
    } catch (error) {
      setAiAnalysis('Failed to generate analysis. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!record) return;
    try {
      await apiService.deleteRecord(record.id);
      navigate('/records');
    } catch (error) {
      alert('Failed to delete record');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="w-8 h-8 text-[#1B4F8A] animate-spin" />
        <p className="text-slate-500 font-medium">Loading project details...</p>
      </div>
    );
  }

  if (!record) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 max-w-sm w-full"
            >
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Erase Project?</h2>
              <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                You are about to permanently delete <span className="font-bold text-slate-900 underline underline-offset-4 decoration-red-200">{record.name}</span>. This process cannot be undone.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDelete} 
                  className="w-full py-4 bg-red-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-200 active:scale-[0.98]"
                >
                  Confirm Permanent Delete
                </button>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-4 bg-slate-50 text-slate-400 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-100 transition-all"
                >
                  Discard Action
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/records')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs uppercase tracking-widest">System Overview</span>
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/records/${record.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-xs font-bold shadow-sm min-h-[44px]"
          >
            <Edit className="w-3 h-3" />
            EDIT
          </button>
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-all text-xs font-bold min-h-[44px]"
          >
            <Trash2 className="w-3 h-3" />
            DELETE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border",
                  record.status === 'Active' ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-700 border-slate-200"
                )}>
                  {record.status}
                </span>
                <span className="text-slate-400 text-sm font-medium">#{record.id}</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 mb-6">{record.name}</h1>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-slate-100">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score</p>
                  <p className="text-xl font-bold text-[#1B4F8A]">{record.score}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Value</p>
                  <p className="text-xl font-bold text-slate-900">${record.value.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</p>
                  <p className="text-xl font-bold text-slate-900">{record.category}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Launch Date</p>
                  <p className="text-xl font-bold text-slate-900">{record.date}</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Project Description</h3>
                <p className="text-slate-600 leading-relaxed text-lg italic">
                  "{record.description}"
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {record.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wide">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Background design */}
            <div className="absolute right-0 top-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -z-0"></div>
          </div>

          {/* AI Analysis Section */}
          <div className={cn(
            "bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all",
            isAiLoading && "opacity-70 grayscale"
          )}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1B4F8A]/5 rounded-xl flex items-center justify-center">
                  <Sparkles className={cn("w-5 h-5 text-[#1B4F8A]", isAiLoading && "animate-spin")} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 leading-tight">Project Intelligence</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Audit Complete</p>
                </div>
              </div>
              <button 
                onClick={runAnalysis}
                disabled={isAiLoading}
                className="flex items-center gap-2 px-4 py-2 bg-[#1B4F8A] text-white rounded-xl hover:bg-[#164070] transition-colors text-xs font-bold shadow-md min-h-[44px]"
              >
                {aiAnalysis ? <RefreshCcw className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                {aiAnalysis ? 'Regenerate' : 'Analyze Now'}
              </button>
            </div>
            <div className="p-8">
              {isAiLoading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse"></div>
                </div>
              ) : aiAnalysis ? (
                <div className="markdown-body prose prose-slate max-w-none">
                  <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Click "Analyze Now" to get AI-powered insights for this project.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1B4F8A]" />
              Project Health
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Quality Score</span>
                  <span className="font-bold text-slate-900">{record.score}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${record.score}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Time to Launch</span>
                  <span className="font-bold text-slate-900">45%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '45%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
             <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-bold">Verification</h3>
             </div>
             <p className="text-slate-400 text-sm leading-relaxed mb-6">
               This project has been verified against historical data points and industry standards for {record.category}.
             </p>
             <div className="space-y-3">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                 <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[8px]">1</div>
                 MARKET VALIDATED
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                 <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[8px]">2</div>
                 COMPLIANCE CHECKED
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
