import React, { useState } from "react";
import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client/react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Grid,
} from "@mui/material";

const GET_EVENTS = gql`
  query getEvents($first: Int!, $after: String) {
    getVehicles(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          vehiclePlate
          vehicleType
          speed
          timestamp
          camera {
            cameraId
            model
            location
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export default function EventList() {
  const [loadingMore, setLoadingMore] = useState(false);
  const { loading, error, data, fetchMore } = useQuery(GET_EVENTS, {
    variables: { first: 3, after: null },
  });

  const handleLoadMore = () => {
    setLoadingMore(true);
    const endCursor = data.getVehicles.pageInfo.endCursor;

    fetchMore({
      variables: { first: 3, after: endCursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          getVehicles: {
            __typename: prev.getVehicles.__typename,
            edges: [
              ...prev.getVehicles.edges,
              ...fetchMoreResult.getVehicles.edges,
            ],
            pageInfo: fetchMoreResult.getVehicles.pageInfo,
          },
        };
      },
    }).finally(() => setLoadingMore(false));
  };

  if (loading && !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">Error loading events: {error.message}</Alert>;
  }

  const events = data?.getVehicles.edges || [];
  const pageInfo = data?.getVehicles.pageInfo;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          All Vehicle Events
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          {events.map(({ node }) => (
            <Paper variant="outlined" key={node.id} sx={{ p: 2 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6">{node.vehiclePlate}</Typography>
                  <Typography variant="body2" color="text.secondary">{node.vehicleType}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography><strong>Speed:</strong> {node.speed} km/h</Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Camera:</strong> {node.camera.model} ({node.camera.location})
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(Number(node.timestamp)).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>

        {pageInfo?.hasNextPage && (
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? <CircularProgress size={24} /> : "Load More"}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}