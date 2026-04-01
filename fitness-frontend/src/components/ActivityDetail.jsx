import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getActivityDetail } from '../services/api';
import { Box, Card, CardContent, Divider, Typography, Button, CircularProgress, Grid } from '@mui/material';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    let timeoutId;
    let isMounted = true;

    const fetchActivityDetail = async () => {
      try {
        const response = await getActivityDetail(id);
        if (isMounted) {
          setActivity(response.data);
          setRecommendation(response.data.recommendation);
        }
      } catch (error) {
        console.error("AI recommendation is still processing, retrying...", error);
        if (isMounted) {
          // Poll every 2 seconds until the recommendation response is ready
          timeoutId = setTimeout(fetchActivityDetail, 2000);
        }
      }
    }

    fetchActivityDetail();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [id]);

  if (!activity) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 15, gap: 3 }}>
            <CircularProgress size={60} thickness={4} sx={{ color: '#06b6d4' }} />
            <Typography variant="h4" sx={{ background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold', mt: 2 }}>
              Generating AI Insights...
            </Typography>
            <Typography variant="body1" color="text.secondary">Our advanced AI model is analyzing your activity data to provide custom recommendations.</Typography>
        </Box>
    );
  }

  const getActivityIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'RUNNING': return '🏃‍♂️';
      case 'WALKING': return '🚶‍♂️';
      case 'CYCLING': return '🚴‍♂️';
      case 'SWIMMING': return '🏊‍♂️';
      case 'YOGA': return '🧘‍♂️';
      case 'WEIGHTLIFTING': return '🏋️‍♂️';
      case 'HIKING': return '🥾';
      default: return '💪';
    }
  };

  const ListSection = ({ title, items, icon, color }) => {
    if (!items || items.length === 0) return null;
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ color: color, mb: 2, display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 'bold' }}>
          <span style={{ fontSize: '1.2rem' }}>{icon}</span> {title}
        </Typography>
        <Box component="ul" sx={{ pl: 2.5, m: 0, '& li': { mb: 1.5, color: 'text.secondary', lineHeight: 1.6, '&::marker': { color: color } } }}>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 1, md: 3 } }}>
        <Button 
          onClick={() => navigate('/activities')} 
          sx={{ mb: 4, color: 'text.secondary', '&:hover': { color: '#06b6d4', background: 'transparent' } }}
        >
          ← Back to Activities
        </Button>

        <Card className="glass-panel hover-glow" sx={{ mb: 4, transition: 'all 0.3s' }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span style={{ display: 'inline-block', width: 8, height: 24, background: '#06b6d4', borderRadius: 4 }}></span>
                    Activity Overview
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 3, md: 8 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h2">{getActivityIcon(activity.type)}</Typography>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 'bold' }}>Activity Type</Typography>
                      <Typography variant="h5" sx={{ textTransform: 'capitalize', color: 'text.primary', fontWeight: 'bold', mt: 0.5 }}>{activity.type?.toLowerCase()}</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 'bold' }}>Logged Date</Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mt: 0.5 }}>{new Date(activity.createdAt).toLocaleDateString()}</Typography>
                  </Box>
                </Box>
            </CardContent>
        </Card>

        {recommendation && (
            <Card className="glass-panel" sx={{ 
                border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.2)'} !important`,
                background: (theme) => `linear-gradient(180deg, ${theme.palette.background.paper} 0%, rgba(139, 92, 246, 0.08) 100%) !important`,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: (theme) => `0 10px 40px -10px ${theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.1)'} !important`
            }}>
                {/* Decorative glow in the corner */}
                <Box sx={{ position: 'absolute', top: -100, right: -100, width: 250, height: 250, background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                
                <CardContent sx={{ p: { xs: 3, md: 5 }, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 5 }}>
                        <Box sx={{ p: 1.5, background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.2))', borderRadius: 3, border: '1px solid rgba(139, 92, 246, 0.3)', display: 'flex' }}>
                           <Typography variant="h4" sx={{ lineHeight: 1 }}>✨</Typography>
                        </Box>
                        <Box>
                           <Typography variant="h3" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
                               AI Insights
                           </Typography>
                           <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Powered by Gemini Real-Time Analytics</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.03)', borderRadius: 3, borderLeft: '4px solid #06b6d4', p: 3, mb: 5 }}>
                        <Typography variant="h6" sx={{ color: '#06b6d4', mb: 1, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold' }}>Executive Summary</Typography>
                        <Typography variant="body1" color="text.primary" sx={{ fontSize: '1.15rem', lineHeight: 1.8 }}>
                            {activity.recommendation}
                        </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 5, borderColor: 'divider' }} />
                    
                    <Grid container spacing={5}>
                       <Grid item xs={12} md={6}>
                          <ListSection title="Areas for Improvement" items={activity.improvements} icon="📈" color="#06b6d4" />
                       </Grid>
                       <Grid item xs={12} md={6}>
                          <ListSection title="Actionable Suggestions" items={activity.suggestions} icon="💡" color="#c084fc" />
                       </Grid>
                       <Grid item xs={12}>
                          <Box sx={{ p: 4, background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.1))', borderRadius: 4, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            <ListSection title="Safety Guidelines & Precautions" items={activity.safety} icon="⚠️" color="#ef4444" />
                          </Box>
                       </Grid>
                    </Grid>
                    
                </CardContent>
            </Card>
        )}
    </Box>
  );
}

export default ActivityDetail;