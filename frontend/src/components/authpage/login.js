import React, { useState, useEffect } from 'react';
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
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setFormData({ email: savedEmail, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Login form submitted. Data:", formData);
    setLoading(true);
    try {
      console.log("Sending request to http://localhost:3002/api/auth/login");
      const response = await axios.post('http://localhost:3002/api/auth/login', formData);
      console.log("Login successful. Response:", response.data);
      localStorage.setItem('token', response.data.token);

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
        localStorage.setItem('rememberedPassword', formData.password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }

      setLoading(false);
      setSnackbar({ open: true, message: 'Login Successful! Redirecting...', severity: 'success' });
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error("Login Error:", err);
      setLoading(false);
      let msg = '';
      if (err.response) {
        msg = err.response.data?.message || 'Login failed. Please check your credentials.';
      } else if (err.request) {
        msg = 'No response from server. Please ensure the backend is running on port 3002.';
      } else {
        msg = 'An error occurred: ' + err.message;
      }
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

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
              backgroundImage: 'url(/Assets/sdg.png)',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundColor: colors.antiflashWhite,
              
              // --- RESPONSIVE IMAGE SIZE ---
              // Mobile (xs): 'cover' (Fills the banner area completely)
              // Desktop (md): '75%' (Your requested smaller size)
              backgroundSize: { xs: '60%', md: '100%' }, 
            }}
          />

          {/* --- RIGHT SIDE: LOGIN FORM --- */}
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
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Please enter your details to sign in.
              </Typography>

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      sx={{ color: colors.englishViolet, '&.Mui-checked': { color: colors.englishViolet } }} 
                    />
                  }
                  label={<Typography variant="body2">Remember me</Typography>}
                />
                <Link component={RouterLink} to="/forgotpassword" variant="body2" sx={{ color: colors.englishViolet, fontWeight: 'bold', textDecoration: 'none' }}>
                  Forgot Password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2, backgroundColor: colors.englishViolet }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
              </Button>

              <Divider sx={{ my: 2 }}>OR</Divider>

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
                Sign in with Google
              </Button>

              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don't have an account?{' '}
                <Link component={RouterLink} to="/signup" sx={{ color: colors.englishViolet, fontWeight: 'bold', textDecoration: 'none' }}>
                  Sign up
                </Link>
              </Typography>

            </Box>
          </Box>

        </Paper>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}