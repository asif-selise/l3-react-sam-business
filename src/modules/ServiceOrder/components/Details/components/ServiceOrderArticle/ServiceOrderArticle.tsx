import { useTranslation } from 'react-i18next';
import ServiceOrderArticleTable from './components/ServiceOrderArticleTable/ServiceOrderArticleTable';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  styled,
} from '@mui/material';
import { type TableData } from '@/src/components/CustomTable/types';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { useEffect } from 'react';
import { type InvoiceDetail } from '@/src/hooks/useTourData/tourData.interface';
import { useSelector } from 'react-redux';
import Iconify from '@/src/components/iconify/iconify';

const ServiceOrderArticle = () => {
  const { t } = useTranslation('index');
  const id = useSelector((state: any) => state.serviceOrder.id);
  const {
    filteredDataList: invoiceData,
    getFilteredDataList: getInvoiceData,
    isLoading,
  } = useIndexedDbData<InvoiceDetail>('TourPlanData', 'InvoiceDetails');

  useEffect(() => {
    if (id) {
      getInvoiceData('OrderId', Number(id));
    }
  }, [id]);

  const StyledAccordionSummary = styled(AccordionSummary)({
    padding: '24px',
    '& .MuiAccordionSummary-content': { margin: 0 },
    '& .MuiAccordionSummary-content.Mui-expanded': { margin: 0 },
  });

  return (
    <Box
      aria-label="Service Order Article"
      sx={{
        width: '100%',
        borderRadius: 2,
        boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2),0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
      }}
    >
      <Accordion>
        <StyledAccordionSummary expandIcon={<Iconify icon="ic:round-expand-more" width={24} />}>
          <Typography variant="h6" color={'text.primary'}>
            {t('SERVICE_ORDER_ARTICLE')}
          </Typography>
        </StyledAccordionSummary>
        <AccordionDetails sx={{ p: 0, mb: -2 }}>
          <ServiceOrderArticleTable
            data={invoiceData as unknown as TableData[]}
            isLoading={isLoading}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ServiceOrderArticle;
