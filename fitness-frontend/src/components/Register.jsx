import React, { useState, useContext } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Grid, Alert, CircularProgress, Link } from '@mui/material';
import { useNavigate } from 'react-router';
import { AuthContext } from 'react-oauth2-code-pkce';
import { registerUser } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { logIn } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8 }}>
      <Typography variant="h3" sx={{ textAlign: 'center', mb: 4, fontWeight: 800, background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Join the Future
      </Typography>
      
      <Card sx={{ 
        backdropFilter: 'blur(16px)', 
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <CardContent sx={{ p: 4 }}>
          {success ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h5" color="primary" sx={{ mb: 2 }}>✨ Registration Successful!</Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>Welcome to the AI Fitness family. Redirecting to login...</Typography>
              <CircularProgress size={30} />
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    variant="outlined"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    variant="outlined"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    variant="outlined"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    variant="outlined"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    helperText="Minimum 6 characters"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    variant="outlined"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Grid>
                
                {error && (
                  <Grid item xs={12}>
                    <Alert severity="error" sx={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>{error}</Alert>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ 
                      py: 1.5, 
                      fontSize: '1.1rem',
                      background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(6, 182, 212, 0.3)' }
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                  </Button>
                </Grid>
                
                <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account? {' '}
                    <Link 
                      component="button"
                      type="button"
                      onClick={() => logIn()} 
                      sx={{ 
                        color: '#06b6d4', 
                        textDecoration: 'none', 
                        fontWeight: 'bold',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 'inherit',
                        padding: 0
                      }}
                    >
                      Sign In here
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
