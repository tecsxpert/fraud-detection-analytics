import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown,
  ExternalLink,
  Edit,
  Calendar,
  Layers
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { AppRecord, PageResponse } from '../types/api.types';
import { cn } from '../lib/utils';
import { useDebounce } from '../hooks/useDebounce';

export default function RecordsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<PageResponse<AppRecord> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const searchTerm = searchParams.get('q') || '';
  const statusFilter = searchParams.get('status') || 'All';
  const currentPage = parseInt(searchParams.get('page') || '0');
  const sortField = searchParams.get('sort') || 'id';
  const sortDir = searchParams.get('dir') || 'asc';
  
  const debouncedSearch = useDebounce(searchTerm, 300);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getRecords(
          currentPage, 
          10, 
          debouncedSearch, 
          statusFilter, 
          `${sortField},${sortDir}`
        );
        setData(response);
      } catch (error) {
        console.error('Failed to fetch records', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, debouncedSearch, statusFilter, sortField, sortDir]);

  const updateParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    setSearchParams(newParams);
  };

  const handleSort = (field: string) => {
    updateParams({
      sort: field,
      dir: sortField === field && sortDir === 'asc' ? 'desc' : 'asc'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-50 text-green-700 border-green-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const exportToCSV = () => {
    if (!data) return;
    const headers = ['ID', 'Name', 'Category', 'Status', 'Score', 'Value', 'Date'];
    const rows = data.content.map(r => [r.id, r.name, r.category, r.status, r.score, r.value, r.date]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "records_export.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Management</h1>
          <p className="text-slate-500">Manage, monitor and update your enterprise projects.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button 
            onClick={() => navigate('/records/new')}
            className="flex items-center gap-2 px-4 py-2 text-white bg-[#1B4F8A] rounded-lg hover:bg-[#164070] transition-colors min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>New Record</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => updateParams({ q: e.target.value, page: '0' })}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4F8A]/20 min-h-[44px]"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              value={statusFilter}
              onChange={(e) => updateParams({ status: e.target.value, page: '0' })}
              className="grow bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4F8A]/20 min-h-[44px]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto border-l border-slate-100 pl-4">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div className="flex items-center gap-1">
              <input 
                type="date"
                value={searchParams.get('start') || ''}
                onChange={(e) => updateParams({ start: e.target.value, page: '0' })}
                className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2 py-2 focus:ring-2 focus:ring-[#1B4F8A]/20 min-h-[44px]"
              />
              <span className="text-slate-400">-</span>
              <input 
                type="date"
                value={searchParams.get('end') || ''}
                onChange={(e) => updateParams({ end: e.target.value, page: '0' })}
                className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2 py-2 focus:ring-2 focus:ring-[#1B4F8A]/20 min-h-[44px]"
              />
            </div>
          </div>
        </div>
        <button 
          onClick={() => {
            const csv = data?.content.map(r => `${r.id},${r.name},${r.status},${r.score},${r.value},${r.date}`).join('\n');
            const blob = new Blob([`ID,Name,Status,Score,Value,Date\n${csv}`], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', 'projects_export.csv');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
          className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all min-h-[44px]"
        >
          <Download className="w-4 h-4" />
          EXPORT CSV
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {[
                  { key: 'name', label: 'Project Name' },
                  { key: 'category', label: 'Category' },
                  { key: 'status', label: 'Status' },
                  { key: 'score', label: 'Score' },
                  { key: 'value', label: 'Value' },
                  { key: 'date', label: 'Launch Date' }
                ].map(col => (
                  <th 
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-8">
                      <div className="h-4 bg-slate-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : data?.content.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center relative">
                        <Layers className="w-10 h-10 text-slate-200" />
                        <Search className="w-6 h-6 text-slate-300 absolute -right-2 -bottom-2" />
                      </div>
                      <div>
                        <p className="text-slate-800 font-bold text-lg">No projects detected</p>
                        <p className="text-slate-500 text-sm mt-1">We couldn't find any records matching your current filter set. Try adjusting your search or category.</p>
                      </div>
                      <button 
                         onClick={() => updateParams({ q: '', status: 'All', page: '0' })}
                         className="px-4 py-2 text-[#1B4F8A] font-bold text-sm bg-[#1B4F8A]/5 hover:bg-[#1B4F8A]/10 rounded-lg transition-all"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                data?.content.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{record.name}</span>
                        <span className="text-xs text-slate-500">{record.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{record.category}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border",
                        getStatusColor(record.status)
                      )}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full w-16 overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              record.score > 80 ? "bg-green-500" : record.score > 60 ? "bg-blue-500" : "bg-amber-500"
                            )} 
                            style={{ width: `${record.score}%` }} 
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{record.score}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      ${record.value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{record.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/records/${record.id}`)}
                          className="p-2 text-slate-400 hover:text-[#1B4F8A] hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/records/${record.id}/edit`)}
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs font-medium text-slate-500">
            Showing <span className="text-slate-900">{currentPage * 10 + 1}</span> to <span className="text-slate-900">{Math.min((currentPage + 1) * 10, data?.totalElements || 0)}</span> of <span className="text-slate-900">{data?.totalElements || 0}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 0}
              onClick={() => updateParams({ page: (currentPage - 1).toString() })}
              className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, data?.totalPages || 0) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateParams({ page: i.toString() })}
                  className={cn(
                    "w-9 h-9 rounded-lg text-sm font-bold transition-all min-h-[44px] min-w-[44px]",
                    currentPage === i ? "bg-[#1B4F8A] text-white" : "hover:bg-slate-100 text-slate-600"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={data ? currentPage >= data.totalPages - 1 : true}
              onClick={() => updateParams({ page: (currentPage + 1).toString() })}
              className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
