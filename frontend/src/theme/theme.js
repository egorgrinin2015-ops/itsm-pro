import { createTheme } from '@mui/material/styles';

// Space Indigo Color Palette
export const colors = {
  spaceIndigo: '#22223b',
  dustyGrape: '#4a4e69',
  lilacAsh: '#9a8c98',
  almondSilk: '#c9ada7',
  seashell: '#f2e9e4',
  
  // Functional colors (яркие для SLA и статусов)
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
};

// Кастомная тема для Dashboard
export const customTheme = {
  // Background colors
  background: {
    primary: colors.spaceIndigo,      // #22223b - основной фон
    secondary: colors.dustyGrape,     // #4a4e69 - карточки
    elevated: colors.lilacAsh         // #9a8c98 - поднятые элементы
  },
  
  // Text colors
  text: {
    primary: colors.seashell,         // #f2e9e4 - основной текст
    secondary: colors.almondSilk,     // #c9ada7 - вторичный текст
    disabled: `${colors.almondSilk}80` // с прозрачностью
  },
  
  // Primary theme colors
  primary: {
    main: colors.lilacAsh,            // #9a8c98
    light: colors.almondSilk,         // #c9ada7
    dark: colors.dustyGrape,          // #4a4e69
    gradient: `linear-gradient(135deg, ${colors.lilacAsh} 0%, ${colors.almondSilk} 100%)`
  },
  
  // Border colors
  border: {
    main: `${colors.dustyGrape}60`,
    light: `${colors.lilacAsh}40`,
    dark: `${colors.spaceIndigo}80`
  },
  
  // Functional colors (яркие для SLA, статусов, графиков)
  functional: {
    success: {
      main: colors.success,
      bg: `${colors.success}20`,
      border: `${colors.success}40`
    },
    warning: {
      main: colors.warning,
      bg: `${colors.warning}20`,
      border: `${colors.warning}40`
    },
    error: {
      main: colors.error,
      bg: `${colors.error}20`,
      border: `${colors.error}40`
    },
    info: {
      main: colors.info,
      bg: `${colors.info}20`,
      border: `${colors.info}40`
    }
  },
  
  // Glass morphism styles
  glass: {
    dark: {
      background: `${colors.dustyGrape}B3`,
      border: `${colors.lilacAsh}40`,
      shadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    }
  },
  
  // Gradients
  gradients: {
    primary: `linear-gradient(135deg, ${colors.lilacAsh} 0%, ${colors.almondSilk} 100%)`,
    background: `linear-gradient(135deg, ${colors.spaceIndigo} 0%, ${colors.dustyGrape} 50%, ${colors.lilacAsh} 100%)`,
    card: `linear-gradient(135deg, ${colors.dustyGrape}CC 0%, ${colors.lilacAsh}80 100%)`
  },
  
  // Status colors
  status: {
    new: colors.info,
    in_progress: colors.warning,
    resolved: colors.success,
    closed: colors.almondSilk,
    waiting: colors.lilacAsh
  },
  
  // Priority colors
  priority: {
    low: colors.info,
    medium: colors.warning,
    high: colors.error,
    critical: colors.error
  },
  
  // SLA colors (яркие)
  sla: {
    met: colors.success,
    ok: colors.success,
    warning: colors.warning,
    breached: colors.error
  }
};

// Экспорт градиентов для обратной совместимости
export const gradients = customTheme.gradients;

// Тени
export const shadows = {
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  cardHover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  button: '0 4px 14px 0 rgba(0, 118, 255, 0.39)',
  buttonHover: '0 6px 20px rgba(93, 93, 93, 0.23)',
};

// MUI Theme (для компонентов Material-UI)
const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.lilacAsh,
      light: colors.almondSilk,
      dark: colors.dustyGrape,
      contrastText: colors.seashell,
    },
    secondary: {
      main: colors.dustyGrape,
      light: colors.lilacAsh,
      dark: colors.spaceIndigo,
      contrastText: colors.seashell,
    },
    success: {
      main: colors.success,
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: colors.warning,
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: colors.error,
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: colors.info,
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: colors.spaceIndigo,
      paper: colors.dustyGrape,
    },
    text: {
      primary: colors.seashell,
      secondary: colors.almondSilk,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    shadows.card,
    shadows.card,
    shadows.cardHover,
    shadows.cardHover,
    shadows.modal,
    shadows.modal,
    shadows.modal,
    shadows.modal,
    shadows.modal,
    shadows.modal,
    shadows.modal,
    shadows.modal,
    shadows.modal,
    shadows.modal,
    shadows.modal,
    shadows.modal,
    shadows.modal,
    shadows.modal,
    shadows.modal,
    shadows.modal,
    shadows.modal,
    shadows.modal,
    shadows.modal,
    shadows.modal,
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${colors.dustyGrape}60`,
          boxShadow: shadows.card,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: shadows.cardHover,
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontWeight: 500,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: shadows.buttonHover,
          },
        },
        contained: {
          boxShadow: shadows.button,
          background: customTheme.gradients.primary,
          '&:hover': {
            background: customTheme.gradients.primary,
            opacity: 0.9,
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${colors.dustyGrape}40`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
            '&.Mui-focused': {
              transform: 'translateY(-1px)',
              boxShadow: shadows.card,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: customTheme.gradients.primary,
          boxShadow: shadows.card,
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
});

// Default export - кастомная тема для Dashboard
export default customTheme;

// Именованный экспорт MUI theme для App.js
export { muiTheme };