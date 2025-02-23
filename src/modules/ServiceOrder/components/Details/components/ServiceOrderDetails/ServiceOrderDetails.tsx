import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
import { Box, Button, TableCell, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import InfoGrid from '@/src/components/InfoGrid/InfoGrid';
import CustomModal from '@/src/components/CustomModal/CustomModal';
import CustomTable from '@/src/components/CustomTable/CustomTable';
import type { TableData, HeadCell } from '@/src/components/CustomTable/types';
import { Fragment, useEffect, useState } from 'react';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import {
  type ServiceOrderDetail,
  type ServiceOrderManagementCompany,
  type TimeEntity,
  type ManagementCompany,
} from '@/src/hooks/useTourData/tourData.interface';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import { useSelector } from 'react-redux';
import { getDate } from '@/src/helpers/formatDate';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';

interface Props {
  serviceOrderData: ServiceOrderDetail | null;
  getServiceOrderData: <K extends keyof ServiceOrderDetail>(
    key: K,
    value: ServiceOrderDetail[K]
  ) => Promise<void>;
  setServiceOrderDetailsLoaded: any;
}

const ServiceOrderDetails = ({
  serviceOrderData,
  getServiceOrderData,
  setServiceOrderDetailsLoaded,
}: Props) => {
  const { t } = useTranslation('index');
  const id = useSelector((state: any) => state.serviceOrder.id);

  const headCells: HeadCell[] = [
    { id: 'Title', label: t('SALUTATION'), sortable: true, align: 'left' },
    { id: 'LastName', label: t('LAST_NAME'), sortable: true, align: 'left' },
    { id: 'FirstName', label: t('FIRST_NAME'), sortable: true, align: 'left' },
    { id: 'Position', label: t('POSITION'), sortable: true, align: 'left' },
    { id: 'PhoneNumber', label: t('TELEPHONE'), sortable: true, align: 'left' },
    { id: 'Cellphone', label: t('CELLPHONE'), sortable: true, align: 'left' },
    { id: 'Email', label: t('EMAIL'), sortable: true, align: 'left' },
  ];
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    Title: true,
    LastName: true,
    FirstName: true,
    Position: true,
    PhoneNumber: true,
    Cellphone: true,
    Email: true,
  });

  const [tableData, setTableData] = useState<TableData[]>([]);
  const [adminModalState, setAdminModalState] = useState(false);

  const {
    dataItem: timeEntity,
    getDataItem: getTimeEntity,
    isLoading: isLoadingTimeEntities,
  } = useIndexedDbData<TimeEntity>('TourPlanData', 'TimeEntities');

  useEffect(() => {
    if (id) {
      getTimeEntity('OrderId', Number(id)).then();
      getServiceOrderData('OrderId', Number(id)).then();
    }
  }, [id]);

  const {
    dataItem: managementCompany,
    getDataItem: getManagementCompany,
    isLoading: isLoadingManagementCompanies,
  } = useIndexedDbData<ManagementCompany>('TourPlanData', 'ManagementCompanies');

  const {
    dataItem: referralCompany,
    getDataItem: getReferralCompany,
    isLoading: isLoadingRefferralManagementCompanies,
  } = useIndexedDbData<ManagementCompany>('TourPlanData', 'ManagementCompanies');

  const {
    filteredDataList: serviceOrderManagementCompanies,
    getFilteredDataList: getServiceOrderManagementCompanies,
    isLoading: isLoadingServiceOrderManagementCompanies,
  } = useIndexedDbData<ServiceOrderManagementCompany>(
    'TourPlanData',
    'ServiceOrderManagementCompanies'
  );

  useEffect(() => {
    const areAllDataLoaded =
      !isLoadingTimeEntities &&
      !isLoadingManagementCompanies &&
      !isLoadingRefferralManagementCompanies &&
      !isLoadingServiceOrderManagementCompanies;

    if (areAllDataLoaded) {
      setServiceOrderDetailsLoaded(true);
    }
  }, [
    isLoadingTimeEntities,
    isLoadingManagementCompanies,
    isLoadingRefferralManagementCompanies,
    isLoadingServiceOrderManagementCompanies,
  ]);

  useEffect(() => {
    if (serviceOrderData?.Administration) {
      getManagementCompany('AdministrationId', serviceOrderData.Administration).then();
      getReferralCompany('AdministrationId', serviceOrderData.ReferralAdministration).then();
      getServiceOrderManagementCompanies(
        'AdministrationId',
        serviceOrderData.Administration
      ).then();
    }
  }, [serviceOrderData?.Administration]);

  const handleCloseModal = () => {
    setAdminModalState(false);
  };

  const modalActions = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: handleCloseModal,
          variant: 'outlined',
        },
      ]}
    />
  );

  const renderSoGroup = (soGroup: string | null | undefined) => {
    if (!soGroup) return null;

    return (
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-around'}>
        <Box
          sx={{
            borderRadius: '6px',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(51, 102, 255, 0.16)',
            mx: 'auto',
          }}
        >
          <Typography
            variant="overline"
            sx={{
              fontWeight: '800',
              color: 'info.dark',
              lineHeight: 1,
            }}
          >
            {soGroup}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Card aria-label="Service Order Details" sx={{ height: '100%' }}>
      <CardHeader
        title={t('SERVICE_ORDER')}
        action={
          <>
            <Box display={'flex'} alignItems={'center'} columnGap={1}>
              <Button
                variant="outlined"
                size="medium"
                color="primary"
                // sx={{ pt: 0 }}
                onClick={() => {
                  setAdminModalState(true);
                }}
              >
                {t('ADMINISTRATORS')}
              </Button>
            </Box>
            <CustomModal
              open={adminModalState}
              onClose={handleCloseModal}
              title={t('ADMINISTRATOR_PROFILES')}
              actions={modalActions}
            >
              <CustomTable
                headCells={headCells}
                setTableData={setTableData}
                rows={serviceOrderManagementCompanies as unknown as TableData[]}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                tableName="ServiceOrderDetailsTable"
              >
                {tableData.map((row, index) => (
                  <Fragment key={`${index} + ${row.AdministrationId}`}>
                    <TableRow hover sx={{ cursor: 'pointer' }}>
                      {columnVisibility.Title && (
                        <TableCell align="left">
                          <OverflowTooltip text={sanitizeData(row.Title)} variant={'body2'} />
                        </TableCell>
                      )}
                      {columnVisibility.LastName && (
                        <TableCell align="left">
                          <OverflowTooltip text={sanitizeData(row.LastName)} variant={'body2'} />
                        </TableCell>
                      )}
                      {columnVisibility.FirstName && (
                        <TableCell align="left">
                          <OverflowTooltip text={sanitizeData(row.FirstName)} variant={'body2'} />
                        </TableCell>
                      )}
                      {columnVisibility.Position && (
                        <TableCell align="left">
                          <OverflowTooltip text={sanitizeData(row.Position)} variant={'body2'} />
                        </TableCell>
                      )}
                      {columnVisibility.PhoneNumber && (
                        <TableCell align="left">
                          <OverflowTooltip text={sanitizeData(row.PhoneNumber)} variant={'body2'} />
                        </TableCell>
                      )}
                      {columnVisibility.Cellphone && (
                        <TableCell align="left">
                          <OverflowTooltip text={sanitizeData(row.Cellphone)} variant={'body2'} />
                        </TableCell>
                      )}
                      {columnVisibility.Email && (
                        <TableCell align="left">
                          <OverflowTooltip text={sanitizeData(row.Email)} variant={'body2'} />
                        </TableCell>
                      )}
                    </TableRow>
                  </Fragment>
                ))}
              </CustomTable>
            </CustomModal>
          </>
        }
      />
      <Box padding={'24px'}>
        <InfoGrid
          sx={{ marginBottom: '16px' }}
          label={'SERVICE_ORDER_NO'}
          value={sanitizeData(serviceOrderData?.OrderId)}
          info={renderSoGroup(serviceOrderData?.Group)}
        />
        <InfoGrid
          sx={{ marginBottom: '16px' }}
          label={'DATE'}
          value={timeEntity?.Date ? sanitizeData(getDate(timeEntity.Date)) : '-'}
        />
        <InfoGrid
          sx={{ marginBottom: '16px' }}
          label={'SHIFT'}
          value={sanitizeData(timeEntity?.TimeSlot)}
        />
        <InfoGrid
          sx={{ marginBottom: '16px' }}
          label={'YOUR_REFERENCE'}
          value={sanitizeData(serviceOrderData?.YourReference)}
        />
        <InfoGrid
          sx={{ marginBottom: '16px' }}
          label={'OUR_REFERENCE'}
          value={sanitizeData(serviceOrderData?.OurReference)}
        />
        <InfoGrid
          sx={{ marginBottom: '16px' }}
          label={'OWNER'}
          value={sanitizeData(serviceOrderData?.Owner)}
        />
        <InfoGrid
          sx={{ marginBottom: '16px' }}
          label={'ADMINISTRATION'}
          value={sanitizeData(managementCompany?.ManagementAddress)}
        />
        <InfoGrid
          sx={{ marginBottom: '16px' }}
          label={'ADMINISTRATION_CONTACT'}
          value={sanitizeData(managementCompany?.PhoneNumber)}
        />
        <InfoGrid
          sx={{ marginBottom: '16px' }}
          label={'MEDIATED_BY'}
          value={sanitizeData(referralCompany?.ManagementAddress)}
        />
        <InfoGrid
          sx={{ marginBottom: '16px' }}
          label={'AREA_SUPERVISOR'}
          value={sanitizeData(serviceOrderData?.AreaInfo)}
        />
        <InfoGrid
          sx={{ marginBottom: '16px' }}
          label={'RECORDED'}
          value={sanitizeData(getDate(serviceOrderData?.CreatedAt))}
        />
        <InfoGrid label={'MODIFIED'} value={sanitizeData(getDate(serviceOrderData?.UpdatedAt))} />
      </Box>
    </Card>
  );
};

export default ServiceOrderDetails;
