import React, { useState } from "react";
import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client/react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";

const GET_CAMERA_BY_ID = gql`
  query getCameraById($cameraId: String!) {
    getCameraById(cameraId: $cameraId) {
      cameraId
      model
      location
      events {
        id
        vehiclePlate
        vehicleType
        speed
        timestamp
      }
    }
  }
`;

export default function CameraById() {
  const [id, setId] = useState("");
  const [inputId, setInputId] = useState("");

  const { loading, error, data } = useQuery(GET_CAMERA_BY_ID, {
    variables: { cameraId: id },
    skip: !id,
  });

  const handleSearch = () => {
    setId(inputId); // Trigger the query
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Search Camera by ID
        </Typography>
        <Box sx={{ display: "flex", mb: 2 }}>
          <TextField
            label="Enter camera ID"
            variant="outlined"
            size="small"
            fullWidth
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ ml: 1 }}
            disabled={loading}
          >
            Search
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {error && <Alert severity="error">Error: {error.message}</Alert>}
        
        {data && data.getCameraById && (
          <Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>{data.getCameraById.model}</strong> ({data.getCameraById.location})
            </Typography>
            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
              {data.getCameraById.events.map((e) => (
                <ListItem key={e.id} divider>
                  <ListItemText
                    primary={`${e.vehiclePlate} - ${e.vehicleType} (${e.speed} km/h)`}
                    secondary={new Date(Number(e.timestamp)).toLocaleString()}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}