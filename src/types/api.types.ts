export interface AppRecord {
  id: string;
  name: string;
  category: 'Software' | 'Hardware' | 'Services' | 'Consulting';
  status: 'Active' | 'Pending' | 'Completed' | 'Cancelled';
  score: number;
  value: number;
  date: string;
  description: string;
  tags: string[];
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface StatsResponse {
  totalRevenue: number;
  activeProjects: number;
  averageScore: number;
  growth: number;
  categoryDistribution: { name: string; value: number }[];
  statusDistribution: { name: string; value: number }[];
  monthlyTrend: { month: string; value: number }[];
}
