import { Button, Dialog, DialogContent, DialogTitle, type SxProps } from '@mui/material';
import { type ReactNode } from 'react';
import Scrollbar from '../Scrollbar/Scrollbar';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  buttonTopRight?: {
    label: string;
    disabled?: boolean;
    action: () => void;
    variant?: 'contained' | 'outlined' | 'text';
  };
  actions?: ReactNode;
  variant?: 'sm' | 'md';
  sx?: SxProps;
  sxPaper?: SxProps;
  hideBackdrop?: boolean;
}

const CustomModal = ({
  open,
  onClose,
  title,
  children,
  buttonTopRight,
  actions,
  variant = 'md',
  sx,
  sxPaper,
  hideBackdrop = false,
}: CustomModalProps) => {
  return (
    <Dialog
      aria-label="custom-modal"
      open={open}
      PaperProps={{
        sx: {
          width: variant === 'sm' ? '36vw' : '92vw',
          maxWidth: variant === 'sm' ? '700px' : '1200px',
          height: variant === 'sm' ? 'auto' : '96vh',
          borderRadius: 2,
          pb: 1,
          ...sxPaper,
        },
      }}
      sx={sx}
      hideBackdrop={hideBackdrop}
    >
      <DialogTitle
        variant="h6"
        sx={{
          p: 1.5,
          px: 3,
          boxShadow: '0px 4px 8px 0px #919eab28',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {title}

        {buttonTopRight && (
          <Button
            variant={buttonTopRight.variant ?? 'text'}
            color="primary"
            disabled={buttonTopRight.disabled === true}
            onClick={buttonTopRight.action}
          >
            {buttonTopRight.label}
          </Button>
        )}
      </DialogTitle>

      <Scrollbar>
        <DialogContent sx={{ pt: '24px !important', pb: '24px !important' }}>
          {children}
        </DialogContent>
      </Scrollbar>

      {actions}
    </Dialog>
  );
};

export default CustomModal;
