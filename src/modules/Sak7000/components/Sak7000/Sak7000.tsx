import { useState } from 'react';

import Sak7000Filter from './components/Sak7000Filter/Sak7000Filter';
import Sak7000ListTable from './components/Sak7000ListTable/Sak7000ListTable';
import { type ISak7000FilterFields } from '../../types';
import useSak7000Data from '@/src/hooks/useSak7000Data/useSak7000Data';

const Sak7000 = () => {
  const [sak7000FilterFields, setSak7000FilterFields] = useState<ISak7000FilterFields | null>(null);

  const { data, isLoading } = useSak7000Data({
    TopRecordNumber: sak7000FilterFields?.TopRecordNumber ?? '',
    RsLine: sak7000FilterFields?.RsLine ?? false,
    Avor: sak7000FilterFields?.Avor ?? false,
    SearchMode: sak7000FilterFields?.SearchMode ?? '',
    Filter: sak7000FilterFields?.Filter ?? '',
  });

  const onFilter = async (queryValues: ISak7000FilterFields) => {
    setSak7000FilterFields({
      TopRecordNumber: queryValues?.TopRecordNumber ?? '',
      RsLine: queryValues?.RsLine ?? false,
      Avor: queryValues?.Avor ?? false,
      SearchMode: queryValues?.SearchMode ?? '',
      Filter: queryValues?.Filter ?? '',
    });
  };

  return (
    <>
      <Sak7000Filter onFilter={onFilter} />
      <Sak7000ListTable data={data ?? []} isLoading={isLoading} />
    </>
  );
};

export default Sak7000;
