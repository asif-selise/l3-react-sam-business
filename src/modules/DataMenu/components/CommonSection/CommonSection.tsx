import { Box, Grid } from '@mui/material';
import React from 'react';
import ActionCard from '@/src/components/ActionCard/ActionCard';
import SectionHeader from '../SectionHeader/SectionHeader';
import { type ActionCardDetail } from '@/src/components/ActionCard/types';

interface Props {
  header: {
    title: string;
  };
  actionCards: ActionCardDetail[];
}

const CommonSection = ({ header, actionCards }: Props) => {
  return (
    <Box mb={3}>
      <SectionHeader title={header.title} />

      <Grid container spacing={2} aria-label="action-cards">
        {actionCards.map((actionCard, index) => (
          <Grid item mobile={12} tablet={4} desktop={3} key={index}>
            <ActionCard
              icon={actionCard.icon}
              title={actionCard.title}
              onClick={actionCard.onClick}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CommonSection;
