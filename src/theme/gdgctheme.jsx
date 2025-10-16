// src/theme/gdgcTheme.js
import { createTheme } from '@mui/material/styles';

export const gdgcTheme = createTheme({
    palette: {
        primary: {
            main: '#4285f4', // Google Blue
            light: '#8ab4f8',
            dark: '#1565c0',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#34a853', // Google Green
            light: '#81c784',
            dark: '#2e7d32',
            contrastText: '#ffffff'
        },
        error: {
            main: '#ea4335', // Google Red
        },
        warning: {
            main: '#f9ab00', // Google Yellow
        },
        background: {
            default: '#f8f9fa',
            paper: '#ffffff'
        },
        text: {
            primary: '#202124',
            secondary: '#5f6368'
        }
    },
    typography: {
        fontFamily: '"Google Sans", "Roboto", "Arial", sans-serif',
        h1: {
            fontFamily: '"Google Sans", sans-serif',
            fontWeight: 700,
            fontSize: '2.5rem'
        },
        h2: {
            fontFamily: '"Google Sans", sans-serif',
            fontWeight: 600,
            fontSize: '2rem'
        },
        h3: {
            fontFamily: '"Google Sans", sans-serif',
            fontWeight: 600,
            fontSize: '1.5rem'
        },
        body1: {
            fontFamily: '"Google Sans", sans-serif',
            fontWeight: 400,
            fontSize: '1rem'
        },
        button: {
            fontFamily: '"Google Sans", sans-serif',
            fontWeight: 500,
            textTransform: 'none'
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    padding: '12px 24px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                    '&:hover': {
                        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
                    }
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#202124',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }
            }
        }
    }
});
