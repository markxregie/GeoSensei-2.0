import React, { useState, useRef, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

export default function OTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error("No email found. Please sign up first.");
    }
  }, [email]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:3002/api/auth/verify-otp', { email, otp: otpCode });
      toast.success("Verification successful! Redirecting to login...");
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Verification failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="top-right" autoClose={5000} theme="colored" />

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
              backgroundImage: 'url(/Assets/Password.png)',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundColor: colors.antiflashWhite,

              // --- RESPONSIVE IMAGE SIZE ---
              backgroundSize: { xs: '60%', md: '80%' },
            }}
          />

          {/* --- RIGHT SIDE: OTP FORM --- */}
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
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: '360px', py: { xs: 3, md: 0 } }}>

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
                Enter OTP
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Enter the 6-digit code sent to your email.
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                {otp.map((digit, index) => (
                  <TextField
                    key={index}
                    inputRef={(el) => inputRefs.current[index] = el}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                    sx={{
                      width: '50px',
                      '& .MuiOutlinedInput-root': {
                        height: '50px',
                        '& input': {
                          textAlign: 'center',
                          fontSize: '24px',
                        },
                      },
                    }}
                  />
                ))}
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: colors.englishViolet, height: 40 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
              </Button>

              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Didn't receive the code?{' '}
                <Link component={RouterLink} to="/forgotpassword" sx={{ color: colors.englishViolet, fontWeight: 'bold', textDecoration: 'none' }}>
                  Resend
                </Link>
              </Typography>

            </Box>
          </Box>

        </Paper>
      </Grid>
    </ThemeProvider>
  );
}
