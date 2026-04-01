import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Chip, Grid } from '@mui/material';
import { getActivities } from '../services/api';
import { useNavigate } from 'react-router';

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchActivities = async () => {
        try {
            const response = await getActivities();
            setActivities(response.data);
        } catch (error) {
            console.error("Error fetching activities:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

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

    if (loading) {
        return <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>Loading your activities...</Typography>;
    }

    if (activities.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', mt: 6, p: 4, borderRadius: 4, background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <Typography variant="h6" color="text.secondary">No activities logged yet.</Typography>
                <Typography variant="body2" color="text.secondary">Start moving to get AI-powered insights!</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ color: '#8b5cf6' }}>●</span> Recent Activities
            </Typography>
            <Grid container spacing={3}>
                {activities.map((activity) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={activity.id}>
                        <Card 
                            className="transition-all" 
                            sx={{ 
                                cursor: 'pointer', 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                '&:hover': {
                                    boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 0 20px rgba(6, 182, 212, 0.4)' : '0 10px 25px rgba(0,0,0,0.1)',
                                    transform: 'translateY(-4px)'
                                }
                            }} 
                            onClick={() => navigate(`/activities/${activity.id}`)}
                        >
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Typography variant="h3" sx={{ lineHeight: 1 }}>{getActivityIcon(activity.type)}</Typography>
                                        <Typography variant="h6" sx={{ textTransform: 'capitalize', fontWeight: 600, color: 'text.primary' }}>
                                            {activity.type?.toLowerCase()}
                                        </Typography>
                                    </Box>
                                    <Chip label={`${activity.duration} min`} size="small" sx={{ 
                                        background: (theme) => theme.palette.mode === 'dark' ? 'rgba(6,182,212,0.15)' : 'rgba(2,132,199,0.1)', 
                                        color: (theme) => theme.palette.mode === 'dark' ? '#06b6d4' : '#0284c7', 
                                        fontWeight: 'bold', 
                                        border: '1px solid',
                                        borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(6,182,212,0.3)' : 'rgba(2,132,199,0.2)'
                                    }} />
                                </Box>
                                
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Calories Burned</span>
                                        <Typography component="strong" color="text.primary" sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                                            {activity.caloriesBurned} kcal
                                        </Typography>
                                    </Typography>
                                    <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 1, pt: 1.5 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Logged on {new Date(activity.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ActivityList;