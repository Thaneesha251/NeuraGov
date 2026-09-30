import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Box,
  Typography,
  Tooltip,
  Stack,
  InputAdornment
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Report } from '../types/report';

interface ReportTableProps {
  reports: Report[];
  onStatusChange: (id: number, newStatus: string) => void;
  onViewReport: (report: Report) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  priorityFilter: string;
  setPriorityFilter: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export const ReportTable: React.FC<ReportTableProps> = ({
  reports,
  onStatusChange,
  onViewReport,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  priorityFilter,
  setPriorityFilter,
  searchQuery,
  setSearchQuery
}) => {
  const getPriorityChip = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return <Chip label="CRITICAL" size="small" sx={{ bgcolor: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', border: '1px solid #EF4444', fontWeight: 800 }} />;
      case 'High':
        return <Chip label="HIGH" size="small" sx={{ bgcolor: 'rgba(249, 115, 22, 0.2)', color: '#F97316', border: '1px solid #F97316', fontWeight: 700 }} />;
      case 'Medium':
        return <Chip label="MEDIUM" size="small" sx={{ bgcolor: 'rgba(251, 191, 36, 0.2)', color: '#FBBF24', border: '1px solid #FBBF24', fontWeight: 700 }} />;
      case 'Low':
      default:
        return <Chip label="LOW" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#10B981', border: '1px solid #10B981', fontWeight: 700 }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return '#10B981';
      case 'In Progress':
        return '#38BDF8';
      case 'Pending':
      default:
        return '#F59E0B';
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', bgcolor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(12px)', borderRadius: 4, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      {/* Header Filters & Controls */}
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <GridFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />
      </Box>

      {/* Reports Table */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="recent reports table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 80 }}>ID</TableCell>
              <TableCell>Issue & Summary</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Assigned Dept</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" sx={{ color: '#94A3B8' }}>
                    No reports found matching current filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow
                  key={report.id}
                  hover
                  sx={{
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.03)' },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell sx={{ fontWeight: 700, color: '#64748B' }}>
                    #{report.id}
                  </TableCell>

                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="subtitle2" sx={{ color: '#F8FAFC', fontWeight: 700, mb: 0.5 }}>
                      {report.summary}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#94A3B8',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {report.description}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={report.category}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(148, 163, 184, 0.1)',
                        color: '#CBD5E1',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ maxWidth: 180 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94A3B8' }}>
                      <LocationOnIcon sx={{ fontSize: 16, color: '#38BDF8' }} />
                      <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#E2E8F0' }} noWrap>
                        {report.location}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>{getPriorityChip(report.priority)}</TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#38BDF8', fontWeight: 600, fontSize: '0.85rem' }}>
                      {report.department}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={report.status}
                        onChange={(e) => onStatusChange(report.id, e.target.value)}
                        sx={{
                          height: 36,
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: getStatusColor(report.status),
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: `${getStatusColor(report.status)}50`
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: getStatusColor(report.status)
                          }
                        }}
                      >
                        <MenuItem value="Pending" sx={{ color: '#F59E0B', fontWeight: 600 }}>
                          🟡 Pending
                        </MenuItem>
                        <MenuItem value="In Progress" sx={{ color: '#38BDF8', fontWeight: 600 }}>
                          🔵 In Progress
                        </MenuItem>
                        <MenuItem value="Resolved" sx={{ color: '#10B981', fontWeight: 600 }}>
                          🟢 Resolved
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="View AI Analysis & Details">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AutoAwesomeIcon sx={{ fontSize: '14px !important' }} />}
                        onClick={() => onViewReport(report)}
                        sx={{
                          borderRadius: 2,
                          borderColor: 'rgba(168, 85, 247, 0.4)',
                          color: '#C084FC',
                          fontSize: '0.75rem',
                          '&:hover': {
                            borderColor: '#A855F7',
                            backgroundColor: 'rgba(168, 85, 247, 0.1)'
                          }
                        }}
                      >
                        Details
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

// Filter Bar Helper Component
const GridFilterBar: React.FC<any> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  priorityFilter,
  setPriorityFilter
}) => {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
      <TextField
        placeholder="Search by keyword, location, reporter or summary..."
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          width: { xs: '100%', sm: 340 },
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            bgcolor: 'rgba(15, 23, 42, 0.6)'
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#64748B' }} />
            </InputAdornment>
          )
        }}
      />

      <Stack direction="row" spacing={1.5} sx={{ width: { xs: '100%', sm: 'auto' }, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            sx={{ borderRadius: 2.5, bgcolor: 'rgba(15, 23, 42, 0.6)', fontSize: '0.85rem' }}
          >
            <MenuItem value="All">All Statuses</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            displayEmpty
            sx={{ borderRadius: 2.5, bgcolor: 'rgba(15, 23, 42, 0.6)', fontSize: '0.85rem' }}
          >
            <MenuItem value="All">All Priorities</MenuItem>
            <MenuItem value="Critical">Critical</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 170 }}>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            displayEmpty
            sx={{ borderRadius: 2.5, bgcolor: 'rgba(15, 23, 42, 0.6)', fontSize: '0.85rem' }}
          >
            <MenuItem value="All">All Categories</MenuItem>
            <MenuItem value="Streetlight & Electricity">Streetlight & Electricity</MenuItem>
            <MenuItem value="Roads & Potholes">Roads & Potholes</MenuItem>
            <MenuItem value="Water & Drainage">Water & Drainage</MenuItem>
            <MenuItem value="Waste & Sanitation">Waste & Sanitation</MenuItem>
            <MenuItem value="Traffic & Signals">Traffic & Signals</MenuItem>
            <MenuItem value="Parks & Environment">Parks & Environment</MenuItem>
            <MenuItem value="Public Infrastructure">Public Infrastructure</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  );
};
