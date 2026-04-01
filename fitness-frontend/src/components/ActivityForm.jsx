import { useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Card, CardContent, Typography, Grid } from "@mui/material";
import { addActivity } from "../services/api";

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: "RUNNING",
    duration: "",
    caloriesBurned: "",
    additionalMetrics: {},
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addActivity(activity);
      onActivityAdded();
      setActivity({
        type: "RUNNING",
        duration: "",
        caloriesBurned: "",
        additionalMetrics: {},
      });
    } catch (error) {
      console.error("Error adding activity:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ p: { xs: 1, md: 1 } }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
          <span style={{ color: '#06b6d4' }}>●</span> Log New Activity
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'text.secondary' }}>Activity Type</InputLabel>
                <Select
                  value={activity.type}
                  label="Activity Type"
                  onChange={(e) => setActivity({ ...activity, type: e.target.value })}
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiSelect-select': { color: 'text.primary' }
                  }}
                >
                  <MenuItem value="RUNNING">🏃‍♂️ Running</MenuItem>
                  <MenuItem value="WALKING">🚶‍♂️ Walking</MenuItem>
                  <MenuItem value="CYCLING">🚴‍♂️ Cycling</MenuItem>
                  <MenuItem value="SWIMMING">🏊‍♂️ Swimming</MenuItem>
                  <MenuItem value="YOGA">🧘‍♀️ Yoga</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                variant="outlined"
                value={activity.duration}
                onChange={(e) => setActivity({ ...activity, duration: Number(e.target.value) })}
                required
                slotProps={{
                    inputLabel: { 
                      sx: { 
                        color: 'text.secondary',
                        '&.Mui-focused': { color: 'primary.main' }
                      } 
                    },
                    input: { 
                      sx: { 
                        borderRadius: 2, 
                        color: 'text.primary',
                        '& input': {
                            color: 'text.primary',
                        }
                      } 
                    }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="Calories Burned"
                type="number"
                variant="outlined"
                value={activity.caloriesBurned}
                onChange={(e) => setActivity({ ...activity, caloriesBurned: Number(e.target.value) })}
                required
                slotProps={{
                    inputLabel: { 
                      sx: { 
                        color: 'text.secondary',
                        '&.Mui-focused': { color: 'primary.main' }
                      } 
                    },
                    input: { 
                      sx: { 
                        borderRadius: 2, 
                        color: 'text.primary',
                        '& input': {
                            color: 'text.primary',
                        }
                      } 
                    }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth
                disabled={loading}
                sx={{ 
                    height: 54, 
                    background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' : 'linear-gradient(135deg, #0284c7, #7c3aed)', 
                    color: 'white', 
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    '&:hover': { 
                      transform: 'scale(1.02)', 
                      boxShadow: '0 8px 20px rgba(6, 182, 212, 0.3)' 
                    }, 
                    transition: 'all 0.3s' 
                }}
              >
                {loading ? 'Logging...' : 'Add Activity'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActivityForm;