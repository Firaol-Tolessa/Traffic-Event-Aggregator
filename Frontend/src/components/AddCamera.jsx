import React, { useState } from 'react';
import { gql } from "@apollo/client/core";
import { useMutation } from "@apollo/client/react";
import { 
  Card, CardContent, Typography, TextField, Button, Box, Alert, CircularProgress 
} from '@mui/material';


const ADD_CAMERA_MUTATION = gql`
  mutation AddCamera($model: String!, $location: String!, $cameraId: String!) {
    addCamera(model: $model, location: $location, cameraId: $cameraId) {
      cameraId
      model
      location
    }
  }
`;

export default function AddCameraForm() {
  const [formData, setFormData] = useState({ model: '', location: '', cameraId: '' });


  const [addCamera, { data, loading, error }] = useMutation(ADD_CAMERA_MUTATION);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.model || !formData.location || !formData.cameraId) {
        alert('All fields are required.');
        return;
    }
    
 
    addCamera({ variables: formData });
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          Add New Camera
        </Typography>
        
        {/* Success Alert */}
        {data && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Camera {data.addCamera.cameraId} ({data.addCamera.model}) added successfully!
          </Alert>
        )}
        
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error adding camera: {error.message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            name="cameraId"
            label="Camera ID"
            variant="outlined"
            size="small"
            required
            value={formData.cameraId}
            onChange={handleChange}
          />
          <TextField
            name="model"
            label="Model (e.g., Axis P1375)"
            variant="outlined"
            size="small"
            required
            value={formData.model}
            onChange={handleChange}
          />
          <TextField
            name="location"
            label="Location (e.g., Main Street Bridge)"
            variant="outlined"
            size="small"
            required
            value={formData.location}
            onChange={handleChange}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Camera'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}