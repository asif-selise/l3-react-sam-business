import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type HeadCell, type TableData } from '@/src/components/CustomTable/types';
import { Box, Button, Checkbox, CircularProgress, TableCell, TableRow } from '@mui/material';
import React, { type Dispatch, Fragment, type SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type IPrintTableData } from '@/src/hooks/useMasterData/masterData.interface';
import { getDate } from '@/src/helpers/formatDate';

interface Props {
  selectedItems: [] | IPrintTableData[];
  setSelectedItems: Dispatch<SetStateAction<[] | IPrintTableData[]>>;
  isLoading: boolean;
  printableData: IPrintTableData;
}

const PrintTable = ({ selectedItems, setSelectedItems, printableData, isLoading }: Props) => {
  const { t } = useTranslation('index');

  const [tableData, setTableData] = useState<TableData[]>([]);

  const headCells: HeadCell[] = [
    { id: 'tourDate', label: t('TOUR_DATE'), sortable: true },
    { id: 'sONo', label: t('SO_NO'), sortable: true },
    { id: 'mANr', label: t('MA_NR'), sortable: true },
    { id: 'firstName', label: t('FIRST_NAME'), sortable: false },
    { id: 'name', label: t('NAME'), sortable: false },
    { id: 'invitationLocation', label: t('INVITATION_LOCATION'), sortable: false },
    { id: 'actionButton', label: '', sortable: false },
  ];

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    tourDate: true,
    sONo: true,
    mANr: true,
    firstName: true,
    name: true,
    invitationLocation: true,
    actionButton: true,
  });

  const handleSelectAll = () => {
    if (selectedItems.length === tableData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(tableData as unknown as IPrintTableData[]);
    }
  };

  const onSelect = (row: TableData) => {
    setSelectedItems((prevSelectedItems) => {
      const isSelected = prevSelectedItems.some(
        (item) => item.TechnicianEmployeeNumber === row.TechnicianEmployeeNumber
      );
      if (isSelected) {
        return prevSelectedItems.filter(
          (item) => item.TechnicianEmployeeNumber !== row.TechnicianEmployeeNumber
        );
      } else {
        return [...prevSelectedItems, row as unknown as IPrintTableData];
      }
    });
  };

  return (
    <>
      {printableData && (
        <Box
          sx={{
            mt: 3,
            width: '100%',
            borderRadius: 2,
            boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2),0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: '24px 24px 16px 24px' }}>
            <Button variant="outlined" color="primary" onClick={handleSelectAll}>
              {selectedItems.length === tableData.length ? t('DESELECT_ALL') : t('SELECT_ALL')}
            </Button>
          </Box>

          <CustomTable
            headCells={headCells}
            setTableData={setTableData}
            rows={printableData as unknown as TableData[]}
            isLoading={isLoading}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            tableName="PrintTable"
          >
            {tableData.map((row) => (
              <Fragment key={`${row.TechnicianEmployeeNumber}`}>
                <TableRow hover sx={{ cursor: 'pointer' }}>
                  {columnVisibility.tourDate && (
                    <TableCell align="left">{getDate(row.TourDate as string)}</TableCell>
                  )}
                  {columnVisibility.sONo && <TableCell align="left">{row.Orders}</TableCell>}
                  {columnVisibility.mANr && (
                    <TableCell align="left">{row.TechnicianEmployeeNumber}</TableCell>
                  )}
                  {columnVisibility.firstName && (
                    <TableCell align="left">{row.FirstName}</TableCell>
                  )}
                  {columnVisibility.name && <TableCell align="left">{row.LastName}</TableCell>}
                  {columnVisibility.invitationLocation && (
                    <TableCell align="left">{row.LoadingLocation}</TableCell>
                  )}

                  <TableCell align="left">
                    <Checkbox
                      checked={selectedItems.some(
                        (item) => item.TechnicianEmployeeNumber === row.TechnicianEmployeeNumber
                      )}
                      onClick={() => {
                        onSelect(row);
                      }}
                    />
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </CustomTable>
        </Box>
      )}
      {isLoading && (
        <Box mt={'18vh'} display="flex" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default PrintTable;
