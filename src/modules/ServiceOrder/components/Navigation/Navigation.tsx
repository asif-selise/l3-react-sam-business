import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type ServiceOrderDetail } from '@/src/hooks/useTourData/tourData.interface';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import Map from './components/Map/Map';
import MapEmbed from './components/MapEmbed/MapEmbed';

const Navigation = () => {
  const id = useSelector((state: any) => state.serviceOrder.id);

  const [destination, setDestination] = useState<string>('');

  const { dataItem: customerDetailsData, getDataItem: getCustomerDetailsData } =
    useIndexedDbData<ServiceOrderDetail>('TourPlanData', 'ServiceOrderDetails');

  useEffect(() => {
    if (id) {
      getCustomerDetailsData('OrderId', Number(id));
    }
  }, [id]);

  useEffect(() => {
    if (customerDetailsData) {
      setDestination(customerDetailsData.GoogleFormattedAddress ?? '');
    }
  }, [customerDetailsData]);

  // return destination && <Map defaultDestination={destination} />;
  return destination && <MapEmbed destination={destination} />;
};

export default Navigation;
