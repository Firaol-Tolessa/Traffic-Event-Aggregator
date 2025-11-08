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

const GET_VEHICLE_BY_PLATE = gql`
  query getVehicle($vehiclePlate: String!) {
    getVehicle(vehiclePlate: $vehiclePlate) {
      id
      vehiclePlate
      vehicleType
      speed
      timestamp
      camera {
        model
        location
      }
    }
  }
`;

export default function VehicleByPlate() {
  const [plate, setPlate] = useState("");
  const [inputPlate, setInputPlate] = useState("");

  const { loading, error, data } = useQuery(GET_VEHICLE_BY_PLATE, {
    variables: { vehiclePlate: plate },
    skip: !plate, // don't fetch until 'plate' is set
  });

  const handleSearch = () => {
    setPlate(inputPlate); // Trigger the query
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Search Vehicle by Plate
        </Typography>
        <Box sx={{ display: "flex", mb: 2 }}>
          <TextField
            label="Enter vehicle plate"
            variant="outlined"
            size="small"
            fullWidth
            value={inputPlate}
            onChange={(e) => setInputPlate(e.target.value)}
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
        
        {data && (
          <List dense>
            {data.getVehicle.length === 0 && (
              <Typography>No vehicle found with that plate.</Typography>
            )}
            {data.getVehicle.map((v) => (
              <ListItem key={v.id} divider>
                <ListItemText
                  primary={`${v.vehiclePlate} - ${v.vehicleType} (${v.speed} km/h)`}
                  secondary={`At: ${new Date(Number(v.timestamp)).toLocaleString()} | Camera: ${v.camera.model} (${v.camera.location})`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}