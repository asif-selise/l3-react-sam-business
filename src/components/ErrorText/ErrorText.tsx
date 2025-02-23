import { Box, Typography } from '@mui/material';
import { type ReactNode } from 'react';

const ErrorText = ({ children }: { children: ReactNode }) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Typography color="error.main" variant="body1">
        {children}
      </Typography>
    </Box>
  );
};

export default ErrorText;
