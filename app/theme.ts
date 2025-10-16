'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#C1A875',
    },
    secondary: {
      main: '#7B5835',
    },
    background: {
      default: '#FAF8F3',
      paper: 'rgba(255, 255, 255, 0.75)',
    },
    text: {
      primary: '#1E1E1E',
    },
  },
  typography: {
    fontFamily: '"Crimson Pro", serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background-image: url('/Texture.png');
          background-repeat: repeat;
          background-attachment: fixed;
        }
      `,
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          borderRadius: '16px',
          boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#A6865D',
    },
    secondary: {
      main: '#E6CD96',
    },
    background: {
      default: '#181614',
      paper: 'rgba(36, 34, 32, 0.6)',
    },
    text: {
      primary: '#EDEBE6',
    },
  },
  typography: {
    fontFamily: '"Crimson Pro", serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background-image: url('/Texture.png');
          background-repeat: repeat;
          background-attachment: fixed;
        }
      `,
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export { theme, darkTheme };
