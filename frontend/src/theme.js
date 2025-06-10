import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#1e3a8a' },
          secondary: { main: '#3b82f6' },
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
          text: {
            primary: '#000000',
            secondary: '#4f4f4f',
          },
        }
      : {
          primary: { main: '#90caf9' },
          secondary: { main: '#64b5f6' },
          background: {
            default: '#121212',
            paper: '#1e1e1e',
          },
          text: {
            primary: '#ffffff',
            secondary: '#cfcfcf',
          },
        }),
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});