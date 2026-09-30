import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack, Divider, Button, Grid } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AIAnalysis } from '../types/report';

interface AiAnalysisCardProps {
  analysis: AIAnalysis | null;
  loading?: boolean;
}

export const AiAnalysisCard: React.FC<AiAnalysisCardProps> = ({ analysis, loading }) => {
  if (loading) {
    return (
      <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(30, 41, 59, 0.5)', border: '1px border rgba(168, 85, 247, 0.3)' }}>
        <AutoAwesomeIcon sx={{ fontSize: 40, color: '#A855F7', animation: 'spin 2s infinite linear' }} />
        <Typography variant="h6" sx={{ mt: 2, color: '#F8FAFC', fontWeight: 700 }}>
          NeuraGov AI is analyzing your report...
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          Extracting category, priority, department routing & recommended actions.
        </Typography>
      </Card>
    );
  }

  if (!analysis) return null;

  const getPriorityColor = (prio: string) => {
    switch (prio) {
      case 'Critical': return '#EF4444';
      case 'High': return '#F97316';
      case 'Medium': return '#FBBF24';
      default: return '#10B981';
    }
  };

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.4)',
        boxShadow: '0 0 30px rgba(168, 85, 247, 0.15)',
        borderRadius: 4,
        overflow: 'hidden'
      }}
    >
      {/* Top AI Banner */}
      <Box
        sx={{
          py: 1.5,
          px: 3,
          background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.2) 0%, rgba(14, 165, 233, 0.2) 100%)',
          borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: '#C084FC', fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ color: '#F8FAFC', fontWeight: 800, letterSpacing: '0.02em' }}>
            AI Governance Analysis Engine Result
          </Typography>
        </Box>
        <Chip
          label="Real-time AI Model"
          size="small"
          sx={{ bgcolor: 'rgba(168, 85, 247, 0.3)', color: '#E9D5FF', fontSize: '0.7rem', fontWeight: 700 }}
        />
      </Box>

      <CardContent sx={{ p: 3 }}>
        {/* Issue Summary */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
            Core Issue Summary
          </Typography>
          <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 700, mt: 0.5 }}>
            {analysis.summary}
          </Typography>
        </Box>

        {/* 3 Metric Pills */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Category</Typography>
              <Typography variant="subtitle2" sx={{ color: '#38BDF8', fontWeight: 700, mt: 0.5 }}>
                {analysis.category}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Assigned Dept</Typography>
              <Typography variant="subtitle2" sx={{ color: '#C084FC', fontWeight: 700, mt: 0.5 }}>
                {analysis.department}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Priority Urgency</Typography>
              <Chip
                label={analysis.priority.toUpperCase()}
                size="small"
                sx={{
                  mt: 0.5,
                  bgcolor: `${getPriorityColor(analysis.priority)}20`,
                  color: getPriorityColor(analysis.priority),
                  border: `1px solid ${getPriorityColor(analysis.priority)}`,
                  fontWeight: 800
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 2 }} />

        {/* Recommended Action */}
        <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#34D399', mb: 1 }}>
            <CheckCircleIcon sx={{ fontSize: 18 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>
              Recommended Action Plan
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: '#F8FAFC', fontWeight: 600 }}>
            {analysis.recommended_action}
          </Typography>
        </Box>

        {/* Reason */}
        <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
          <Typography variant="caption" sx={{ color: '#A855F7', fontWeight: 700, textTransform: 'uppercase' }}>
            AI Reasoning & Risk Justification
          </Typography>
          <Typography variant="body2" sx={{ color: '#CBD5E1', mt: 0.5, lineHeight: 1.6 }}>
            {analysis.reason}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
