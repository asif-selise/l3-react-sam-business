import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import QRCodeHistory from './QRCodeHistory/QRCodeHistory';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import FilterQRCode from './FilterQRCode/FilterQRCode';
import Iconify from '@/src/components/iconify/iconify';
import useQrCodeSearch from '@/src/hooks/useQrCodeSearch/useQrCodeSearch';
import { type QrFilterParams } from '@/src/hooks/useQrCodeSearch/types';
import {
  type ServiceOrderDetail,
  type QrCodeDetail,
} from '@/src/hooks/useTourData/tourData.interface';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type TableData } from '@/src/components/CustomTable/types';
import { getNonEmptyValueOrNull } from '@/src/helpers/sanitizeData';
import { useSelector } from '@/src/redux/store';

const intialFilterData: QrFilterParams = {
  TopRecordNumber: 50,
  IsInactive: null,
  ObjectId: null,
  ApartmentId: null,
  SerialNumber: null,
  Filter: null,
};

const SearchQRCode = () => {
  const { t } = useTranslation('index');
  const soId = useSelector((state) => state.serviceOrder.id);

  const searchQRCodeRef = useRef<HTMLInputElement>(null);

  const [online, setOnline] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filterData, setFilterData] = useState<QrFilterParams>(intialFilterData);

  const { dataItem: soData, getDataItem: getSoData } = useIndexedDbData<ServiceOrderDetail>(
    'TourPlanData',
    'ServiceOrderDetails'
  );

  const {
    filteredDataList: qrCodeDetailsOffline,
    getFilteredDataList: getQrCodeDetailsOffline,
    isLoading: isLoadingQrCodeDetailsOffline,
  } = useIndexedDbData<QrCodeDetail>('TourPlanData', 'QrCodeDetails');

  const {
    data: qrCodeDetailsOnline,
    isLoading: isLoadingQrCodeDetailsOnline,
    refetch: refetchQrCodeDetailsOnline,
  } = useQrCodeSearch(filterData);

  useEffect(() => {
    if (soId) {
      getSoData('OrderId', soId);
    }
  }, [soId]);

  useEffect(() => {
    if (soData?.Object) {
      setFilterData({ ...filterData, ObjectId: soData.Object });

      if (!online) {
        getQrCodeDetailsOffline('ObjectID', soData.Object);
      }
    }
  }, [online, soData?.Object]);

  useEffect(() => {
    if (online) {
      refetchQrCodeDetailsOnline();
    }
  }, [online, filterData]);

  const handleApplyFilter = (newFilterData: QrFilterParams) => {
    const searchQrField = getNonEmptyValueOrNull(searchQRCodeRef.current?.value);

    const updatedFilterData: QrFilterParams = { ...newFilterData, Filter: searchQrField };

    setFilterData(updatedFilterData);
    setAnchorEl(null);
  };

  const handleClearFilter = () => {
    setFilterData({ ...intialFilterData, ObjectId: soData?.Object });

    if (searchQRCodeRef.current) {
      searchQRCodeRef.current.value = '';
    }
  };

  const getQrCodeDetails = (): TableData[] => {
    if (online) {
      return (qrCodeDetailsOnline as unknown as TableData[]) ?? [];
    }
    return (qrCodeDetailsOffline as unknown as TableData[]) ?? [];
  };

  const getLoadingState = (): boolean => {
    if (online) {
      return isLoadingQrCodeDetailsOnline;
    }
    return isLoadingQrCodeDetailsOffline;
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={online}
              onChange={(e) => {
                setOnline(e.target.checked);
              }}
              sx={{ py: 0 }}
            />
          }
          label={<Typography sx={{ mt: 0.5 }}>{t('ONLINE')}</Typography>}
        />
        <TextField
          inputRef={searchQRCodeRef}
          placeholder={t('SEARCH_QR_CODE')}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'material-symbols:search'} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
          }}
          variant="contained"
          color="primary"
          sx={{ height: 'auto', minWidth: 'auto', whiteSpace: 'nowrap' }}
          endIcon={
            <Iconify
              icon={'material-symbols:arrow-drop-down-rounded'}
              sx={{ width: '24px', height: '24px' }}
            />
          }
        >
          {t('FILTER')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ height: 'auto', minWidth: 'auto', whiteSpace: 'nowrap' }}
          onClick={handleClearFilter}
        >
          {t('CLEAR')}
        </Button>
      </Box>

      <Box
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2),0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
        }}
      >
        <Typography variant="h6" color={'text.primary'} p={'24px'}>
          {t('QR_CODE_HISTORY')}
        </Typography>
        <QRCodeHistory
          online={online}
          data={getQrCodeDetails()}
          isLoading={getLoadingState()}
          qrFilters={filterData}
        />
      </Box>

      {anchorEl && (
        <FilterQRCode
          anchorEl={anchorEl}
          onClose={() => {
            setAnchorEl(null);
          }}
          onApply={handleApplyFilter}
          filterData={filterData}
        />
      )}
    </>
  );
};

export default SearchQRCode;
