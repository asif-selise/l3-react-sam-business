import React from 'react';
import { Typography, Card, Box } from '@mui/material';

interface Props {
  icon: string;
  title: string;
  onClick: () => void;
}

const ActionCard = ({ icon, title, onClick }: Props) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        width: '100%',
        height: '100%',
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        cursor: 'pointer',
      }}
      aria-label={title}
    >
      <Box component="img" src={icon} alt={title} sx={{ width: 24, height: 24 }} />
      <Typography variant="body2">{title}</Typography>
    </Card>
  );
};

export default ActionCard;
