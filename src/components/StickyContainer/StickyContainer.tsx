import { type ReactNode } from 'react';
import { Box } from '@mui/material';

interface Props {
  children: ReactNode;
}

const StickyContainer = ({ children }: Props) => {
  return (
    <Box
      sx={{
        top: 0,
        paddingTop: 2,
        paddingBottom: 3,
        marginLeft: '-40px',
        paddingLeft: '40px',
        marginRight: '-48px',
        paddingRight: '48px',
        bgcolor: 'white',
        position: 'sticky',
        zIndex: 99,
      }}
    >
      {children}
    </Box>
  );
};

export default StickyContainer;
