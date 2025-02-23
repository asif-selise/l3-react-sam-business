import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type HeadCell, type TableData } from '@/src/components/CustomTable/types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Box, TableCell, TableRow, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type ServiceOrderOverview } from '@/src/hooks/useTourData/tourData.interface';
import { useDispatch, useSelector } from '@/src/redux/store';
import useAutoSync from '@/src/hooks/useAutoSync/useAutoSync.hook';
import { updateSoStatus } from '@/src/slices/soStatusSlice/soStatus.slice';
import { updateKvStatus } from '@/src/slices/kvStatusSlice/kvStatus.slice';
import { updateServiceOrderState } from '@/src/slices/serviceOrderSlice/serviceOrder.slice';
import { useNavigate } from 'react-router-dom';

interface Props {
  isFetchingTourData: boolean | null;
}

const ServiceOrderTable = ({ isFetchingTourData }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation('index');
  const dispatch = useDispatch();
  const { sync: syncState } = useSelector((state) => state.sync);
  const { isBlockedServiceOrder } = useAutoSync();
  const [isVisible, setIsVisible] = useState(false);
  const serviceOrderSearchText = useSelector((state) => state.topBarSearch.searchValue);

  const {
    customFilteredDataList: sOData,
    getCustomFilteredDataList: getSOData,
    isLoading,
  } = useIndexedDbData<ServiceOrderOverview>('TourPlanData', 'ServiceOrderOverviews');
  const [tableData, setTableData] = useState<TableData[]>([]);

  const headCells: HeadCell[] = [
    {
      id: 'Date',
      label: t('DATE'),
      sortable: true,
    },
    {
      id: 'DayTime',
      label: t('TIME'),
      sortable: true,
    },
    {
      id: 'Appointment',
      label: t('DEADLINE'),
      sortable: true,
    },
    {
      id: 'Text',
      label: t('TEXT'),
      sortable: true,
    },
    {
      id: 'Status',
      label: t('STATUS'),
      sortable: false,
      align: 'center',
    },
    {
      id: 'ProductGroupNumber',
      label: t('PRODUCT_GROUP_NUMBER'),
      sortable: true,
      align: 'left',
    },
    {
      id: 'CustomerName',
      label: t('CUSTOMER_NAME'),
      sortable: true,
    },
    {
      id: 'CustomerStreet',
      label: t('STREET'),
      sortable: true,
    },
    {
      id: 'CustomerPostalCode',
      label: t('POSTAL_CODE'),
      sortable: true,
    },
    {
      id: 'QcpKV',
      label: 'KV',
      sortable: false,
      align: 'center',
    },
    {
      id: 'QcpNo',
      label: 'NO',
      sortable: false,
      align: 'center',
    },
    {
      id: 'Mat',
      label: 'Mat',
      sortable: false,
      align: 'center',
    },
    {
      id: 'CompletionStatus',
      label: t('COMPLETION_STATUS'),
      sortable: true,
    },
  ];
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    Date: false,
    DayTime: true,
    Status: true,
    CustomerName: true,
    Appointment: true,
    Text: true,
    ProductGroupNumber: false,
    CustomerStreet: true,
    QcpKV: true,
    QcpNo: true,
    Mat: true,
    CompletionStatus: true,
    CustomerPostalCode: true,
  });

  const showOrderDetails = (orderId: number, qcpKV: number, status: string) => {
    if (status === null) {
      return;
    }
    dispatch(updateServiceOrderState(orderId));

    localStorage.setItem('serviceOrderId', JSON.stringify(orderId));

    dispatch(updateSoStatus({ soStatus: null }));
    dispatch(updateKvStatus({ hasKV: qcpKV === 1 }));

    navigate(`/sam/dashboard/service-order`);
  };

  const getFilteredSOData = async () => {
    await getSOData((item) => item.Date.split('T')[0] === syncState.selectedDate);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 500);
  }, []);

  useEffect(() => {
    if (syncState.status === 'downloaded') {
      if (serviceOrderSearchText !== '') {
        getSOData(() => true);
      } else {
        getFilteredSOData();
      }
    }
  }, [syncState.status]);

  useEffect(() => {
    if (isFetchingTourData && serviceOrderSearchText !== '') {
      getSOData(() => true);
    }
  }, [isFetchingTourData]);

  const avoidNull = (value: any) => {
    if (value === 'null' || value === null || value === undefined) {
      return '';
    }
    return value;
  };

  return (
    <Box sx={{ width: '100%' }} aria-label="Service Order Table Row">
      <CustomTable
        headCells={headCells}
        setTableData={setTableData}
        rows={sOData as unknown as TableData[]}
        isLoading={isLoading || (!isFetchingTourData && serviceOrderSearchText !== '')}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        tableName="ServiceOrderTable"
      >
        {!isLoading && !!sOData.length && isVisible && (
          <>
            {tableData.map((row) => {
              return (
                <Fragment key={row.TimeId as number}>
                  <TableRow
                    hover
                    tabIndex={-1}
                    sx={{
                      cursor: 'pointer',
                      ...(isBlockedServiceOrder(`${row.OrderId}`) && {
                        backgroundColor: 'cornsilk',
                      }),
                    }}
                    onClick={() => {
                      showOrderDetails(
                        row.OrderId as number,
                        row.QcpKV as number,
                        row.Status as string
                      );
                    }}
                  >
                    {columnVisibility.Date && (
                      <TableCell align="left">
                        <OverflowTooltip
                          text={`${dayjs(row.Date as string).format('DD.MM.YYYY')}`}
                          variant={'body2'}
                        />
                      </TableCell>
                    )}
                    {columnVisibility.DayTime && (
                      <TableCell align="left">
                        <OverflowTooltip text={`${row.DayTime}`} variant={'body2'} />
                      </TableCell>
                    )}
                    {columnVisibility.Appointment && (
                      <TableCell align="left">
                        <OverflowTooltip text={`${avoidNull(row.Appointment)}`} variant="body2" />
                      </TableCell>
                    )}
                    {columnVisibility.Text && (
                      <TableCell align="left" sx={{ maxWidth: '90px' }}>
                        <OverflowTooltip text={`${row.Text}`} variant="body2" />
                      </TableCell>
                    )}
                    {columnVisibility.Status && (
                      <TableCell align="center">
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
                              {row.Status}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                    )}
                    {columnVisibility.ProductGroupNumber && (
                      <TableCell align="left">
                        <OverflowTooltip
                          text={`${avoidNull(row.ProductGroupNumber)}`}
                          variant="body2"
                        />
                      </TableCell>
                    )}
                    {columnVisibility.CustomerName && (
                      <TableCell align="left">
                        <OverflowTooltip
                          text={`${avoidNull(row.CustomerName)}`}
                          variant={'body2'}
                        />
                      </TableCell>
                    )}
                    {columnVisibility.CustomerStreet && (
                      <TableCell align="left" sx={{ maxWidth: '90px' }}>
                        <OverflowTooltip
                          text={`${avoidNull(row.CustomerStreet)}`}
                          variant={'body2'}
                        />
                      </TableCell>
                    )}
                    {columnVisibility.CustomerPostalCode && (
                      <TableCell align="left">
                        <OverflowTooltip
                          text={`${avoidNull(row.CustomerPostalCode)}`}
                          variant={'body2'}
                        />
                      </TableCell>
                    )}
                    {columnVisibility.QcpKV && (
                      <TableCell align="center">
                        {row.QcpKV === 1 ? (
                          <CheckCircleOutlineIcon
                            sx={{
                              color: 'success.main',
                            }}
                          />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    )}
                    {columnVisibility.QcpNo && (
                      <TableCell align="center">
                        {row.QcpNO === 1 ? (
                          <CheckCircleOutlineIcon
                            sx={{
                              color: 'success.main',
                            }}
                          />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    )}
                    {columnVisibility.Mat && (
                      <TableCell align="center">
                        {row.Mat === 1 ? (
                          <CheckCircleOutlineIcon
                            sx={{
                              color: 'success.main',
                            }}
                          />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    )}
                    {columnVisibility.CompletionStatus && (
                      <TableCell align="left">
                        <OverflowTooltip
                          text={`${avoidNull(row.CompletionStatus)}`}
                          variant={'body2'}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                </Fragment>
              );
            })}
          </>
        )}
      </CustomTable>
    </Box>
  );
};
export default ServiceOrderTable;
