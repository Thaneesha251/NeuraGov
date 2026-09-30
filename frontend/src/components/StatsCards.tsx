import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { StatsData } from '../types/report';

interface StatsCardsProps {
  stats: StatsData | null;
  loading?: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
  const cards = [
    {
      title: 'Total Reports',
      value: stats?.total_reports ?? 0,
      subtitle: 'All citizen complaints registered',
      icon: <AssignmentIcon sx={{ color: '#38BDF8', fontSize: 28 }} />,
      bgColor: 'rgba(56, 189, 248, 0.1)',
      borderColor: 'rgba(56, 189, 248, 0.3)',
      accentColor: '#38BDF8'
    },
    {
      title: 'Pending Action',
      value: stats?.pending_reports ?? 0,
      subtitle: 'Awaiting triage & field assignment',
      icon: <PendingActionsIcon sx={{ color: '#F59E0B', fontSize: 28 }} />,
      bgColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      accentColor: '#F59E0B'
    },
    {
      title: 'High / Critical Priority',
      value: stats?.high_critical_reports ?? 0,
      subtitle: 'Urgent issues needing immediate care',
      icon: <WarningAmberIcon sx={{ color: '#EF4444', fontSize: 28 }} />,
      bgColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      accentColor: '#EF4444'
    },
    {
      title: 'Resolved Issues',
      value: stats?.resolved_reports ?? 0,
      subtitle: 'Successfully closed & verified',
      icon: <CheckCircleOutlineIcon sx={{ color: '#10B981', fontSize: 28 }} />,
      bgColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      accentColor: '#10B981'
    }
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 30px -5px ${card.bgColor}`
              },
              border: `1px solid ${card.borderColor}`
            }}
          >
            {/* Top decorative gradient bar */}
            <Box
              sx={{
                height: 4,
                width: '100%',
                backgroundColor: card.accentColor,
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {card.title}
                </Typography>
                <Avatar
                  sx={{
                    bgcolor: card.bgColor,
                    width: 48,
                    height: 48,
                    borderRadius: 3
                  }}
                >
                  {card.icon}
                </Avatar>
              </Box>

              <Typography variant="h3" sx={{ fontWeight: 800, color: '#F8FAFC', mb: 0.5 }}>
                {loading ? '...' : card.value}
              </Typography>

              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                {card.subtitle}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
