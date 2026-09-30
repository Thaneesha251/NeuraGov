import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddTaskIcon from '@mui/icons-material/AddTask';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CodeIcon from '@mui/icons-material/Code';

interface NavbarProps {
  activeTab: 'citizen' | 'admin';
  setActiveTab: (tab: 'citizen' | 'admin') => void;
  onOpenDemoJson?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'rgba(11, 15, 25, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'none',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, sm: 2 }, py: 1 }}>
          {/* Logo & Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => setActiveTab('citizen')}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #0EA5E9 0%, #7E22CE 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)'
              }}
            >
              <AccountBalanceIcon sx={{ color: '#ffffff', fontSize: 24 }} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  Neura<span style={{ color: '#38BDF8' }}>Gov</span>
                </Typography>
                <Chip
                  icon={<AutoAwesomeIcon sx={{ fontSize: '14px !important', color: '#A855F7 !important' }} />}
                  label="AI Powered"
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.7rem',
                    backgroundColor: 'rgba(168, 85, 247, 0.15)',
                    color: '#C084FC',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    fontWeight: 700
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: '#64748B', display: { xs: 'none', sm: 'block' }, fontSize: '0.75rem' }}>
                Public Service Intelligence & Governance Platform
              </Typography>
            </Box>
          </Box>

          {/* Center Navigation Buttons */}
          <Stack direction="row" spacing={1} sx={{ background: 'rgba(30, 41, 59, 0.6)', p: 0.5, borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <Button
              variant={activeTab === 'citizen' ? 'contained' : 'text'}
              color="primary"
              startIcon={<AddTaskIcon />}
              onClick={() => setActiveTab('citizen')}
              sx={{
                borderRadius: 2.5,
                px: 2.5,
                color: activeTab === 'citizen' ? '#0F172A' : '#94A3B8',
                fontWeight: 700
              }}
            >
              Citizen Portal
            </Button>
            <Button
              variant={activeTab === 'admin' ? 'contained' : 'text'}
              color="secondary"
              startIcon={<DashboardIcon />}
              onClick={() => setActiveTab('admin')}
              sx={{
                borderRadius: 2.5,
                px: 2.5,
                color: activeTab === 'admin' ? '#FFFFFF' : '#94A3B8',
                fontWeight: 700
              }}
            >
              Admin Dashboard
            </Button>
          </Stack>

          {/* Right Status Badge */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
            <Chip
              variant="outlined"
              label="Gemini / AI Fallback Ready"
              size="small"
              sx={{
                borderColor: '#10B981',
                color: '#34D399',
                fontSize: '0.75rem',
                py: 0.5,
                '& .MuiChip-label': { px: 1.5 }
              }}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
