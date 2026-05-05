import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  X,
  AlertCircle,
  Loader2,
  Database
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { AppRecord } from '../types/api.types';
import { cn } from '../lib/utils';

export default function FormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Partial<AppRecord>>({
    name: '',
    category: 'Software',
    status: 'Pending',
    score: 50,
    value: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
    tags: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      const fetchRecord = async () => {
        try {
          const data = await apiService.getRecordById(id);
          setFormData(data);
        } catch (error) {
          navigate('/records');
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecord();
    }
  }, [id, isEdit]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Project name is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if ((formData.score || 0) < 0 || (formData.score || 0) > 100) newErrors.score = 'Score must be between 0 and 100';
    if ((formData.value || 0) < 0) newErrors.value = 'Value cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEdit && id) {
        await apiService.updateRecord(id, formData);
      } else {
        await apiService.createRecord(formData);
      }
      navigate('/records');
    } catch (error) {
      alert('Failed to save record. Please check your data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="w-8 h-8 text-[#1B4F8A] animate-spin" />
        <p className="text-slate-500 font-medium">Preparing editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-semibold">Cancel and Return</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 bg-[#1B4F8A] text-white flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{isEdit ? 'Edit Enterprise Project' : 'Create New Project Entry'}</h1>
            <p className="text-blue-100 opacity-80 text-sm mt-1">
              {isEdit ? `Modifying Project ${id}` : 'Fill in the system details below'}
            </p>
          </div>
          <Database className="w-10 h-10 opacity-20" />
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Name */}
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700">Project Name *</label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all min-h-[44px]",
                  errors.name ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:ring-[#1B4F8A]/20 focus:border-[#1B4F8A]"
                )}
                placeholder="Secure Gateway Implementation"
              />
              {errors.name && <p className="text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4F8A]/20 focus:border-[#1B4F8A] transition-all min-h-[44px]"
              >
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
                <option value="Services">Services</option>
                <option value="Consulting">Consulting</option>
              </select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Current Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4F8A]/20 focus:border-[#1B4F8A] transition-all min-h-[44px]"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Score */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Reliability Score (0-100)</label>
              <input 
                type="number"
                value={formData.score}
                onChange={(e) => setFormData(prev => ({ ...prev, score: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4F8A]/20 focus:border-[#1B4F8A] transition-all min-h-[44px]"
              />
              {errors.score && <p className="text-xs font-bold text-red-500">{errors.score}</p>}
            </div>

            {/* Value */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Estimated Project Value ($)</label>
              <input 
                type="number"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4F8A]/20 focus:border-[#1B4F8A] transition-all min-h-[44px]"
              />
              {errors.value && <p className="text-xs font-bold text-red-500">{errors.value}</p>}
            </div>

            {/* Date */}
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700">Launch Date</label>
              <input 
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4F8A]/20 focus:border-[#1B4F8A] transition-all min-h-[44px]"
              />
            </div>

            {/* Description */}
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700">Project Description *</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                  errors.description ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:ring-[#1B4F8A]/20 focus:border-[#1B4F8A]"
                )}
                placeholder="High-level project goals and technical overview..."
              ></textarea>
              {errors.description && <p className="text-xs font-bold text-red-500">{errors.description}</p>}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex items-center justify-end gap-4">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-all min-h-[44px]"
            >
              Discard Changes
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-[#1B4F8A] text-white font-bold rounded-xl hover:bg-[#164070] shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-70 min-h-[44px]"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isEdit ? 'Update Project' : 'Deploy Records'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
