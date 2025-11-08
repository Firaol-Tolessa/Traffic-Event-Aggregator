import React from "react";
import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client/react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Alert
} from "@mui/material";
import SpeedIcon from '@mui/icons-material/Speed';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

// The GQL query for the aggregates
const GET_AGGREGATES = gql`
  query GetAggregates {
    getAggregates {
      totalEvents
      avgSpeed
    }
  }
`;

// A small component for each stat card
function StatCard({ title, value, icon, unit = "" }) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
      <Box sx={{ mr: 2 }}>
        {icon}
      </Box>
      <Box>
        <Typography color="text.secondary">{title}</Typography>
        <Typography variant="h5" component="div">
          {value} {unit}
        </Typography>
      </Box>
    </Card>
  );
}

export default function Aggregates() {
  const { loading, error, data } = useQuery(GET_AGGREGATES);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">Error fetching aggregates: {error.message}</Alert>;
  }

  const { totalEvents, avgSpeed } = data.getAggregates;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <StatCard
          title="Total Events"
          value={totalEvents.toLocaleString()}
          icon={<ConfirmationNumberIcon color="primary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <StatCard
          title="Average Speed"
          value={avgSpeed.toFixed(2)}
          unit="km/h"
          icon={<SpeedIcon color="secondary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </Grid>
  );
}