import { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Checkbox,
  Snackbar,
  Button,
  CardHeader,
  CircularProgress,
  Box,
} from '@mui/material';

import Iconify from '@/src/components/iconify/iconify';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { useTranslation } from 'react-i18next';
import { getFileIcon } from '@/src/helpers/fileExtension';
import { useDispatch, useSelector } from 'react-redux';
import useSoFiles from '@/src/hooks/useSoFiles/useSoFiles';
import { type SoFile } from '@/src/hooks/useSoFiles/types';
import useDownloadSoFile from '@/src/hooks/useDownloadSoFile/useDownloadSoFile';
import { showErrorMessage, showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';

interface SelectedFile extends SoFile {
  Id: number;
}

const SODocuments = () => {
  const { t } = useTranslation('index');
  const id = useSelector((state: any) => state.serviceOrder.id);
  const dispatch = useDispatch();

  const { data: soFiles } = useSoFiles(Number(id));

  const [selectedSoFiles, setSelectedSoFiles] = useState<SelectedFile[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const { refetch: startDownload } = useDownloadSoFile(Number(id), selectedSoFiles);

  const handleSelectFile = (file: SoFile, index: number) => {
    const isSelected = selectedSoFiles.find((selectedSoFile) => selectedSoFile.Id === index);

    if (isSelected) {
      setSelectedSoFiles(selectedSoFiles.filter((selectedSoFile) => selectedSoFile.Id !== index));
    } else {
      setSelectedSoFiles([...selectedSoFiles, { ...file, Id: index }]);
    }
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    dispatch(showSuccessMessage('Download started'));

    try {
      const { data: successCount } = await startDownload();
      const totalCount = selectedSoFiles.length;

      dispatch(
        showSuccessMessage(`Successfully downloaded ${successCount} out of ${totalCount} files.`)
      );
    } catch (error) {
      dispatch(showErrorMessage('Download failed.'));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item mobile={12}>
          <Typography variant="body2" color={'text.disabled'}>
            {soFiles?.length ?? 0} {t('FILES')}
          </Typography>
        </Grid>

        {soFiles?.map((soFile, index) => (
          <Grid item mobile={12} tablet={6} desktop={3} key={index}>
            <Card
              sx={{
                height: '100%',
                border: `1px solid rgba(145, 158, 171, 0.24)`,
                boxShadow: `0px 20px 40px -4px rgba(145, 158, 171, 0.16)`,
              }}
            >
              <CardHeader
                action={
                  <Checkbox
                    onChange={() => {
                      handleSelectFile(soFile, index);
                    }}
                  />
                }
                sx={{ p: '20px 20px 0px' }}
              />

              <CardContent sx={{ p: '0px 20px 20px !important' }}>
                <Box
                  component="img"
                  src={getFileIcon(soFile.Name)}
                  alt="image icon"
                  sx={{ height: 41 }}
                />
                <OverflowTooltip text={soFile.Name} variant="subtitle2" />

                <Typography variant="caption" color={'text.disabled'}>
                  {soFile.SizeInMb} MB
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={selectedSoFiles.length > 0}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ width: 'fit-content', left: 'unset', bottom: '24px', right: '24px' }}
        message={
          <>
            <Iconify icon={'ep:circle-check-filled'} color={'primary.main'} />
            <Typography variant="subtitle2">
              {selectedSoFiles.length}{' '}
              {selectedSoFiles.length > 1 ? t('ITEMS_SELECTED') : t('ITEM_SELECTED')}
            </Typography>
          </>
        }
        ContentProps={{
          sx: {
            bgcolor: 'text.primary',
            padding: '12px 16px',
            '& .MuiSnackbarContent-message': { display: 'flex', gap: 1 },
            '& .MuiSnackbarContent-action': { display: 'flex', gap: 1 },
          },
        }}
        action={
          <Button
            size="small"
            onClick={handleDownload}
            startIcon={
              isDownloading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Iconify icon={'material-symbols:download-sharp'} width={18} />
              )
            }
            sx={{
              color: 'text.primary',
              bgcolor: 'background.default',
              ':hover': { bgcolor: 'secondary.light' },
              mr: '8px',
            }}
            disabled={isDownloading}
          >
            {t('DOWNLOAD')}
          </Button>
        }
      />
    </>
  );
};

export default SODocuments;
