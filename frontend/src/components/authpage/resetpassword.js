import React from 'react';
import {
  Button,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// --- 1. YOUR PALETTE ---
const colors = {
  silver: '#C0BCBD',
  davysGray: '#4B444C',
  davysGray2: '#5F5965',
  englishViolet: '#5D4A68',
  antiflashWhite: '#F1F0F1',
};

// --- 2. THEME SETUP ---
const theme = createTheme({
  typography: {
    fontFamily: '"Quicksand", "Roboto", "Arial", sans-serif',
    h4: { fontWeight: 700, color: colors.davysGray },
    body1: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  palette: {
    primary: { main: colors.englishViolet },
    text: { primary: colors.davysGray, secondary: colors.davysGray2 },
    background: { default: colors.antiflashWhite },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': { color: colors.englishViolet },
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': { borderColor: colors.englishViolet },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 0',
        },
      },
    },
  },
});

export default function ResetPassword() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* OUTER CONTAINER */}
      <Grid
        container
        component="main"
        sx={{
          minHeight: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.silver,
          p: 2
        }}
      >

        {/* THE CENTERED CARD */}
        <Paper
          elevation={10}
          sx={{
            width: '100%',
            maxWidth: '1100px',
            height: { xs: 'auto', md: '800px' },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >

          {/* --- LEFT SIDE: IMAGE --- */}
          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              height: { xs: '200px', md: '100%' },
              backgroundImage: 'url(/Assets/post.png)',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundColor: colors.antiflashWhite,

              // --- RESPONSIVE IMAGE SIZE ---
              backgroundSize: { xs: '60%', md: '80%' },
            }}
          />

          {/* --- RIGHT SIDE: RESET PASSWORD FORM --- */}
          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              height: '100%',
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: { xs: 3, md: 4 },
            }}
          >
            <Box component="form" noValidate sx={{ width: '100%', maxWidth: '360px', py: { xs: 3, md: 0 } }}>

              <Typography
                variant="h3"
                align="center"
                sx={{
                  fontWeight: 700,
                  color: colors.englishViolet,
                  letterSpacing: '1px',
                  mb: 1,
                  fontSize: { xs: '2rem', md: '3rem' }
                }}
              >
                GeoSensei
              </Typography>

              <Typography component="h1" variant="h5" align="center" gutterBottom sx={{ fontWeight: 600, color: colors.davysGray }}>
                Reset Password
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Enter your new password below.
              </Typography>

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="New Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: colors.englishViolet }}
              >
                Reset Password
              </Button>

              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Remember your password?{' '}
                <Link component={RouterLink} to="/login" sx={{ color: colors.englishViolet, fontWeight: 'bold', textDecoration: 'none' }}>
                  Back to Login
                </Link>
              </Typography>

            </Box>
          </Box>

        </Paper>
      </Grid>
    </ThemeProvider>
  );
}
