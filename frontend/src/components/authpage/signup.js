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
  Divider,
  InputAdornment,
  IconButton,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const navigate = useNavigate();
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear specific field error on change
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }

    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[!@#$%^&*]/.test(password)) score += 1;
    // Bonus for length > 14
    if (password.length > 14) score += 1; 
    
    // Normalize to 0-100 for LinearProgress (max score 5 -> 100)
    setPasswordStrength(Math.min(score * 20, 100));
  };

  const validateForm = () => {
    const errors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,16}$/;

    if (!formData.firstName.trim()) errors.firstName = "First Name is required";
    else if (!nameRegex.test(formData.firstName)) errors.firstName = "Only letters allowed (no numbers/special chars)";

    if (!formData.lastName.trim()) errors.lastName = "Last Name is required";
    else if (!nameRegex.test(formData.lastName)) errors.lastName = "Only letters allowed (no numbers/special chars)";

    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) errors.email = "Invalid email format";

    if (!formData.password) errors.password = "Password is required";
    else {
      if (!passRegex.test(formData.password)) errors.password = "Must be 12-16 chars, 1 uppercase, 1 digit, 1 special char";
      
      const lowerPass = formData.password.toLowerCase();
      if (
        (formData.firstName && lowerPass.includes(formData.firstName.toLowerCase())) ||
        (formData.lastName && lowerPass.includes(formData.lastName.toLowerCase())) ||
        (formData.email && lowerPass.includes(formData.email.split('@')[0].toLowerCase()))
      ) {
        errors.password = "Password cannot contain your name or email";
      }
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors before submitting.");
      return;
    }

    setLoading(true);
    console.log("Signup form submitted. Data:", formData);

    try {
      // Exclude confirmPassword from the payload sent to backend
      const { confirmPassword, ...submitData } = formData;
      console.log("Sending request to http://localhost:3002/api/auth/signup");
      await axios.post('http://localhost:3002/api/auth/signup', submitData);
      console.log("Signup successful.");
      toast.success("Signup successful! OTP sent to your email.");
      setTimeout(() => {
        navigate('/otp', { state: { email: formData.email } });
      }, 2000);
    } catch (err) {
      console.error("Signup Error:", err);
      const errorMessage = err.response?.data?.message || 'An unknown error occurred. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTermsClick = () => {
    setTermsModalOpen(true);
  };

  const handleTermsClose = () => {
    setTermsModalOpen(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const getStrengthColor = () => {
    if (passwordStrength <= 40) return 'error';
    if (passwordStrength <= 80) return 'warning';
    return 'success';
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

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
            height: { xs: 'auto', md: '900px' }, 
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
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: '360px' }}>

              {/* Header Section */}
              <Typography
                variant="h3"
                align="center"
                sx={{
                  fontWeight: 700,
                  color: colors.englishViolet,
                  letterSpacing: '1px',
                  mb: 0,
                  // Responsive font size for title
                  fontSize: { xs: '2rem', md: '3rem' }
                }}
              >
                GeoSensei
              </Typography>

              <Typography component="h1" variant="h5" align="center" sx={{ fontWeight: 600, color: colors.davysGray, mb: 0.5 }}>
                Create Account
              </Typography>

              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1.5 }}>
                Please enter your details to sign up.
              </Typography>

              {/* Inputs */}
              <TextField
                margin="dense"
                size="small"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
                autoFocus
                error={!!fieldErrors.firstName}
                helperText={fieldErrors.firstName || " "}
              />
              <TextField
                margin="dense"
                size="small"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                error={!!fieldErrors.lastName}
                helperText={fieldErrors.lastName || " "}
              />
              <TextField
                margin="dense"
                size="small"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                error={!!fieldErrors.email}
                helperText={fieldErrors.email || " "}
              />
              <TextField
                margin="dense"
                size="small"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                error={!!fieldErrors.password}
                helperText={fieldErrors.password || " "}
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <Box sx={{ width: '100%', mt: 0.5, mb: 0.5 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={passwordStrength} 
                    color={getStrengthColor()} 
                    sx={{ height: 6, borderRadius: 5 }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Strength: {passwordStrength <= 40 ? 'Weak' : passwordStrength <= 80 ? 'Medium' : 'Strong'}
                  </Typography>
                </Box>
              )}

              <TextField
                margin="dense"
                size="small"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword || " "}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
                sx={{ mt: 0.5 }}
              />

              {/* Signup Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 1, backgroundColor: colors.englishViolet, height: 40 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
              </Button>

              <Divider sx={{ my: 1 }}>OR</Divider>

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
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
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
