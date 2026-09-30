import React from 'react';
import { Grid, Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { StatsData } from '../types/report';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';

interface ChartsSectionProps {
  stats: StatsData | null;
}

const PRIORITY_COLORS: Record<string, string> = {
  Low: '#10B981',      // Emerald Green
  Medium: '#FBBF24',   // Amber Yellow
  High: '#F97316',     // Orange
  Critical: '#EF4444'  // Crimson Red
};

const CATEGORY_COLORS = [
  '#38BDF8', '#A855F7', '#34D399', '#F43F5E',
  '#F59E0B', '#6366F1', '#EC4899', '#14B8A6'
];

export const ChartsSection: React.FC<ChartsSectionProps> = ({ stats }) => {
  const theme = useTheme();

  // Prepare Category Bar Data
  const categoryData = stats?.category_distribution
    ? Object.entries(stats.category_distribution).map(([name, value]) => ({
        name: name.replace(' & Electricity', '').replace(' & Potholes', '').replace(' & Drainage', ''),
        full_name: name,
        count: value
      }))
    : [];

  // Prepare Priority Pie Data
  const priorityData = stats?.priority_distribution
    ? Object.entries(stats.priority_distribution).map(([name, value]) => ({
        name,
        value,
        color: PRIORITY_COLORS[name] || '#94A3B8'
      }))
    : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: '#0F172A',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            p: 1.5,
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#F8FAFC', fontWeight: 700 }}>
            {payload[0].payload.full_name || label}
          </Typography>
          <Typography variant="body2" sx={{ color: '#38BDF8', fontWeight: 600 }}>
            Reports: {payload[0].value}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      {/* Category Distribution Bar Chart */}
      <Grid item xs={12} md={7}>
        <Card sx={{ height: '100%', minHeight: 380 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  bgcolor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38BDF8',
                  display: 'flex'
                }}
              >
                <BarChartIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 700 }}>
                  Category Distribution
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Breakdown of complaints across governance categories
                </Typography>
              </Box>
            </Box>

            <Box sx={{ width: '100%', height: 270 }}>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis
                      dataKey="name"
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B' }}>
                  No category data available
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Priority Distribution Pie Chart */}
      <Grid item xs={12} md={5}>
        <Card sx={{ height: '100%', minHeight: 380 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  bgcolor: 'rgba(168, 85, 247, 0.15)',
                  color: '#C084FC',
                  display: 'flex'
                }}
              >
                <PieChartIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 700 }}>
                  Priority Breakdown
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  AI assigned urgency classification
                </Typography>
              </Box>
            </Box>

            <Box sx={{ width: '100%', height: 270, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {priorityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span style={{ color: '#94A3B8', fontWeight: 600, fontSize: '0.85rem' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B' }}>
                  No priority data available
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
