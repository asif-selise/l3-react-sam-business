import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import { type IRsLineFilterFields } from '../../types';
import CustomBreadcrumbs from '@/src/components/CustomBreadcrumbs/CustomBreadcrumbs';
import RsLineFilter from './components/RsLineFilter/RsLineFilter';
import useSakRslineData from '@/src/hooks/useSakRslineData/useSakRslineData';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import StickyContainer from '@/src/components/StickyContainer/StickyContainer';
import RsLineListTable from './components/RsLineListTable/RsLineListTable';

const RsLine = () => {
  const { t } = useTranslation('index');
  const navigate = useNavigate();
  const [rsLineFilterFields, setRsLineFilterFields] = useState<IRsLineFilterFields | null>(null);

  const { data, isLoading } = useSakRslineData({
    Challenge: rsLineFilterFields?.Challenge ?? '',
    FromDate: rsLineFilterFields?.FromDate ?? '',
    ToDate: rsLineFilterFields?.ToDate ?? '',
    Remarks: rsLineFilterFields?.Remarks ?? '',
    DoneBy: rsLineFilterFields?.DoneBy ?? '',
    ProductGroupNo: rsLineFilterFields?.ProductGroupNo ?? null,
    OrderNo: rsLineFilterFields?.OrderNo ?? null,
    ManufacturerNo: rsLineFilterFields?.ManufacturerNo ?? null,
    RslineId: rsLineFilterFields?.RslineId ?? null,
  });

  const onFilter = async (queryValues: IRsLineFilterFields) => {
    setRsLineFilterFields({
      Challenge: queryValues?.Challenge ?? '',
      FromDate: queryValues?.FromDate ? dayjs(queryValues.FromDate).format('YYYY-MM-DD') : '',
      ToDate: queryValues?.ToDate ? dayjs(queryValues.ToDate).format('YYYY-MM-DD') : '',
      Remarks: queryValues?.Remarks ?? '',
      DoneBy: queryValues?.DoneBy ?? '',
      ProductGroupNo: queryValues?.ProductGroupNo ?? null,
      OrderNo: queryValues?.OrderNo ?? null,
      ManufacturerNo: queryValues?.ManufacturerNo ?? null,
      RslineId: queryValues?.RslineId ?? null,
    });
  };

  const navigateBack = () => {
    navigate('/sam/sak-7000');
  };

  return (
    <>
      <StickyContainer>
        <CustomBreadcrumbs
          heading={t('RS_LINE')}
          backButton={{
            action: navigateBack,
          }}
          links={[{ name: t('SAK_7000'), href: '/sam/sak-7000' }, { name: t('RS_LINE') }]}
        />
      </StickyContainer>
      <RsLineFilter onFilter={onFilter} />
      <RsLineListTable data={data ?? []} isLoading={isLoading} />
    </>
  );
};

export default RsLine;
