import axios from 'axios';
import { Report, ReportCreateInput, AIAnalysis, StatsData } from '../types/report';

const API_BASE = '/api';

export const apiClient = {
  // Fetch all reports with optional filters
  getReports: async (filters?: { status?: string; category?: string; priority?: string; search?: string }): Promise<Report[]> => {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters?.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters?.priority && filters.priority !== 'All') params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);

    const response = await axios.get<Report[]>(`${API_BASE}/reports?${params.toString()}`);
    return response.data;
  },

  // Get single report detail
  getReportById: async (id: number): Promise<Report> => {
    const response = await axios.get<Report>(`${API_BASE}/reports/${id}`);
    return response.data;
  },

  // Submit a new citizen report
  createReport: async (data: ReportCreateInput): Promise<Report> => {
    const response = await axios.post<Report>(`${API_BASE}/reports`, data);
    return response.data;
  },

  // Preview AI analysis before submitting
  analyzePreview: async (data: ReportCreateInput): Promise<AIAnalysis> => {
    const response = await axios.post<AIAnalysis>(`${API_BASE}/reports/analyze`, data);
    return response.data;
  },

  // Update report status (Pending, In Progress, Resolved)
  updateStatus: async (id: number, status: string): Promise<Report> => {
    const response = await axios.patch<Report>(`${API_BASE}/reports/${id}/status`, { status });
    return response.data;
  },

  // Get aggregated stats for Admin Dashboard
  getStats: async (): Promise<StatsData> => {
    const response = await axios.get<StatsData>(`${API_BASE}/stats`);
    return response.data;
  }
};
