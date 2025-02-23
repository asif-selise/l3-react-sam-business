import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { Box, Button } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface SelectOptionItem {
  onClick: () => void;
  label: string;
}

interface Props {
  title: string;
  options: SelectOptionItem[];
  onClose: () => void;
}

const SelectOption = ({ title, options, onClose }: Props) => {
  const { t } = useTranslation('index');

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: onClose,
          variant: 'outlined',
        },
      ]}
    />
  );

  return (
    <CustomModal open onClose={onClose} title={title} actions={modalActions} variant="sm">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {options.map((option, index) => (
          <Button
            key={index}
            variant="contained"
            color="primary"
            onClick={option.onClick}
            sx={{ width: '100%' }}
            size="large"
          >
            {option.label}
          </Button>
        ))}
      </Box>
    </CustomModal>
  );
};

export default SelectOption;
