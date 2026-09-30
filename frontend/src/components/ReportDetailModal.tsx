import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  Stack,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeIcon from '@mui/icons-material/Code';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Report } from '../types/report';

interface ReportDetailModalProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: number, newStatus: string) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  open,
  onClose,
  onStatusChange
}) => {
  if (!report) return null;

  const getPriorityColor = (prio: string) => {
    switch (prio) {
      case 'Critical': return '#EF4444';
      case 'High': return '#F97316';
      case 'Medium': return '#FBBF24';
      default: return '#10B981';
    }
  };

  const formattedJson = JSON.stringify(
    {
      category: report.category,
      priority: report.priority,
      department: report.department,
      summary: report.summary,
      recommended_action: report.recommended_action,
      reason: report.reason
    },
    null,
    2
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#0F172A',
          backgroundImage: 'none',
          borderRadius: 4,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 24px 48px rgba(0,0,0,0.6)'
        }
      }}
    >
      {/* Title Bar */}
      <DialogTitle sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: 'rgba(168, 85, 247, 0.15)',
              color: '#C084FC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AutoAwesomeIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
              Report Intelligence #{report.id}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              AI Analyzed Public Service Ticket
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#94A3B8' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Main Content Column */}
          <Grid item xs={12} md={7}>
            {/* Summary Banner */}
            <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', mb: 3 }}>
              <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AI Summary
              </Typography>
              <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 700, mt: 0.5, mb: 1 }}>
                {report.summary}
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.6 }}>
                "{report.description}"
              </Typography>
            </Box>

            {/* Location & Metadata */}
            <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ color: '#38BDF8', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Location</Typography>
                  <Typography variant="body2" sx={{ color: '#F8FAFC', fontWeight: 600 }}>{report.location}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ color: '#C084FC', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Reporter</Typography>
                  <Typography variant="body2" sx={{ color: '#F8FAFC', fontWeight: 600 }}>{report.reporter_name}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Logged At</Typography>
                  <Typography variant="body2" sx={{ color: '#F8FAFC', fontWeight: 600 }}>
                    {new Date(report.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </Typography>
                </Box>
              </Box>
            </Stack>

            {/* Recommended Action Box */}
            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                mb: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#34D399', mb: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 18 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>
                  Recommended Action
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#F8FAFC', fontWeight: 600 }}>
                {report.recommended_action}
              </Typography>
            </Box>

            {/* AI Reasoning */}
            <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(30, 41, 59, 0.4)', mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#A855F7', fontWeight: 700, textTransform: 'uppercase' }}>
                AI Priority & Routing Rationale
              </Typography>
              <Typography variant="body2" sx={{ color: '#CBD5E1', mt: 0.5, lineHeight: 1.6 }}>
                {report.reason}
              </Typography>
            </Box>
          </Grid>

          {/* Sidebar & Image Column */}
          <Grid item xs={12} md={5}>
            {/* Status & Priority Card */}
            <Box sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)', mb: 3 }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block', mb: 1.5 }}>
                Governance Classification
              </Typography>

              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>Category:</Typography>
                  <Chip label={report.category} size="small" sx={{ bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', fontWeight: 700 }} />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>Urgency Level:</Typography>
                  <Chip
                    label={report.priority.toUpperCase()}
                    size="small"
                    sx={{
                      bgcolor: `${getPriorityColor(report.priority)}20`,
                      color: getPriorityColor(report.priority),
                      border: `1px solid ${getPriorityColor(report.priority)}`,
                      fontWeight: 800
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>Assigned Unit:</Typography>
                  <Typography variant="subtitle2" sx={{ color: '#38BDF8', fontWeight: 700 }}>{report.department}</Typography>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1 }}>Update Status:</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={report.status}
                      onChange={(e) => onStatusChange(report.id, e.target.value)}
                      sx={{ bgcolor: '#0F172A', color: '#F8FAFC', fontWeight: 700, borderRadius: 2 }}
                    >
                      <MenuItem value="Pending">🟡 Pending</MenuItem>
                      <MenuItem value="In Progress">🔵 In Progress</MenuItem>
                      <MenuItem value="Resolved">🟢 Resolved</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Stack>
            </Box>

            {/* Attached Photo Preview */}
            {report.image_url && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, display: 'block', mb: 1 }}>
                  Uploaded Issue Photo
                </Typography>
                <Box
                  component="img"
                  src={report.image_url}
                  alt="Citizen report visual evidence"
                  sx={{
                    width: '100%',
                    maxHeight: 200,
                    objectFit: 'cover',
                    borderRadius: 3,
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                />
              </Box>
            )}

            {/* Accordion: Structured JSON Output */}
            <Accordion sx={{ bgcolor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px !important' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#94A3B8' }} />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CodeIcon sx={{ color: '#A855F7', fontSize: 18 }} />
                  <Typography variant="body2" sx={{ color: '#CBD5E1', fontWeight: 700 }}>
                    Structured AI JSON Schema
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <Box
                  component="pre"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#070A11',
                    color: '#38BDF8',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    overflowX: 'auto',
                    m: 0
                  }}
                >
                  {formattedJson}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, color: '#94A3B8', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
