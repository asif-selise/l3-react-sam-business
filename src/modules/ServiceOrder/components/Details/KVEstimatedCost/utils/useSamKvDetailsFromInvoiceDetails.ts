import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import type { InvoiceDetail, SamKvDetail } from '@/src/hooks/useTourData/tourData.interface';
import { useEffect } from 'react';
import { getUniqueID, getUniqueNumber } from '@/src/helpers/generateID';
import dayjs from 'dayjs';
import { type Products } from '@/src/hooks/useMasterData/masterData.interface';
import { useDispatch } from '@/src/redux/store';
import { showErrorMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { useTranslation } from 'react-i18next';

const useSamKvDetailsFromInvoiceDetails = (orderId: number) => {
  const { t } = useTranslation('index');

  const dispatch = useDispatch();
  const { filteredDataList: invoiceDetails, getFilteredDataList: getInvoiceDetails } =
    useIndexedDbData<InvoiceDetail>('TourPlanData', 'InvoiceDetails');

  const { dataList: products, getDataList: getProducts } = useIndexedDbData<Products>(
    'MasterData',
    'Products'
  );

  useEffect(() => {
    if (orderId) {
      getInvoiceDetails('OrderId', orderId).then();
    }
  }, [orderId]);

  useEffect(() => {
    getProducts().then();
  }, []);

  let appendSIKO: boolean = true;

  const getSamKvDetailsFromInvoiceDetails = (
    samKvId: number,
    samKvUId: string,
    systemUser: string | null
  ): SamKvDetail[] => {
    const samKvDetails: SamKvDetail[] = [];

    if (invoiceDetails?.length > 0) {
      invoiceDetails.forEach((invoiceDetail) => {
        if (invoiceDetail.ProductId === 795164) {
          appendSIKO = false;
        }

        const samKvDetail: SamKvDetail = {
          UId: getUniqueID(),
          SamKvUId: samKvUId,
          SamKvId: samKvId,
          ProductId: invoiceDetail.ProductId,
          ArticleNumber: invoiceDetail.ArticleNumber,
          Description: invoiceDetail.ArticleDescription,
          Quantity: invoiceDetail.Quantity,
          UnitPrice: invoiceDetail.Gross,
          TotalCost: invoiceDetail.Gross,
          CreatedAt: dayjs().toISOString(),
          SamKvDetailId: getUniqueNumber(),
          UpdatedAt: dayjs().toISOString(),
          ChangedBy: systemUser,
        };

        samKvDetails.push(samKvDetail);
      });
    }

    if (appendSIKO) {
      const sikoProduct = products.find((it) => it.ProductId === 795164);

      if (!sikoProduct) {
        dispatch(showErrorMessage(t('SIKO_PAUSCHALE_NOT_FOUND')));
      }

      const samKvDetail: SamKvDetail = {
        UId: getUniqueID(),
        SamKvUId: samKvUId,
        SamKvId: samKvId,
        ProductId: 795164,
        ArticleNumber: sikoProduct?.ManufacturerArticleNumber ?? 'SIKO',
        Description: sikoProduct?.Description ?? 'SIKO - Pauschle',
        Quantity: 1,
        UnitPrice: sikoProduct?.ListPriceExcl ?? 0,
        TotalCost: sikoProduct?.ListPriceExcl ?? 0,
        CreatedAt: dayjs().toISOString(),
        SamKvDetailId: getUniqueNumber(),
        UpdatedAt: dayjs().toISOString(),
        ChangedBy: systemUser,
      };

      samKvDetails.push(samKvDetail);
    }

    return samKvDetails;
  };

  return { getSamKvDetailsFromInvoiceDetails };
};

export default useSamKvDetailsFromInvoiceDetails;
