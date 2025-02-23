import { Box, Typography } from '@mui/material';
import React from 'react';

interface Props {
  totalDistance: string;
  totalDuration: string;
}

const MapDirectionInfo = ({ totalDistance, totalDuration }: Props) => {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        padding: '8px 16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }}
    >
      <Typography variant="subtitle1">
        {totalDistance} ({totalDuration})
      </Typography>
    </Box>
  );
};

export default MapDirectionInfo;
