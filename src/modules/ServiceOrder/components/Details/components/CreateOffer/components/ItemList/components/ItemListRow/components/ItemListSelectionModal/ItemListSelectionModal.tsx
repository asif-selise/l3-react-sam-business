import Scrollbar from '@/src/components/Scrollbar/Scrollbar';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
  onSave: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

const ItemListSelectionModal = ({ isOpen, onSave, onClose, children }: Props) => {
  const { t } = useTranslation('index');

  return (
    <Dialog
      open={isOpen}
      PaperProps={{
        sx: {
          pb: 1,
          width: '60vw',
          height: '56vh',
          borderRadius: 2,
          maxWidth: '700px',
        },
      }}
      hideBackdrop={false}
    >
      <DialogTitle
        variant="h6"
        sx={{
          p: 1.5,
          px: 2,
        }}
      >
        {t('SELECTION_ITEMS')}
      </DialogTitle>

      <Scrollbar>
        <DialogContent sx={{ padding: 0 }}>{children}</DialogContent>
      </Scrollbar>

      <DialogActions
        sx={{
          pt: 1.5,
          pb: 0.4,
          gap: 1.5,
        }}
      >
        <Button variant={'contained'} color="primary" onClick={onSave}>
          {t('SAVE')}
        </Button>
        <Button variant={'outlined'} color="primary" onClick={onClose}>
          {t('DISCARD')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemListSelectionModal;
