import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  type IDataMenuSamOrdersRequestParams,
  ViewOrderModals,
  WAREHOUSE_LOCATION_ID,
} from '../../types';
import { type ModalDetails } from '@/src/components/CustomModal/types';
import ViewOrdersListTable from './components/ViewOrdersListTable/ViewOrdersListTable';
import ViewOrdersFilter from './components/ViewOrdersFilter/ViewOrdersFilter';
import useDataMenuSamOrders from '@/src/hooks/useDataMenuSamOrders/useDataMenuSamOrders';
import { type TableData } from '@/src/components/CustomTable/types';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';

interface Props {
  onClose: () => void;
}

const ViewOrders = ({ onClose }: Props) => {
  const { t } = useTranslation('index');
  const technicianDataResponse = useTechnicianData();
  const [technicianEmployeeNumber, setTechnicianEmployeeNumber] = useState<number | null>(null);
  const [samOrdersRequestParams, setSamOrdersRequestParams] =
    useState<IDataMenuSamOrdersRequestParams | null>(null);

  const { data, isLoading } = useDataMenuSamOrders({
    TechnicianEmployeeNumber: technicianEmployeeNumber,
    WarehouseLocationId: WAREHOUSE_LOCATION_ID,
    OrderId: samOrdersRequestParams?.OrderId ?? '',
    SamOrderId: samOrdersRequestParams?.SamOrderId ?? '',
    ManufacturerName: samOrdersRequestParams?.ManufacturerName ?? '',
    ManufacturerArticleNumber: samOrdersRequestParams?.ManufacturerArticleNumber ?? '',
    ProductDescription: samOrdersRequestParams?.ProductDescription ?? '',
    BookedState: samOrdersRequestParams?.BookedState ?? false,
  });

  useEffect(() => {
    if (technicianDataResponse?.data?.technicianEmployeeNumber) {
      setTechnicianEmployeeNumber(technicianDataResponse.data.technicianEmployeeNumber);
    }
  }, [technicianDataResponse.isSuccess]);

  const onFilter = async (queryValues: IDataMenuSamOrdersRequestParams) => {
    setSamOrdersRequestParams({
      TechnicianEmployeeNumber: technicianEmployeeNumber,
      WarehouseLocationId: WAREHOUSE_LOCATION_ID,
      OrderId: queryValues.OrderId,
      SamOrderId: queryValues.SamOrderId ?? '',
      ManufacturerName: queryValues.ManufacturerName ?? '',
      ManufacturerArticleNumber: queryValues.ManufacturerArticleNumber ?? '',
      ProductDescription: queryValues.ProductDescription ?? '',
      BookedState: queryValues.BookedState,
    });
  };

  const viewOrdersModal: ModalDetails = {
    name: ViewOrderModals.DataMenuSamOrders,
    title: t('BOOK_ORDERS_GOOD_RECEIPTS'),
    actions: [
      {
        label: t('DISCARD'),
        onClick: onClose,
        variant: 'outlined',
      },
    ],
  };

  return (
    <CustomModal
      variant="md"
      open
      onClose={onClose}
      title={viewOrdersModal.title}
      actions={<CustomModalActions actions={viewOrdersModal.actions} />}
    >
      {viewOrdersModal.name === ViewOrderModals.DataMenuSamOrders && (
        <>
          <ViewOrdersFilter onFilter={onFilter} />
          <ViewOrdersListTable
            data={(data as unknown as TableData[]) ?? []}
            isLoading={isLoading}
          />
        </>
      )}
    </CustomModal>
  );
};

export default ViewOrders;
