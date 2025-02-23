import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import OfferTable from './components/OfferTable/OfferTable';
import { type SamOffer } from '@/src/hooks/useTourData/tourData.interface';
import { useSelector } from 'react-redux';
import CreateOffer from '../CreateOffer/CreateOffer';

interface Props {
  SORep: number;
  openCreateOfferModal: boolean;
  setOpenCreateOfferModal: Dispatch<SetStateAction<boolean>>;
  samOfferUId: string;
  samOfferId: number;
  handleWoodOrderModal: (samOfferCopyId: number, samOfferCopyUId: string) => void;
  openOfferForCopy: boolean;
  setOpenOfferForCopy: Dispatch<SetStateAction<boolean>>;
}

export type IStep = 1 | 2 | 3 | 4;

const Offer = ({
  SORep,
  openCreateOfferModal,
  setOpenCreateOfferModal,
  samOfferUId,
  samOfferId,
  handleWoodOrderModal,
  openOfferForCopy,
  setOpenOfferForCopy,
}: Props) => {
  const { t } = useTranslation('index');
  const serviceOrderID = useSelector((state: any) => state.serviceOrder.id);
  const [currentStep, setCurrentStep] = useState<IStep>(1);

  const {
    customFilteredDataList: offerList,
    getCustomFilteredDataList: getOfferList,
    isLoading,
  } = useIndexedDbData<SamOffer>('TourPlanData', 'SamOffers');

  const onCloseCreateOfferModal = (action: 'save' | 'discard') => {
    if (action === 'save') {
      getOfferList(
        (item) => item.OrderId === Number(serviceOrderID) || item.OrderId === SORep
      ).then();
    }

    setOpenCreateOfferModal(false);
    setOpenOfferForCopy(false);
    setCurrentStep(1);
  };

  useEffect(() => {
    getOfferList(
      (item) => item.OrderId === Number(serviceOrderID) || item.OrderId === SORep
    ).then();
  }, [serviceOrderID]);

  return (
    <>
      <Box
        aria-label="Offer"
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2),0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
        }}
      >
        <Typography p={'24px'} variant="h6" color={'text.primary'}>
          {t('OFFERS')}
        </Typography>
        <OfferTable
          SORep={SORep}
          data={offerList}
          isLoading={isLoading}
          getOfferList={getOfferList}
          handleWoodOrderModal={handleWoodOrderModal}
          openOfferForCopy={openOfferForCopy}
          setOpenOfferForCopy={setOpenOfferForCopy}
        />
      </Box>
      {openCreateOfferModal && (
        <CreateOffer
          type="add"
          samOfferUId={samOfferUId}
          samOfferId={samOfferId}
          isNewSamOffer={true}
          isCopy={false}
          samOfferCopyId={null}
          samOfferCopyUId={null}
          currentStep={currentStep}
          open={openCreateOfferModal}
          setCurrentStep={setCurrentStep}
          onCancel={onCloseCreateOfferModal}
        />
      )}
    </>
  );
};

export default Offer;
