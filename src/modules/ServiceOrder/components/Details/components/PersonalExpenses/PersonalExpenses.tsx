import type { HeadCell } from '@/src/components/CustomTable/types';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PersonalExpensesTable from './components/PersonalExpensesTable';
import AddEditPersonalExpenses from './components/AddEditPersonalExpenses';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type PersonalEffort } from '@/src/hooks/useTourData/tourData.interface';
import { useSelector } from '@/src/redux/store';

interface Props {
  setPersonalEffortsData: Dispatch<SetStateAction<PersonalEffort[] | null>>;
}

const PersonalExpenses = ({ setPersonalEffortsData }: Props) => {
  const { t } = useTranslation('index');
  const id = useSelector((state) => state.serviceOrder.id);
  const isSoReadOnly = useSelector((state) => state.soStatus.soStatus === 'ReadOnly');

  const {
    filteredDataList: personalExpensesData,
    getFilteredDataList: fetchPersonalExpenses,
    updateDataLists: updatePersonalExpenses,
    isLoading,
  } = useIndexedDbData<PersonalEffort>('TourPlanData', 'PersonalEfforts');

  useEffect(() => {
    fetchPersonalExpenses('OrderId', Number(id)).then();
  }, [id]);

  const headCells: HeadCell[] = [
    { id: 'Date', label: t('DATE'), sortable: true, align: 'left' },
    { id: 'TechnicianNumber', label: t('TECHNICIAN_NUMBER'), sortable: true, align: 'left' },
    { id: 'TechnicianName', label: t('TECHNICIAN_NAME'), sortable: true, align: 'left' },
    { id: 'Start', label: t('FROM'), sortable: true, align: 'left' },
    { id: 'End', label: t('UNTIL'), sortable: true, align: 'left' },
    { id: 'TravelTime', label: t('TRAVEL_TIME'), sortable: true, align: 'left' },
    { id: 'Code', label: t('CODE'), sortable: true, align: 'left' },
    { id: 'WorkFromHome', label: t('WORK_FROM_HOME'), sortable: true, align: 'center' },
    { id: 'NoSecondWayReason', label: t('SECOND_CHECK_REASON'), sortable: true, align: 'left' },
    { id: 'actionButton', label: '', sortable: false, align: 'right' },
  ];

  const [openAddModal, setOpenAddModal] = useState(false);

  const handleAddModalOpen = () => {
    setOpenAddModal(true);
  };

  const handleAddModalClose = () => {
    setOpenAddModal(false);
  };

  const handleAddModalSubmit = async (formData: PersonalEffort) => {
    setOpenAddModal(false);
    const updatedData = [...personalExpensesData, formData];
    await updatePersonalExpenses(
      updatedData,
      'OrderId',
      Number(id),
      formData,
      'InsertRecords',
      'PersonalEffortsUpdateRequestModel'
    );
    setPersonalEffortsData(updatedData);
  };

  const handleEditModalSubmit = async (formData: PersonalEffort) => {
    const updatedData = personalExpensesData.map((data) => {
      if (data.UId === formData.UId) {
        return formData;
      }
      return data;
    });
    await updatePersonalExpenses(
      updatedData,
      'OrderId',
      Number(id),
      formData,
      'UpdateRecords',
      'PersonalEffortsUpdateRequestModel'
    );
    setPersonalEffortsData(updatedData);
  };

  const handleDeleteAction = async (formData: PersonalEffort) => {
    const updatedData = personalExpensesData.filter((data) => data.UId !== formData.UId);
    await updatePersonalExpenses(
      updatedData,
      'OrderId',
      Number(id),
      formData,
      'DeleteRecords',
      'PersonalEffortsUpdateRequestModel'
    );
    setPersonalEffortsData(updatedData);
  };

  return (
    <>
      <Box
        aria-label="Personal Expenses"
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: `0 0 2px 0 rgba(145, 158, 171, 0.2),0 12px 24px -4px rgba(145, 158, 171, 0.12)`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            mr: '24px',
          }}
        >
          <Typography p={'24px'} variant="h6" color={'text.primary'}>
            {t('PERSONAL_EXPENSES')}
          </Typography>
          <Button
            disabled={isSoReadOnly}
            variant="outlined"
            color="primary"
            onClick={handleAddModalOpen}
          >
            {t('ADD_NEW_EXPENSE')}
          </Button>
        </Box>
        <PersonalExpensesTable
          data={personalExpensesData}
          headCells={headCells}
          isLoading={isLoading}
          onEditModalSubmit={handleEditModalSubmit}
          onDeleteSubmit={handleDeleteAction}
        />
      </Box>
      {openAddModal && (
        <AddEditPersonalExpenses
          type={'add'}
          onClose={handleAddModalClose}
          onSubmitForm={handleAddModalSubmit}
        />
      )}
    </>
  );
};

export default PersonalExpenses;
