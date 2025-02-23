import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import connectionOff from '../../../../../../public/assets/icons/connectionOff.svg';
import connectionSuccess from '../../../../../../public/assets/icons/connectionSuccess.svg';
import { getFormattedCurrentTime } from '@/src/components/NavigationBar/Topbar/components/ConnectionPopover/utils/formatDate';
import { useEffect, useState } from 'react';
import useNetworkStatus from '@/src/hooks/useNetworkStatus/useNetworkStatus';
import { showWarningMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { useDispatch, useSelector } from '@/src/redux/store';
import useSyncData from '@/src/hooks/useSyncAPI/useSyncAPI';
import useOrderWGAData from '@/src/hooks/useOrdersWGAData/useOrderWGAData';

const ConnectionPopover = () => {
  const { t } = useTranslation('index');
  const { sync: syncStatus } = useSelector((state: any) => state.sync);
  const [lastSyncTime, setLastSyncTime] = useState(getFormattedCurrentTime(new Date()));
  const { handleConnection, uploadResponse } = useSyncData();
  const { sync: syncState } = useSelector((state: any) => state.sync);
  const { updateIsSynchronizingStatus } = useOrderWGAData();
  const { checkOnlineStatus } = useNetworkStatus();
  const dispatch = useDispatch();

  useEffect(() => {
    if (syncState.status === 'uploading') {
      setLastSyncTime(getFormattedCurrentTime(new Date()));
    }
  }, [syncState.status]);

  useEffect(() => {
    if (uploadResponse.isSuccess) {
      updateIsSynchronizingStatus();
    }
  }, [uploadResponse.isSuccess]);

  const executeSync = async () => {
    const isOnline = await checkOnlineStatus();
    if (!isOnline) {
      dispatch(showWarningMessage(t('APP_IS_OFFLINE')));
      return;
    }
    handleConnection();
  };

  const renderSyncComponents = () => (
    <>
      <Button
        variant="text"
        size="medium"
        color="primary"
        onClick={executeSync}
        disabled={!syncState.online}
        sx={{ padding: '0px !important' }}
      >
        {t('index:SYNCHRONIZE')}
      </Button>
      <Typography
        variant="caption"
        color="text.primary"
        sx={{ lineHeight: '10px', fontSize: '10px' }}
      >
        {t('index:LAST_SYNC_AT')}
      </Typography>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ lineHeight: '12px', fontSize: '12px' }}
        data-testid="ConnectionPopover_LastSyncTimeLabel"
      >
        {lastSyncTime} {t('index:HOURS')}
      </Typography>
    </>
  );

  const renderConnectionStatus = () => {
    if (!syncStatus.loading) {
      return renderSyncComponents();
    } else {
      return (
        <Typography
          variant="subtitle2"
          color="primary.main"
          data-testid="ConnectionPopover_ConnectingLabel"
        >
          {t('index:CONNECTING')}
        </Typography>
      );
    }
  };

  if (syncStatus.loading) {
    return <></>;
  }

  return (
    <>
      <Box display={'flex'} flexDirection={'column'} alignItems={'flex-end'}>
        {renderConnectionStatus()}
      </Box>

      {!syncStatus.loading ? (
        <Box
          sx={{
            width: 24,
            height: 24,
            backgroundImage: `url(${!syncState.online ? connectionOff : connectionSuccess})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginLeft: '16px',
            marginRight: '16px',
          }}
          data-testid="ConnectionPopover_ConnectionStatusImage"
        />
      ) : (
        <CircularProgress
          size={21}
          color="primary"
          sx={{ marginLeft: '16px', marginRight: '16px' }}
          data-testid="ConnectionPopover_ConnectingCircularProgressBar"
        />
      )}
    </>
  );
};

export default ConnectionPopover;
