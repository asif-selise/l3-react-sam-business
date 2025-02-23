import React, { type ReactNode } from 'react';
import { Box, Card, Typography } from '@mui/material';

interface Props {
  heading: string;
  subHeading: string;
  icon: ReactNode;
}
const ActionTile = ({ heading, subHeading, icon }: Props) => {
  return (
    <Card
      aria-label="Measurement"
      sx={{ width: '100%', display: 'flex', alignItems: 'center', p: '24px' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" color={'text.secondary'}>
          {subHeading}
        </Typography>
        <Typography variant="h4" color={'text.primary'}>
          {heading}
        </Typography>
      </Box>
      {icon}
    </Card>
  );
};

export default ActionTile;
