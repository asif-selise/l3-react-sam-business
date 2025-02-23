import orderIcon from '@/public/assets/icons/ic_order.svg';
import receiptListIcon from '@/public/assets/icons/ic_receipt_list.svg';
import invoiceIcon from '@/public/assets/icons/ic_invoice_grey.svg';
import CommonSection from '../CommonSection/CommonSection';
import { useTranslation } from 'react-i18next';
import { type ActionCardDetail } from '@/src/components/ActionCard/types';
import { useState } from 'react';
import NightDelivery from './components/NightDelivery/NightDelivery';
import OrdersWGA from './components/OrdersWGA/OrdersWGA';
import ViewOrders from './components/ViewOrders/ViewOrders';

const OrderSection = () => {
  const { t } = useTranslation('index');
  const [openNightDelivery, setOpenNightDelivery] = useState(false);
  const [openOrdersWGA, setOpenOrdersWGA] = useState(false);
  const [openViewOrders, setViewOrders] = useState(false);

  const actionCards: ActionCardDetail[] = [
    {
      icon: orderIcon,
      title: t('POST_GOODS_RECEIPTS_FOR_OVERNIGHT_DELIVERIES'),
      onClick: () => {
        setOpenNightDelivery(true);
      },
    },
    {
      icon: receiptListIcon,
      title: t('ORDERS_WGA'),
      onClick: () => {
        setOpenOrdersWGA(true);
      },
    },
    {
      icon: invoiceIcon,
      title: t('VIEW_ORDERS'),
      onClick: () => {
        setViewOrders(true);
      },
    },
  ];

  return (
    <>
      <CommonSection
        header={{
          title: t('ORDERS_AND_RECEIPTS'),
        }}
        actionCards={actionCards}
      />

      {openNightDelivery && (
        <NightDelivery
          onClose={() => {
            setOpenNightDelivery(false);
          }}
        />
      )}
      {openOrdersWGA && <OrdersWGA onClose={setOpenOrdersWGA} />}
      {openViewOrders && (
        <ViewOrders
          onClose={() => {
            setViewOrders(false);
          }}
        />
      )}
    </>
  );
};

export default OrderSection;
