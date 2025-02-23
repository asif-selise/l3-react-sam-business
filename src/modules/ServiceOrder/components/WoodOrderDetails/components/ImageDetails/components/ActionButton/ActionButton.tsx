import Iconify, { type IconifyProps } from '@/src/components/iconify/iconify';
import lightColorPalette from '@/src/hooks/useCustomTheme/colors/lightColorPalette';
import { useSelector } from '@/src/redux/store';
import { Box, type SxProps, Typography } from '@mui/material';
import React from 'react';

interface Props {
  label: string;
  onClick: () => void;
  icon: IconifyProps;
  disabled?: boolean;
}

const ActionButton = ({ label, onClick, icon, disabled = false }: Props) => {
  const isSoReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');

  const stylesActive: SxProps = {
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.3s',
    '&:hover': {
      backgroundColor: `rgba(145, 158, 171, 0.18)`,
      transform: 'scale(1.02)',
    },
  };

  return (
    <Box
      sx={{
        padding: '20px',
        backgroundColor: `rgba(145, 158, 171, 0.08)`,
        borderRadius: '12px',
        border: '1px dashed rgba(145, 158, 171, 0.48)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        ...(isSoReadOnly || disabled ? {} : stylesActive),
      }}
      aria-hidden="true"
      onClick={isSoReadOnly || disabled ? undefined : onClick}
    >
      <Iconify
        icon={icon}
        sx={{ width: '80px', height: '80px', color: lightColorPalette.text.disabled }}
      />
      <Typography variant="body2" sx={{ color: lightColorPalette.text.disabled }}>
        {label}
      </Typography>
    </Box>
  );
};

export default ActionButton;
