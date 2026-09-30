import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Alert,
  Chip,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PsychologyIcon from '@mui/icons-material/Psychology';

import { apiClient } from '../api/client';
import { AIAnalysis, Report } from '../types/report';
import { ImageUploader } from '../components/ImageUploader';
import { AiAnalysisCard } from '../components/AiAnalysisCard';

interface CitizenPortalProps {
  onReportSubmitted?: () => void;
  onNavigateToAdmin?: () => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({ onReportSubmitted, onNavigateToAdmin }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Auto-Detect');
  const [reporterName, setReporterName] = useState('');
  const [imageData, setImageData] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<Report | null>(null);
  const [aiPreview, setAiPreview] = useState<AIAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Preset example filler for quick testing
  const fillPreset = (presetType: string) => {
    setSubmittedReport(null);
    setAiPreview(null);
    setErrorMsg(null);

    if (presetType === 'streetlight') {
      setDescription('There has been no streetlight working near the college entrance for the last five days.');
      setLocation("St. Mary's College Entrance, Park Avenue");
      setCategory('Auto-Detect');
      setReporterName('Anita Sharma');
    } else if (presetType === 'pothole') {
      setDescription('Large deep pothole on the right lane causing severe traffic bottleneck and vehicle tire damage.');
      setLocation('Metro Pillar 142, MG Road Junction');
      setCategory('Roads & Potholes');
      setReporterName('Rahul Verma');
    } else if (presetType === 'water') {
      setDescription('Main drinking water pipe burst gushing water onto the street and flooding nearby shop entrances.');
      setLocation('Sector 4, Near City Hospital');
      setCategory('Water & Drainage');
      setReporterName('Dr. S. K. Gupta');
    }
  };

  const handlePreviewAI = async () => {
    if (!description.trim() || description.length < 5) {
      setErrorMsg('Please enter an issue description of at least 5 characters to trigger AI preview.');
      return;
    }
    setErrorMsg(null);
    setPreviewLoading(true);
    try {
      const res = await apiClient.analyzePreview({
        description,
        location: location || 'General Area',
        category: category === 'Auto-Detect' ? undefined : category,
        reporter_name: reporterName || 'Anonymous Citizen'
      });
      setAiPreview(res);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Failed to generate AI preview.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !location.trim()) {
      setErrorMsg('Please provide both issue description and location.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);
    try {
      const newReport = await apiClient.createReport({
        description,
        location,
        category: category === 'Auto-Detect' ? undefined : category,
        image_data: imageData || undefined,
        reporter_name: reporterName || 'Anonymous Citizen'
      });
      setSubmittedReport(newReport);
      setAiPreview(null);
      if (onReportSubmitted) onReportSubmitted();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Error submitting report to NeuraGov server.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setDescription('');
    setLocation('');
    setCategory('Auto-Detect');
    setReporterName('');
    setImageData(null);
    setSubmittedReport(null);
    setAiPreview(null);
    setErrorMsg(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Chip
          icon={<AutoAwesomeIcon sx={{ fontSize: '16px !important', color: '#A855F7 !important' }} />}
          label="AI-Powered Civic Redressal Portal"
          sx={{
            bgcolor: 'rgba(168, 85, 247, 0.15)',
            color: '#C084FC',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            fontWeight: 700,
            mb: 2
          }}
        />
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', mb: 1 }}>
          Report a Public Service Issue
        </Typography>
        <Typography variant="body1" sx={{ color: '#94A3B8', maxWidth: 640, mx: 'auto' }}>
          NeuraGov AI automatically analyzes your issue description, categorizes urgency, determines department routing, and alerts municipal field workers.
        </Typography>
      </Box>

      {/* Quick Demo Presets Bar */}
      <Paper sx={{ p: 2.5, mb: 4, borderRadius: 3, bgcolor: 'rgba(30, 41, 59, 0.5)', border: '1px dashed rgba(56, 189, 248, 0.3)' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PsychologyIcon sx={{ color: '#38BDF8' }} />
            <Typography variant="subtitle2" sx={{ color: '#F8FAFC', fontWeight: 700 }}>
              Hackathon Quick Test Presets:
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} flexWrap="wrap">
            <Button
              size="small"
              variant="outlined"
              onClick={() => fillPreset('streetlight')}
              sx={{ borderRadius: 2, borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38BDF8', fontSize: '0.75rem' }}
            >
              💡 Streetlight Issue (Prompt Ex)
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => fillPreset('pothole')}
              sx={{ borderRadius: 2, borderColor: 'rgba(249, 115, 22, 0.4)', color: '#F97316', fontSize: '0.75rem' }}
            >
              🛣️ Highway Pothole
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => fillPreset('water')}
              sx={{ borderRadius: 2, borderColor: 'rgba(52, 211, 153, 0.4)', color: '#34D399', fontSize: '0.75rem' }}
            >
              💧 Water Pipe Burst
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#FCA5A5' }}>
          {errorMsg}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Form Column */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReportProblemIcon sx={{ color: '#38BDF8' }} />
                Issue Submission Form
              </Typography>

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Issue Description"
                    placeholder="Describe what is broken, how long it has been present, and any safety concerns..."
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.6)',
                        borderRadius: 3
                      }
                    }}
                  />

                  <TextField
                    label="Location / Landmark"
                    placeholder="e.g. St. Mary's College entrance, Park Avenue..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: <LocationOnIcon sx={{ color: '#38BDF8', mr: 1 }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.6)',
                        borderRadius: 3
                      }
                    }}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Category Preference</InputLabel>
                        <Select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          label="Category Preference"
                          sx={{ borderRadius: 3, bgcolor: 'rgba(15, 23, 42, 0.6)' }}
                        >
                          <MenuItem value="Auto-Detect">✨ Auto-Detect with AI</MenuItem>
                          <MenuItem value="Streetlight & Electricity">Streetlight & Electricity</MenuItem>
                          <MenuItem value="Roads & Potholes">Roads & Potholes</MenuItem>
                          <MenuItem value="Water & Drainage">Water & Drainage</MenuItem>
                          <MenuItem value="Waste & Sanitation">Waste & Sanitation</MenuItem>
                          <MenuItem value="Traffic & Signals">Traffic & Signals</MenuItem>
                          <MenuItem value="Parks & Environment">Parks & Environment</MenuItem>
                          <MenuItem value="Public Infrastructure">Public Infrastructure</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Your Name (Optional)"
                        placeholder="Anonymous Citizen"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'rgba(15, 23, 42, 0.6)',
                            borderRadius: 3
                          }
                        }}
                      />
                    </Grid>
                  </Grid>

                  <ImageUploader imageData={imageData} setImageData={setImageData} />

                  <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                    <Button
                      type="button"
                      variant="outlined"
                      color="secondary"
                      onClick={handlePreviewAI}
                      disabled={previewLoading || loading}
                      startIcon={previewLoading ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
                      sx={{ flex: 1, py: 1.5, borderRadius: 3 }}
                    >
                      AI Preview
                    </Button>

                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading || previewLoading}
                      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                      sx={{ flex: 1, py: 1.5, borderRadius: 3, fontWeight: 800 }}
                    >
                      Submit Report
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Results Column */}
        <Grid item xs={12} md={6}>
          {submittedReport ? (
            <Box>
              <Alert
                icon={<CheckCircleIcon sx={{ color: '#10B981' }} />}
                severity="success"
                action={
                  <Button color="inherit" size="small" onClick={handleResetForm}>
                    Submit Another
                  </Button>
                }
                sx={{ mb: 3, borderRadius: 3, bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)' }}
              >
                Report Successfully Filed & Routed! Ticket #{submittedReport.id}
              </Alert>

              <AiAnalysisCard analysis={submittedReport} />

              {onNavigateToAdmin && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={onNavigateToAdmin}
                    sx={{ borderRadius: 3, py: 1.2, px: 3 }}
                  >
                    View in Admin Governance Dashboard →
                  </Button>
                </Box>
              )}
            </Box>
          ) : aiPreview ? (
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#A855F7', fontWeight: 800, mb: 1, textTransform: 'uppercase' }}>
                Instant AI Classification Preview
              </Typography>
              <AiAnalysisCard analysis={aiPreview} />
            </Box>
          ) : (
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                textAlign: 'center',
                bgcolor: 'rgba(30, 41, 59, 0.3)',
                border: '2px dashed rgba(255, 255, 255, 0.08)'
              }}
            >
              <Box>
                <AutoAwesomeIcon sx={{ fontSize: 48, color: '#64748B', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#F8FAFC', fontWeight: 700, mb: 1 }}>
                  Real-time AI Intelligence Output
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', maxWidth: 360, mx: 'auto' }}>
                  Enter your report details or click a demo preset to see how NeuraGov AI instantly classifies category, priority, department, and corrective action.
                </Typography>
              </Box>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
