import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
  Alert,
} from '@mui/material';
import { Add, Business, Phone, Email, LocationOn } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const FacilityManagement = () => {
  const { getToken, hasRole } = useAuth();
  const [facilities, setFacilities] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    if (hasRole('ADMIN')) {
      apiService.setToken(getToken());
      loadFacilities();
    }
  }, [getToken, hasRole]);

  const loadFacilities = async () => {
    try {
      const response = await apiService.getFacilities();
      setFacilities(response.content || response);
    } catch (error) {
      console.error('Error loading facilities:', error);
      setError('Failed to load facilities');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      await apiService.createFacility(formData);
      setSuccess('Facility created successfully!');
      setOpen(false);
      setFormData({
        code: '',
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        email: '',
      });
      loadFacilities();
    } catch (error) {
      console.error('Error creating facility:', error);
      setError(error.response?.data?.message || 'Failed to create facility');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  if (!hasRole('ADMIN')) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">
          You don't have permission to access facility management.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Facility Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add New Facility
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {facilities.map((facility) => (
          <Grid item xs={12} md={6} lg={4} key={facility.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Business sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    {facility.name}
                  </Typography>
                  <Chip 
                    label={facility.code} 
                    size="small" 
                    color="primary" 
                    sx={{ ml: 'auto' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    {facility.address}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {facility.city}, {facility.state} {facility.zipCode}
                  </Typography>
                </Box>

                {facility.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      {facility.phone}
                    </Typography>
                  </Box>
                )}

                {facility.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      {facility.email}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={facility.active ? 'Active' : 'Inactive'} 
                    color={facility.active ? 'success' : 'default'}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    ID: {facility.id}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Facility Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Facility</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="code"
                label="Facility Code"
                value={formData.code}
                onChange={handleInputChange}
                required
                fullWidth
                helperText="Unique identifier (e.g., MAIN, NORTH)"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Facility Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                name="city"
                label="City"
                value={formData.city}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                name="state"
                label="State"
                value={formData.state}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                name="zipCode"
                label="ZIP Code"
                value={formData.zipCode}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? 'Creating...' : 'Create Facility'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FacilityManagement;