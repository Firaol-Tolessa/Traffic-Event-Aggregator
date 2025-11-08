import React, { useState } from 'react';
import { gql } from "@apollo/client/core";
import { useMutation } from "@apollo/client/react";
import { 
  Card, CardContent, Typography, TextField, Button, Box, Alert, CircularProgress 
} from '@mui/material';


const DELETE_CAMERA_MUTATION = gql`
  mutation DeleteCamera($cameraId: String!) {
    deleteCamera(cameraId: $cameraId) {
      cameraId
      model
      location
    }
  }
`;

export default function DeleteCameraForm() {
  const [cameraId, setCameraId] = useState('');
  

  const [deleteCamera, { data, loading, error }] = useMutation(DELETE_CAMERA_MUTATION);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cameraId) {
        alert('Camera ID is required.');
        return;
    }
    
    deleteCamera({ variables: { cameraId } });
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="error">
          Delete Camera
        </Typography>
        
        {/* Success Alert */}
        {data && data.deleteCamera ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Camera {data.deleteCamera.cameraId} ({data.deleteCamera.model}) was successfully deleted.
          </Alert>
        ) : data && !data.deleteCamera ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Deletion failed: Camera ID not found.
          </Alert>
        ) : null}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error deleting camera: {error.message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            name="cameraId"
            label="Camera ID to Delete"
            variant="outlined"
            size="small"
            required
            value={cameraId}
            onChange={(e) => setCameraId(e.target.value)}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Deletion'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}