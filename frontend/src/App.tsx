import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Container, Typography, Link, Stack, Chip } from '@mui/material';
import { theme } from './theme';
import { Navbar } from './components/Navbar';
import { CitizenPortal } from './pages/CitizenPortal';
import { AdminDashboard } from './pages/AdminDashboard';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'citizen' | 'admin'>('citizen');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#0B0F19',
          color: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: 'radial-gradient(ellipse at 50% -20%, rgba(14, 165, 233, 0.15), transparent 70%), radial-gradient(ellipse at 80% 80%, rgba(168, 85, 247, 0.08), transparent 70%)',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Navigation Bar */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Page Area */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          {activeTab === 'citizen' ? (
            <CitizenPortal
              onReportSubmitted={() => {}}
              onNavigateToAdmin={() => setActiveTab('admin')}
            />
          ) : (
            <AdminDashboard
              onNavigateToCitizen={() => setActiveTab('citizen')}
            />
          )}
        </Box>

        {/* Modern Civic Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 6,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(11, 15, 25, 0.95)',
            backdropFilter: 'blur(12px)'
          }}
        >
          <Container maxWidth="xl">
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                  NeuraGov © 2026 – AI Governance & Public Service Intelligence
                </Typography>
                <Chip
                  icon={<AutoAwesomeIcon sx={{ fontSize: '12px !important', color: '#38BDF8 !important' }} />}
                  label="Hackathon Edition"
                  size="small"
                  sx={{ bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', fontSize: '0.7rem', height: 20 }}
                />
              </Box>

              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Powered by React, Vite, TypeScript, Material UI, FastAPI & Google Gemini API
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
