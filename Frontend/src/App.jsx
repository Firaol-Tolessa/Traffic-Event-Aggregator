import React from "react";
import Aggregates from "./components/Aggregates";
import VehicleByPlate from "./components/VehicleByPlate";
import CameraById from "./components/CameraById";
import EventList from "./components/EventList";
import AddCameraForm from "./components/AddCamera";
import DeleteCameraForm from "./components/DeleteCamera"
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
          <Grid container spacing={5} justifyContent="center">
            <Grid item xs={12}>
              <Aggregates />
              <Grid item xs={12} md={6}>
                <AddCameraForm />
              </Grid>
              <Grid item xs={12} md={6}>
                <DeleteCameraForm />
              </Grid>
            </Grid>
            
             <Grid item xs={12} md={6}>
                <VehicleByPlate />
              </Grid>
             
              <Grid item xs={12} md={6}>
                <CameraById />
              </Grid>
            <Grid item xs={12}>
              <EventList />
            </Grid>
            
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default App;