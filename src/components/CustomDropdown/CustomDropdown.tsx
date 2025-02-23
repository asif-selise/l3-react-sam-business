import { Box, Button, Popover, type SxProps, Typography } from '@mui/material';

interface Props {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  header?: {
    title: string;
    button?: {
      label: string;
      action: () => void;
      variant?: 'contained' | 'outlined' | 'text';
    };
  };
  children: React.ReactNode;
  sx?: SxProps;
  sxPaper?: SxProps;
}

const CustomDropdown = ({ anchorEl, onClose, header, children, sx, sxPaper }: Props) => {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 1, ...sx }}
      slotProps={{
        paper: {
          sx: {
            p: 2,
            width: '17vw',
            minWidth: 250,
            maxWidth: 350,
            ...sxPaper,
          },
        },
      }}
      aria-label="custom-dropdown"
    >
      {header && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle2"> {header.title} </Typography>
          {header.button && (
            <Button
              color="primary"
              onClick={header.button.action}
              variant={header.button.variant ?? 'text'}
            >
              {header.button.label}
            </Button>
          )}
        </Box>
      )}

      {children}
    </Popover>
  );
};

export default CustomDropdown;
