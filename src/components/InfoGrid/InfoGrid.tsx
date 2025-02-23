import { sanitizeData } from '@/src/helpers/sanitizeData';
import { Box, type SxProps, Typography, Button, TextField } from '@mui/material';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  label: string;
  value: string | number | boolean;
  info?: ReactNode;
  sx?: SxProps;
  button?: {
    label: string;
    action: () => void;
  };
  isEditMode?: boolean;
  onChange?: (value: string) => void;
}

const InfoGrid = ({ label, value, info, sx, button, isEditMode = false, onChange }: Props) => {
  const { t } = useTranslation('index');

  return (
    <Box display={'flex'} flexDirection={'row'} columnGap={'16px'} sx={{ ...sx }}>
      <Typography variant="subtitle2" width={'30%'} maxWidth={'240px'}>
        {t(label)}
      </Typography>
      <Box width={'70%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isEditMode ? (
            <TextField
              value={value ?? null}
              size="small"
              onChange={(e) => onChange?.(e.target.value)}
            />
          ) : (
            <Typography variant="body2">{sanitizeData(value)}</Typography>
          )}

          {info && <>{info}</>}
        </Box>

        {button && (
          <Button size="small" variant="text" color="primary" onClick={button.action}>
            {t(button.label)}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default InfoGrid;
