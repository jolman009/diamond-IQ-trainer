import { createTheme, responsiveFontSizes } from '@mui/material/styles';

/**
 * Material Design 3-inspired theme configuration
 * Based on Google's Material Design 3 guidelines
 * https://m3.material.io/
 *
 * Mobile-first responsive typography with breakpoint scaling
 */
const baseTheme = createTheme({
  // Custom breakpoints for better mobile control
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#06b6d4', // Cyan 500 - matching new UI
      light: '#22d3ee',
      dark: '#0891b2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#a855f7', // Purple 500
      light: '#c084fc',
      dark: '#9333ea',
      contrastText: '#fff',
    },
    error: {
      main: '#f43f5e', // Rose 500
      light: '#fb7185',
      dark: '#e11d48',
    },
    warning: {
      main: '#f59e0b', // Amber 500
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#3b82f6', // Blue 500
      light: '#60a5fa',
      dark: '#2563eb',
    },
    success: {
      main: '#22c55e', // Green 500
      light: '#4ade80',
      dark: '#16a34a',
    },
    background: {
      default: '#0f172a', // Slate 900
      paper: '#1e293b', // Slate 800
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
      secondary: 'rgba(255, 255, 255, 0.6)',
      disabled: 'rgba(255, 255, 255, 0.38)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Responsive typography - mobile-first sizes that scale up
    h1: {
      fontSize: '1.75rem', // Mobile base
      fontWeight: 700,
      letterSpacing: '-0.015625rem',
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
      '@media (min-width:900px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontSize: '1.5rem', // Mobile base
      fontWeight: 700,
      letterSpacing: '0rem',
      '@media (min-width:600px)': {
        fontSize: '1.75rem',
      },
      '@media (min-width:900px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontSize: '1.25rem', // Mobile base
      fontWeight: 700,
      letterSpacing: '0rem',
      '@media (min-width:600px)': {
        fontSize: '1.5rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.75rem',
      },
    },
    h4: {
      fontSize: '1.125rem', // Mobile base
      fontWeight: 700,
      letterSpacing: '0.009375rem',
      '@media (min-width:600px)': {
        fontSize: '1.25rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.5rem',
      },
    },
    h5: {
      fontSize: '1rem', // Mobile base
      fontWeight: 700,
      letterSpacing: '0rem',
      '@media (min-width:600px)': {
        fontSize: '1.125rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.25rem',
      },
    },
    h6: {
      fontSize: '0.875rem', // Mobile base
      fontWeight: 700,
      letterSpacing: '0.03125rem',
      '@media (min-width:600px)': {
        fontSize: '0.9375rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1rem',
      },
    },
    body1: {
      fontSize: '0.9375rem', // Mobile base (15px)
      fontWeight: 400,
      letterSpacing: '0.03125rem',
      '@media (min-width:600px)': {
        fontSize: '1rem',
      },
    },
    body2: {
      fontSize: '0.8125rem', // Mobile base (13px)
      fontWeight: 400,
      letterSpacing: '0.0125rem',
      '@media (min-width:600px)': {
        fontSize: '0.875rem',
      },
    },
    button: {
      fontSize: '0.8125rem', // Mobile base
      fontWeight: 600,
      letterSpacing: '0.0625rem',
      textTransform: 'uppercase',
      '@media (min-width:600px)': {
        fontSize: '0.875rem',
      },
    },
    caption: {
      fontSize: '0.6875rem', // Mobile base (11px)
      fontWeight: 400,
      letterSpacing: '0.0375rem',
      '@media (min-width:600px)': {
        fontSize: '0.75rem',
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
        sizeSmall: {
          // Smaller chips on mobile
          fontSize: '0.6875rem',
          height: 24,
          '@media (min-width:600px)': {
            fontSize: '0.75rem',
            height: 28,
          },
        },
      },
    },
    // Responsive dialog for mobile
    MuiDialog: {
      styleOverrides: {
        paper: {
          margin: 16,
          maxHeight: 'calc(100% - 32px)',
          '@media (max-width:599px)': {
            margin: 8,
            maxHeight: 'calc(100% - 16px)',
            width: 'calc(100% - 16px)',
            maxWidth: 'calc(100% - 16px) !important',
          },
        },
      },
    },
    // Responsive container padding
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
          '@media (min-width:600px)': {
            paddingLeft: 24,
            paddingRight: 24,
          },
        },
      },
    },
    // Better touch targets on mobile
    MuiIconButton: {
      styleOverrides: {
        root: {
          '@media (max-width:599px)': {
            padding: 10,
          },
        },
      },
    },
  },
});

// Export the theme with responsive font sizes
export const m3Theme = responsiveFontSizes(baseTheme, {
  breakpoints: ['sm', 'md'],
  factor: 2,
});
