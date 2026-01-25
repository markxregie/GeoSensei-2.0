import React, { useState } from 'react';
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
  Checkbox,
  FormControlLabel,
  Divider
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { Link as RouterLink } from 'react-router-dom';
import TermsModal from './TermsModal';

// --- 1. YOUR PALETTE ---
const colors = {
  silver: '#C0BCBD',
  davysGray: '#4B444C',
  davysGray2: '#5F5965',
  englishViolet: '#5D4A68',
  antiflashWhite: '#F1F0F1',
};

// --- 2. THEME SETUP (Quicksand Font + Colors) ---
const theme = createTheme({
  typography: {
    fontFamily: '"Quicksand", "Roboto", "Arial", sans-serif',
    h4: { fontWeight: 700, color: colors.davysGray },
    body1: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 700 }, // No ALL CAPS buttons
  },
  palette: {
    primary: { main: colors.englishViolet },
    text: { primary: colors.davysGray, secondary: colors.davysGray2 },
    background: { default: colors.antiflashWhite },
  },
  components: {
    // Make text fields look clean
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
    // Rounded buttons
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

export default function Signup() {
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const handleTermsClick = () => {
    setTermsModalOpen(true);
  };

  const handleTermsClose = () => {
    setTermsModalOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* OUTER CONTAINER: Centers the square in the middle of the screen */}
      <Grid
        container
        component="main"
        sx={{
          // RESPONSIVE: Use minHeight instead of height to allow scrolling on mobile
          minHeight: '100vh', 
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.silver, // Optional: Darker background outside the card
          // RESPONSIVE: Add padding on mobile so edges don't touch
          p: { xs: 2, md: 0 } 
        }}
      >

        {/* THE CENTERED SQUARE CARD */}
        <Paper
          elevation={10}
          sx={{
            width: '100%',
            maxWidth: '1120px', // Max width of the card
            // RESPONSIVE: Auto height on mobile, Fixed 870px on desktop
            height: { xs: 'auto', md: '870px' }, 
            display: 'flex',
            // RESPONSIVE: Column direction on mobile, Row on desktop
            flexDirection: { xs: 'column', md: 'row' }, 
            borderRadius: '16px', // Rounded corners
            overflow: 'hidden',   // Clips the image to the corners
          }}
        >

          {/* --- LEFT SIDE: IMAGE PLACEHOLDER --- */}
          <Box
            sx={{
              // RESPONSIVE: 100% width on mobile, 50% on desktop
              width: { xs: '100%', md: '50%' }, 
              // RESPONSIVE: 200px banner height on mobile, 100% on desktop
              height: { xs: '200px', md: '100%' }, 
              backgroundImage: 'url(/Assets/Startup3.png)', // Image from Assets folder
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundColor: colors.antiflashWhite, // Fallback color
              // Keeps your original size logic
              backgroundSize: { xs: 'contain', md: '90%' }, 
            }}
          />

          {/* --- RIGHT SIDE: SIGNUP FORM --- */}
          <Box
            sx={{
              // RESPONSIVE: 100% width on mobile, 50% on desktop
              width: { xs: '100%', md: '50%' }, 
              height: '100%',
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              // RESPONSIVE: Adjust padding for smaller screens
              padding: { xs: 3, md: 4 }, 
            }}
          >
            <Box component="form" noValidate sx={{ width: '100%', maxWidth: '360px' }}>

              {/* Header Section */}
              <Typography
                variant="h3"
                align="center"
                sx={{
                  fontWeight: 700,
                  color: colors.englishViolet,
                  letterSpacing: '1px',
                  mb: 1,
                  // Responsive font size for title
                  fontSize: { xs: '2rem', md: '3rem' }
                }}
              >
                GeoSensei
              </Typography>

              <Typography component="h1" variant="h5" align="center" gutterBottom sx={{ fontWeight: 600, color: colors.davysGray }}>
                Create Account
              </Typography>

              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Please enter your details to sign up.
              </Typography>

              {/* Inputs */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
              />

              {/* Terms and Conditions */}
              <FormControlLabel
                control={<Checkbox value="terms" sx={{ color: colors.englishViolet, '&.Mui-checked': { color: colors.englishViolet } }} />}
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Link
                      component="button"
                      variant="body2"
                      onClick={(e) => {
                        e.preventDefault();
                        handleTermsClick();
                      }}
                      sx={{
                        color: colors.englishViolet,
                        fontWeight: 'bold',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Terms and Conditions
                    </Link>
                  </Typography>
                }
                sx={{ mt: 1 }}
              />

              {/* Signup Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: colors.englishViolet }}
              >
                Sign Up
              </Button>

              <Divider sx={{ my: 2 }}>OR</Divider>

              {/* Google Button */}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                sx={{
                  color: colors.davysGray,
                  borderColor: colors.silver,
                  '&:hover': { borderColor: colors.davysGray, backgroundColor: colors.antiflashWhite }
                }}
              >
                Sign up with Google
              </Button>

              {/* Sign In Link */}
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" sx={{ color: colors.englishViolet, fontWeight: 'bold', textDecoration: 'none' }}>
                  Sign in
                </Link>
              </Typography>

            </Box>
          </Box>

        </Paper>
      </Grid>

      {/* Terms Modal */}
      <TermsModal open={termsModalOpen} onClose={handleTermsClose} />
    </ThemeProvider>
  );
}
