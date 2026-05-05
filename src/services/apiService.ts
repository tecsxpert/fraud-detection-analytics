import { AppRecord, PageResponse, StatsResponse } from '../types/api.types';

// Environment configuration
const API_URL = import.meta.env.VITE_API_URL || 'https://api.analytics-pro.com/v1';

// Mock data generation
const MOCK_DATA: AppRecord[] = Array.from({ length: 50 }, (_, i) => ({
  id: `rec-${i + 1}`,
  name: `Project ${String.fromCharCode(65 + (i % 26))}${i + 1}`,
  category: ['Software', 'Hardware', 'Services', 'Consulting'][i % 4] as any,
  status: ['Active', 'Pending', 'Completed', 'Cancelled'][i % 4] as any,
  score: Math.floor(Math.random() * 40) + 60,
  value: Math.floor(Math.random() * 90000) + 10000,
  date: new Date(2024, 0, 1 + i).toISOString().split('T')[0],
  description: `This is a comprehensive description for Project ${i + 1}. It involves high-level analysis and implementation of vertical-specific solutions.`,
  tags: ['enterprise', 'analytics', 'future-ready'].slice(0, (i % 3) + 1)
}));

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const apiService = {
  getRecords: async (page = 0, size = 10, search = '', status = '', sort = 'id,asc'): Promise<PageResponse<AppRecord>> => {
    await delay(800);
    let filtered = [...MOCK_DATA];

    if (search) {
      filtered = filtered.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()));
    }

    if (status && status !== 'All') {
      filtered = filtered.filter(r => r.status === status);
    }

    const [field, direction] = sort.split(',');
    filtered.sort((a: any, b: any) => {
      if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    const start = page * size;
    const content = filtered.slice(start, start + size);

    return {
      content,
      totalPages: Math.ceil(filtered.length / size),
      totalElements: filtered.length,
      size,
      number: page
    };
  },

  getRecordById: async (id: string): Promise<AppRecord> => {
    await delay(500);
    const record = MOCK_DATA.find(r => r.id === id);
    if (!record) throw new Error('Record not found');
    return record;
  },

  createRecord: async (data: Partial<AppRecord>): Promise<AppRecord> => {
    await delay(1000);
    const newRecord = { ...data, id: `rec-${Date.now()}` } as AppRecord;
    MOCK_DATA.unshift(newRecord);
    return newRecord;
  },

  updateRecord: async (id: string, data: Partial<AppRecord>): Promise<AppRecord> => {
    await delay(1000);
    const index = MOCK_DATA.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Record not found');
    MOCK_DATA[index] = { ...MOCK_DATA[index], ...data };
    return MOCK_DATA[index];
  },

  deleteRecord: async (id: string): Promise<void> => {
    await delay(800);
    const index = MOCK_DATA.findIndex(r => r.id === id);
    if (index !== -1) MOCK_DATA.splice(index, 1);
  },

  getStats: async (): Promise<StatsResponse> => {
    await delay(1200);
    return {
      totalRevenue: MOCK_DATA.reduce((acc, r) => acc + r.value, 0),
      activeProjects: MOCK_DATA.filter(r => r.status === 'Active').length,
      averageScore: Math.round(MOCK_DATA.reduce((acc, r) => acc + r.score, 0) / MOCK_DATA.length),
      growth: 12.5,
      categoryDistribution: [
        { name: 'Software', value: MOCK_DATA.filter(r => r.category === 'Software').length },
        { name: 'Hardware', value: MOCK_DATA.filter(r => r.category === 'Hardware').length },
        { name: 'Services', value: MOCK_DATA.filter(r => r.category === 'Services').length },
        { name: 'Consulting', value: MOCK_DATA.filter(r => r.category === 'Consulting').length },
      ],
      statusDistribution: [
        { name: 'Active', value: MOCK_DATA.filter(r => r.status === 'Active').length },
        { name: 'Pending', value: MOCK_DATA.filter(r => r.status === 'Pending').length },
        { name: 'Completed', value: MOCK_DATA.filter(r => r.status === 'Completed').length },
        { name: 'Cancelled', value: MOCK_DATA.filter(r => r.status === 'Cancelled').length },
      ],
      monthlyTrend: [
        { month: 'Jan', value: 45000 },
        { month: 'Feb', value: 52000 },
        { month: 'Mar', value: 48000 },
        { month: 'Apr', value: 61000 },
        { month: 'May', value: 55000 },
        { month: 'Jun', value: 67000 },
      ]
    };
  }
};
