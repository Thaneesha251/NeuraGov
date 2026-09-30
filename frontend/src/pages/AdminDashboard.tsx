import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { StatsCards } from '../components/StatsCards';
import { ChartsSection } from '../components/ChartsSection';
import { ReportTable } from '../components/ReportTable';
import { ReportDetailModal } from '../components/ReportDetailModal';
import { apiClient } from '../api/client';
import { Report, StatsData } from '../types/report';

interface AdminDashboardProps {
  onNavigateToCitizen: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToCitizen }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected report modal state
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reportsData, statsData] = await Promise.all([
        apiClient.getReports({
          status: statusFilter,
          category: categoryFilter,
          priority: priorityFilter,
          search: searchQuery
        }),
        apiClient.getStats()
      ]);
      setReports(reportsData);
      setStats(statsData);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError('Unable to connect to NeuraGov backend server. Please verify backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, categoryFilter, priorityFilter, searchQuery]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const updated = await apiClient.updateStatus(id, newStatus);
      
      // Update local reports list
      setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
      
      // If modal is open for this report, update it
      if (selectedReport && selectedReport.id === id) {
        setSelectedReport(updated);
      }

      // Refresh stats counters
      const newStats = await apiClient.getStats();
      setStats(newStats);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Error updating report status.');
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Bar */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ mb: 4 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
              Governance Command Center
            </Typography>
            <Chip
              icon={<AutoAwesomeIcon sx={{ fontSize: '14px !important', color: '#A855F7 !important' }} />}
              label="Live Monitoring"
              size="small"
              sx={{ bgcolor: 'rgba(168, 85, 247, 0.15)', color: '#C084FC', border: '1px solid rgba(168, 85, 247, 0.3)', fontWeight: 700 }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#94A3B8', mt: 0.5 }}>
            Real-time public service intelligence, automated AI triage, and department routing.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Tooltip title="Refresh Dashboard Data">
            <IconButton
              onClick={fetchData}
              sx={{
                bgcolor: 'rgba(30, 41, 59, 0.6)',
                color: '#38BDF8',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.15)' }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onNavigateToCitizen}
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            New Citizen Report
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 3, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#FCA5A5' }}>
          {error}
        </Alert>
      )}

      {/* Stat Cards Row */}
      <Box sx={{ mb: 4 }}>
        <StatsCards stats={stats} loading={loading} />
      </Box>

      {/* Analytics Charts Section */}
      <Box sx={{ mb: 4 }}>
        <ChartsSection stats={stats} />
      </Box>

      {/* Main Reports Table */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 800 }}>
            Recent Citizen Complaints & Field Triage
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            Showing {reports.length} matching reports
          </Typography>
        </Box>

        <ReportTable
          reports={reports}
          onStatusChange={handleStatusChange}
          onViewReport={handleViewReport}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </Box>

      {/* Report Detail Modal */}
      <ReportDetailModal
        report={selectedReport}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </Container>
  );
};
