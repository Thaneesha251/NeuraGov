export interface AIAnalysis {
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical' | string;
  department: string;
  summary: string;
  recommended_action: string;
  reason: string;
}

export interface Report extends AIAnalysis {
  id: number;
  description: string;
  location: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | string;
  image_url?: string | null;
  reporter_name: string;
  created_at: string;
  updated_at: string;
}

export interface ReportCreateInput {
  description: string;
  location: string;
  category?: string;
  image_data?: string;
  reporter_name?: string;
}

export interface StatsData {
  total_reports: number;
  pending_reports: number;
  in_progress_reports: number;
  high_critical_reports: number;
  resolved_reports: number;
  category_distribution: Record<string, number>;
  priority_distribution: Record<string, number>;
  status_distribution: Record<string, number>;
}
