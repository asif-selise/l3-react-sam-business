import React from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  title: string;
}

const SectionHeader = ({ title }: Props) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, py: 1 }}>
      <Typography variant="h6" color={'text.secondary'}>
        {title}
      </Typography>
    </Box>
  );
};

export default SectionHeader;
