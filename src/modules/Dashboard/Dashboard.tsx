import Calendar from '@/src/components/Calendar/Calendar';
import { getDateFromToday } from '@/src/components/Calendar/helpers';
import CustomBreadcrumbs from '@/src/components/CustomBreadcrumbs/CustomBreadcrumbs';
import ErrorText from '@/src/components/ErrorText/ErrorText';
import LoaderOverlay from '@/src/components/LoaderOverlay/LoaderOverlay';
import { formatDate } from '@/src/helpers/formatDate';
import { useDispatch, useSelector } from '@/src/redux/store';
import { updateSyncStatus } from '@/src/slices/syncSlice/sync.slice';
import { Box, Button, Stack, Typography } from '@mui/material';
import { type Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useMasterData from '../../hooks/useMasterData/useMasterData.hooks';
import useTourData from '../../hooks/useTourData/useTourData.hooks';
import ServiceOrderTable from './components/ServiceOrderTable/ServiceOrderTable';
import useSyncData from '@/src/hooks/useSyncAPI/useSyncAPI';
import dayjs from 'dayjs';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';
import { type ITechnicianData } from '@/src/hooks/useTechnicianData/interface';
import useOrderWGAData from '@/src/hooks/useOrdersWGAData/useOrderWGAData';
import Iconify from '@/src/components/iconify/iconify';
import lightColorPalette from '@/src/hooks/useCustomTheme/colors/lightColorPalette';
import { showWarningMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import useNetworkStatus from '@/src/hooks/useNetworkStatus/useNetworkStatus';
import { updateTopBarSearchState } from '@/src/slices/topbarSearcSlice/topbarSearch.slice';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  // const { t } = useTranslation('index');
  // const { sync: syncState } = useSelector((state) => state.sync);
  // const dateToday = getDateFromToday(0);
  // const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs(syncState.selectedDate));
  // const technicianDataResponse = useTechnicianData();
  // const { updateIsSynchronizingStatus } = useOrderWGAData();
  // const topBarSearchValue = useSelector((state) => state.topBarSearch.searchValue);
  // const [serviceOrderId, setServiceOrderId] = useState<string>('');
  // const { handleConnection, uploadResponse } = useSyncData();
  // const { checkOnlineStatus } = useNetworkStatus();

  // const masterRes = useMasterData();
  // const tourRes = useTourData(
  //   serviceOrderId,
  //   formatDate(selectedDate),
  //   syncState.status === 'initial' || syncState.status === 'downloading',
  //   technicianDataResponse.data as ITechnicianData
  // );

  // const navigate = useNavigate();
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (topBarSearchValue !== '') {
  //     dispatch(updateSyncStatus({ status: 'initial' }));
  //     setServiceOrderId(topBarSearchValue);
  //   }
  // }, [topBarSearchValue]);

  // useEffect(() => {
  //   if (tourRes.data?.Message === 'NO_DATA_FOUND') {
  //     dispatch(showWarningMessage(t(tourRes.data.Message)));
  //   }
  // }, [tourRes.data?.Message]);

  // const handleDateChange = async (date: Dayjs) => {
  //   const isOnline = await checkOnlineStatus();
  //   if (!isOnline) {
  //     dispatch(showWarningMessage(t('APP_IS_OFFLINE')));
  //     return;
  //   }
  //   dispatch(updateSyncStatus({ selectedDate: formatDate(date) }));
  //   setSelectedDate(date);
  //   handleConnection();
  // };

  // const navigateToESO = () => {
  //   navigate('/sam/dashboard/eso');
  // };

  // const buttonESO = (
  //   <Button variant="outlined" color="primary" onClick={navigateToESO}>
  //     ESO
  //   </Button>
  // );

  // useEffect(() => {
  //   if (uploadResponse.isSuccess) {
  //     updateIsSynchronizingStatus();
  //   }
  // }, [uploadResponse.isSuccess]);

  // useEffect(() => {
  //   if (tourRes.isError) {
  //     dispatch(updateSyncStatus({ loading: false, status: 'downloading' }));
  //   }
  // }, [tourRes.isError, tourRes.dataUpdatedAt]);

  // useEffect(() => {
  //   if (syncState.status === 'downloading' || topBarSearchValue !== '') {
  //     dispatch(updateSyncStatus({ loading: false, status: 'downloaded' }));
  //   }
  // }, [tourRes.isSuccess, tourRes.dataUpdatedAt]);

  // // useEffect(() => {
  // //   router.prefetch('/sam/dashboard/eso');
  // //   router.prefetch('/sam/dashboard/service-order');
  // // }, []);

  // if ((masterRes.isLoading || tourRes.isLoading) && syncState.status === 'initial') {
  //   return <LoaderOverlay />;
  // }

  // if (tourRes.isError || masterRes.isError) {
  //   return <ErrorText>{t('DATA_FETCH_ERROR')}</ErrorText>;
  // }

  // const onClearTopBarSearchValue = () => {
  //   dispatch(updateTopBarSearchState(''));
  //   setServiceOrderId('');
  //   handleDateChange(dayjs(syncState.selectedDate));
  // };

  return (
    // <>
    //   <CustomBreadcrumbs
    //     heading={t('WELCOME_TO_SAM_DASHBOARD')}
    //     links={[{ name: t('DASHBOARD') }]}
    //     buttons={buttonESO}
    //   />
    //   {topBarSearchValue === '' && (
    //     <Calendar
    //       maxSelectableDate={dateToday}
    //       dateToday={dateToday}
    //       selectedDate={selectedDate}
    //       onDateChange={handleDateChange}
    //     />
    //   )}
    //   {topBarSearchValue && (
    //     <Stack
    //       direction="row"
    //       spacing={2}
    //       sx={{
    //         justifyContent: 'flex-start',
    //         alignItems: 'center',
    //         mb: 2,
    //         mt: 2,
    //       }}
    //     >
    //       <Typography variant="h6">
    //         {t('SEARCH_RESULTS_FOR_SO')} {topBarSearchValue}
    //       </Typography>
    //       <Iconify
    //         width={24}
    //         icon="charm:cross"
    //         sx={{
    //           color: lightColorPalette.error.main,
    //           '&:hover': { cursor: 'pointer' },
    //         }}
    //         onClick={onClearTopBarSearchValue}
    //       />
    //     </Stack>
    //   )}
    //   <ServiceOrderTable isFetchingTourData={!tourRes.isFetching} />
    // </>
    <Box>
      <Typography variant="h1">Hidsfslsdlksfld</Typography>{' '}
    </Box>
  );
};

export default Dashboard;
