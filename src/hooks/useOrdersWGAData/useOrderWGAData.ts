import { useState } from 'react';
import { getData } from '@/indexedDb';
import { formatDate } from '@/src/helpers/formatDate';
import { type IOrdersWGAData } from '@/src/modules/DataMenu/components/OrderSection/components/OrdersWGA/components/OrdersWGATable/interfaces';
import { set } from 'idb-keyval';

const OrdersWGADataModel = {
  date: formatDate(new Date()),
  data: [],
};

const useOrderWGAData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initializeData = async () => {
    const currentData = await getData('OrdersWGAData');

    if (!currentData || currentData.date !== formatDate(new Date())) {
      await set('OrdersWGAData', JSON.stringify(OrdersWGADataModel));
      setIsLoading(false);
    }
  };

  const updateIsSynchronizingStatus = async () => {
    const currentData = await getData('OrdersWGAData');

    if (currentData?.data) {
      const updatedData = currentData.data.map((item: IOrdersWGAData) => ({
        ...item,
        IsSynchronizing: true,
      }));

      await set('OrdersWGAData', JSON.stringify({ ...currentData, data: updatedData }));
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    initializeData,
    updateIsSynchronizingStatus,
  };
};

export default useOrderWGAData;
