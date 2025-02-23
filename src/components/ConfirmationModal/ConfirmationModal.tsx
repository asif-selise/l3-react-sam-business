import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { type ReactNode } from 'react';

type ButtonVariants = 'contained' | 'outlined' | 'text' | 'soft';
type ButtonColors = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';

interface Props {
  open: boolean;
  title?: string;
  details: ReactNode | string;
  discardButton: {
    title: string;
    variant?: ButtonVariants;
    color?: ButtonColors;
    action: () => void;
  };
  primaryActionButton?: {
    title: string;
    variant?: ButtonVariants;
    color?: ButtonColors;
    actionId: string | number;
    action: (id: string | number) => void;
  };
  secondaryActionButton?: {
    title: string;
    variant?: ButtonVariants;
    color?: ButtonColors;
    actionId: string | number;
    action: (id: string | number) => void;
  };
  variant?: 'sm' | 'md';
}

const ConfirmationModal = ({
  open,
  title,
  primaryActionButton,
  secondaryActionButton,
  discardButton,
  details,
  variant = 'md',
}: Props) => {
  const handlePrimaryAction = () => {
    primaryActionButton?.action(primaryActionButton.actionId);
  };
  const handleSecondaryAction = () => {
    secondaryActionButton?.action(secondaryActionButton.actionId);
  };
  const handleDiscardAction = () => {
    discardButton.action();
  };

  const handleClose = (event: React.MouseEvent | React.KeyboardEvent, reason: string) => {
    if (reason === 'backdropClick') {
      return;
    }
    discardButton.action();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': { maxWidth: variant === 'md' ? '92vw' : '40vw', minWidth: '500px' },
      }}
    >
      {title && (
        <Box style={{ minHeight: '120px', display: 'flex', alignItems: 'center' }}>
          <DialogTitle>{title}</DialogTitle>
        </Box>
      )}
      <DialogContent>
        <DialogContentText sx={{ whiteSpace: 'pre-line' }}>{details}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDiscardAction}
          variant={discardButton.variant ?? 'outlined'}
          color={discardButton?.color ?? 'primary'}
        >
          {discardButton?.title}
        </Button>

        {secondaryActionButton && (
          <Button
            onClick={handleSecondaryAction}
            variant={secondaryActionButton.variant ?? 'soft'}
            color={secondaryActionButton?.color ?? 'primary'}
          >
            {secondaryActionButton.title}
          </Button>
        )}

        {primaryActionButton && (
          <Button
            onClick={handlePrimaryAction}
            variant={primaryActionButton.variant ?? 'contained'}
            color={primaryActionButton?.color ?? 'primary'}
          >
            {primaryActionButton?.title}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
