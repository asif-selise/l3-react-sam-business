import React from 'react';
import { styled, ListItem as MuiListItem, Typography } from '@mui/material';
import { COMMON } from '@/src/hooks/useCustomTheme/colors/commonColorPalette';
import { type AutoText } from '@/src/hooks/useMasterData/masterData.interface';

interface CustomListItemProps {
  item: AutoText;
  isSelected: boolean;
  onClick: () => void;
}

const StyledListItem = styled(MuiListItem)<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  padding: '6px',
  cursor: 'pointer',
  backgroundColor: isSelected ? COMMON.grey[300] : 'transparent',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: !isSelected ? COMMON.grey[200] : '',
  },
}));

const CustomListItem: React.FC<CustomListItemProps> = ({ item, isSelected, onClick }) => {
  return (
    <StyledListItem isSelected={isSelected} onClick={onClick}>
      <Typography variant="body2" lineHeight={1.1}>
        {item.Name ?? '-'}
      </Typography>
    </StyledListItem>
  );
};

export default CustomListItem;
