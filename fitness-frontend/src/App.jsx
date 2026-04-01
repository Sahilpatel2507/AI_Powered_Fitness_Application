import { Box, Button, createTheme, ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, Container, IconButton } from "@mui/material";
import { useContext, useEffect, useState, useMemo } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivitiesDetail from "./components/ActivityDetail";
import Register from "./components/Register";

const ActivitiesPage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <ActivityForm onActivityAdded={() => window.location.reload()} />
      <ActivityList />
    </Box>
  );
};

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // ... (authReady and mode states remain the same)
  const [authReady, setAuthReady] = useState(false);
  const [mode, setMode] = useState('dark');

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newMode);
      return newMode;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  useEffect(() => {
    if (token) {
      dispatch(
        setCredentials({
          token,
          user: tokenData,
        })
      );
      localStorage.setItem("token", token);
      localStorage.setItem("userId", tokenData?.sub);
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  const theme = useMemo(() => createTheme({
    // ... (theme configuration remains the same)
    palette: {
      mode,
      ...(mode === 'light' ? {
        background: { default: '#f8fafc', paper: 'rgba(255, 255, 255, 0.85)' },
        primary: { main: '#0284c7' },
        secondary: { main: '#7c3aed' },
        text: { primary: '#0f172a', secondary: '#475569' }
      } : {
        background: { default: '#050510', paper: 'rgba(17, 24, 39, 0.65)' },
        primary: { main: '#06b6d4' },
        secondary: { main: '#8b5cf6' },
        text: { primary: '#f8fafc', secondary: '#cbd5e1' }
      })
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
      h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
      h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
      h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
      h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
      h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
      button: { fontFamily: '"Outfit", sans-serif', fontWeight: 600, textTransform: 'none' }
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: 'none',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
            boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px 0 rgba(0, 0, 0, 0.4)' : '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
            borderRadius: 16,
          })
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '10px 24px',
          }
        }
      }
    }
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', backdropFilter: 'blur(12px)', backgroundColor: mode === 'dark' ? 'rgba(5, 5, 16, 0.7)' : 'rgba(248, 240, 252, 0.7)' }}>
            <Toolbar sx={{ py: 1 }}>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1, background: mode === 'dark' ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' : 'linear-gradient(135deg, #0284c7, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
                <span style={{ fontSize: '1.4rem', marginRight: '8px' }}>⚡</span> AI Fitness
              </Typography>
              
              <Button onClick={toggleColorMode} sx={{ minWidth: 40, p: 1, mr: 2, borderRadius: '50%', color: 'text.primary' }}>
                {mode === 'dark' ? '☀️' : '🌙'}
              </Button>

              {!token ? (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="outlined" color="primary" onClick={() => navigate('/register')}>
                    Sign Up
                  </Button>
                  <Button variant="contained" sx={{ background: mode === 'dark' ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' : 'linear-gradient(135deg, #0284c7, #7c3aed)', color: 'white', '&:hover': { transform: 'translateY(-2px)' }, transition: 'all 0.3s' }} onClick={() => logIn()}>
                    Login
                  </Button>
                </Box>
              ) : (
                <Button variant="outlined" color="primary" onClick={() => {
                  const logoutUrl = `http://localhost:8181/realms/fitness-app/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(window.location.origin)}&client_id=oauth2-pkce-client`;
                  logOut();
                  window.location.href = logoutUrl;
                }} sx={{ borderColor: mode === 'dark' ? 'rgba(6,182,212,0.4)' : 'rgba(2,132,199,0.4)', '&:hover': { background: mode === 'dark' ? 'rgba(6,182,212,0.1)' : 'rgba(2,132,199,0.1)' } }}>
                  Logout
                </Button>
              )}
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ mt: 5, mb: 5, flexGrow: 1 }}>
            <Routes>
              {!token ? (
                <>
                  <Route path="/" element={
                    <Box sx={{ textAlign: 'center', mt: { xs: 8, md: 15 } }}>
                      <Typography variant="h2" sx={{ mb: 3, background: mode === 'dark' ? 'linear-gradient(90deg, #fff, #94a3b8)' : 'linear-gradient(90deg, #0f172a, #475569)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Future of Fitness Tracking
                      </Typography>
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: 'auto', fontWeight: 300 }}>
                        Log your activities and let our advanced AI generate personalized insights, improvements, and safety guidelines.
                      </Typography>
                      <Button variant="contained" size="large" onClick={() => navigate('/register')} sx={{ px: 6, py: 2, fontSize: '1.2rem', background: mode === 'dark' ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' : 'linear-gradient(135deg, #0284c7, #7c3aed)' }}>
                        Get Started Free
                      </Button>
                    </Box>
                  } />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              ) : (
                <>
                  <Route path="/activities" element={<ActivitiesPage />} />
                  <Route path="/activities/:id" element={<ActivitiesDetail />} />
                  <Route path="/" element={<Navigate to="/activities" replace />} />
                  <Route path="*" element={<Navigate to="/activities" replace />} />
                </>
              )}
            </Routes>
          </Container>
        </Box>
    </ThemeProvider>
  );
}

export default App;