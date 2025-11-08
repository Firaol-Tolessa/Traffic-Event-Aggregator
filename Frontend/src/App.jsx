import React from "react";
import Aggregates from "./components/Aggregates";
import VehicleByPlate from "./components/VehicleByPlate";
import CameraById from "./components/CameraById";
import EventList from "./components/EventList";

// MUI Components
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Grid,
} from "@mui/material";
import TrafficIcon from "@mui/icons-material/Traffic";

function App() {
  return (
    <>
      {/* Resets browser CSS */}
      <CssBaseline />
      
      {/* Header Bar */}
      <AppBar position="static">
        <Toolbar>
          <TrafficIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Traffic Event Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }} >
        <Box>
          <Grid container spacing={3} justifyContent="center">
            
            {/* 1. Aggregates Section */}
            <Grid item xs={12}>
              <Aggregates />
              <Grid item xs={12} md={6}>
              <VehicleByPlate />
            </Grid>
            <Grid item xs={12} md={6}>
              <CameraById />
            </Grid>
            </Grid>

            {/* 2. Search Section */}
            

            {/* 3. Event List Section */}
            <Grid item xs={12}>
              <EventList />
            </Grid>
=
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default App;