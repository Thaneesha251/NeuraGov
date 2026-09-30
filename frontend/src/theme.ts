import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#38BDF8', // Cyan/Sky Blue
      light: '#7DD3FC',
      dark: '#0284C7',
      contrastText: '#0F172A',
    },
    secondary: {
      main: '#A855F7', // AI Purple accent
      light: '#C084FC',
      dark: '#7E22CE',
    },
    background: {
      default: '#0B0F19', // Deep dark slate
      paper: '#1E293B',   // Dark card background
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
    },
    success: {
      main: '#10B981', // Emerald
    },
    warning: {
      main: '#F59E0B', // Amber
    },
    error: {
      main: '#EF4444', // Red
    },
    info: {
      main: '#6366F1', // Indigo
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 14px 0 rgba(14, 165, 233, 0.39)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)',
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '14px 16px',
        },
        head: {
          fontWeight: 700,
          color: '#94A3B8',
          backgroundColor: '#0F172A',
        },
      },
    },
  },
});
