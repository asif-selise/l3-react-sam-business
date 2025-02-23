import { type TableData } from '@/src/components/CustomTable/types';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import CustomerHistoryTable from './components/CustomerHistoryTable/CustomerHistoryTable';
import { type ServiceOrderDetail } from '@/src/hooks/useTourData/tourData.interface';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type ProductGroup } from '@/src/hooks/useMasterData/masterData.interface';
import useGetCustomerHistory from '@/src/hooks/useGetCustomerHistory/useGetCustomerHistory';
import { type CustomerHistoryResponse } from '@/src/hooks/useGetCustomerHistory/types';
import { useSelector } from 'react-redux';

const CustomerHistory = () => {
  const { t } = useTranslation('index');
  const id = useSelector((state: any) => state.serviceOrder.id);
  const [street, setStreet] = useState<string>('');
  const [postCode, setPostCode] = useState<string>('');
  const [productGroupId, setProductGroupId] = useState<number>(0);
  const [isFilterDataUpdated, setIsFilterDataUpdated] = useState<boolean>(false);
  const [customerHistoryData, setCustomerHistoryData] = useState<CustomerHistoryResponse[]>([]);

  const { dataItem: soDetailsData, getDataItem: getSoDetails } =
    useIndexedDbData<ServiceOrderDetail>('TourPlanData', 'ServiceOrderDetails');

  const { dataList: productGroups, getDataList: getProductGroups } = useIndexedDbData<ProductGroup>(
    'MasterData',
    'ProductGroups'
  );

  const { data, isLoading, isSuccess, refetch } = useGetCustomerHistory(
    street,
    postCode,
    productGroupId
  );

  useEffect(() => {
    handleApplyFilter();
  }, [isFilterDataUpdated]);

  useEffect(() => {
    if (id) {
      getSoDetails('OrderId', Number(id));
    }
  }, [id]);

  useEffect(() => {
    if (soDetailsData) {
      setStreet(soDetailsData.CustomerStreet ?? '');
      setPostCode(String(soDetailsData.CustomerZipCityId ?? ''));
      setProductGroupId(soDetailsData.ProductGroup ?? 0);
      getProductGroups();
      setIsFilterDataUpdated(true);
    }
  }, [soDetailsData]);

  useEffect(() => {
    if (isSuccess && data) {
      setCustomerHistoryData(data);
    }
  }, [isSuccess]);

  const handleApplyFilter = () => {
    if (isFilterDataUpdated && street && postCode) {
      refetch();
    }
  };

  const handleClearFilter = () => {
    setStreet('');
    setPostCode('');
    setProductGroupId(0);
    setCustomerHistoryData([]);
  };

  const renderFilter = (
    <Box sx={{ display: 'flex', p: 2, gap: 3 }} aria-label="customer-history-filter">
      <TextField
        value={street}
        onChange={(e) => {
          setStreet(e.target.value);
        }}
        fullWidth
        size="small"
        label={t('CUSTOMER_STREET')}
        InputLabelProps={{ shrink: true }}
        sx={{ my: 2 }}
      />
      <TextField
        value={postCode}
        onChange={(e) => {
          setPostCode(e.target.value);
        }}
        fullWidth
        size="small"
        label={t('CUSTOMER_POSTCODE')}
        InputLabelProps={{ shrink: true }}
        sx={{ my: 2 }}
      />

      <TextField
        value={productGroupId ?? ''}
        onChange={(e) => {
          setProductGroupId(Number(e.target.value));
        }}
        select
        fullWidth
        label={t('PRODUCT_GROUP')}
        InputLabelProps={{ shrink: true }}
        SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 250 } } } }}
        size="small"
        sx={{ my: 2 }}
      >
        {productGroups?.map((productGroup, index) => (
          <MenuItem key={index} value={productGroup.Id}>
            {productGroup.Description}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="contained"
        color="primary"
        sx={{
          my: 2,
          width: '20%',
          minWidth: 'auto',
          whiteSpace: 'nowrap',
        }}
        onClick={handleApplyFilter}
      >
        {t('FILTER')}
      </Button>
      <Button
        variant="outlined"
        color="primary"
        sx={{
          my: 2,
          width: '20%',
          minWidth: 'auto',
          whiteSpace: 'nowrap',
        }}
        onClick={handleClearFilter}
      >
        {t('CLEAR')}
      </Button>
    </Box>
  );

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: 2,
        mt: 3,
        boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2),0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
      }}
      aria-label="customer-history"
    >
      {renderFilter}

      <CustomerHistoryTable
        data={customerHistoryData as unknown as TableData[]}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default CustomerHistory;
