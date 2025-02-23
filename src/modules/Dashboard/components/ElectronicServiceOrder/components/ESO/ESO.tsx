import { type TableData } from '@/src/components/CustomTable/types';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type WorkflowDetail } from '@/src/hooks/useTourData/tourData.interface';
import ElectronicServiceOrderTable from '@/src/modules/Dashboard/components/ElectronicServiceOrder/components/ElectronicServiceOrderTable/ElectronicServiceOrderTable';
import {
  type EditESOFields,
  type CreateESOFields,
  type ESOFilterFields,
} from '@/src/modules/Dashboard/components/ElectronicServiceOrder/types';
import { type Dispatch, type SetStateAction, useEffect, useState, useRef } from 'react';
import { convertArrayToTableData } from '../../utils/tableDataConverter';
import CreateESO from '../CreateESO/CreateESO';
import CustomModalActions from '@/src/components/CustomModal/CustomModalActions/CustomModalActions';
import CustomModal from '@/src/components/CustomModal/CustomModal';
import { useTranslation } from 'react-i18next';
import Iconify from '@/src/components/iconify/iconify';
import { Box, TextField, InputAdornment, Button } from '@mui/material';
import FilterESO from '../FilterESO/FilterESO';
import createNewEsoData from '../../utils/createNewEsoData';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';
import dayjs from 'dayjs';

const intialFilterData: ESOFilterFields = {
  ESO: '',
  Special: '',
  Branch: '',
  RepSO: false,
  EsoID: '',
  SO: '',
  Remarks: '',
};

interface Props {
  soId?: number | null;
  openCreateESO: boolean;
  setOpenCreateESO: Dispatch<SetStateAction<boolean>>;
}

const ESO = ({ soId = null, openCreateESO, setOpenCreateESO }: Props) => {
  const { t } = useTranslation('index');

  const { data: technicianData } = useTechnicianData();

  const [systemUser, setSystemUser] = useState<string>('');

  const [convertedTableData, setConvertedTableData] = useState<TableData[]>([]);
  const createESORef = useRef<{ handleSubmitForm: () => void } | null>(null);

  const {
    dataList: esoList,
    getDataList: getEsoList,
    updateDataList: updateEsoList,
  } = useIndexedDbData<WorkflowDetail>('TourPlanData', 'WorkflowDetails');

  const handleCreateModalSumit = (formData: CreateESOFields) => {
    setOpenCreateESO(false);

    const newEsoData = createNewEsoData(formData, systemUser);

    updateEsoList(
      [...esoList, newEsoData as WorkflowDetail],
      newEsoData,
      'InsertRecords',
      'WorkflowDetailsUpdateRequestModel'
    );
  };

  const addComment = (remark: string, comment: string, orderTime: string) => {
    const currentDate = dayjs().format('DD.MM.YYYY');

    return orderTime === 'Before'
      ? `${comment} ${currentDate} ${systemUser}//${remark}`
      : `${remark}//${comment} ${currentDate} ${systemUser}`;
  };

  const handleEditModalSubmit = (formData: EditESOFields) => {
    if (formData.Comments === '') return;

    const updatedData = esoList.map((data) => {
      if (data.UId === formData.UId) {
        return {
          ...data,
          WorkflowRemark: addComment(
            data.WorkflowRemark ?? '',
            formData.Comments,
            formData.OrderTime
          ),
        };
      }
      return data;
    });

    updateEsoList(updatedData, formData, 'UpdateRecords', 'WorkflowDetailsUpdateRequestModel');
  };

  useEffect(() => {
    if (technicianData?.systemUser) {
      setSystemUser(technicianData.systemUser);
    }
  }, [technicianData]);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      await getEsoList();
    };

    fetchAndProcessData();
  }, []);

  useEffect(() => {
    if (esoList) {
      const convertedData = convertArrayToTableData(esoList);
      setConvertedTableData(convertedData);
    }
  }, [esoList]);

  const modalActionsCreateESO = (
    <CustomModalActions
      actions={[
        {
          label: t('DISCARD'),
          onClick: () => {
            setOpenCreateESO(false);
          },
          variant: 'outlined',
        },
        {
          label: t('SAVE'),
          onClick: () => {
            createESORef.current?.handleSubmitForm();
          },
        },
      ]}
    />
  );

  const ESORef = useRef<HTMLInputElement>(null);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filterData, setFilterData] = useState<ESOFilterFields>(intialFilterData);

  useEffect(() => {
    if (soId) {
      setFilterData({
        ...filterData,
        SO: soId.toString(),
      });
    }
  }, [soId]);

  const handleApplyFilter = (newFilterData: ESOFilterFields) => {
    setFilterData({
      ...newFilterData,
      ESO: ESORef.current?.value ?? '',
    });
    setAnchorEl(null);
  };

  const handleClearFilter = () => {
    setFilterData(intialFilterData);

    if (ESORef.current) {
      ESORef.current.value = '';
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <TextField
          inputRef={ESORef}
          placeholder={t('SEARCH_ESO')}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'material-symbols:search'} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
          }}
          variant="contained"
          color="primary"
          sx={{ height: 'auto', px: 2.5, whiteSpace: 'nowrap' }}
          endIcon={
            <Iconify
              icon={'material-symbols:arrow-drop-down-rounded'}
              sx={{ width: '24px', height: '24px' }}
            />
          }
        >
          {t('FILTER')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ height: 'auto', px: 2.5, whiteSpace: 'nowrap' }}
          onClick={handleClearFilter}
        >
          {t('CLEAR')}
        </Button>
      </Box>

      <ElectronicServiceOrderTable
        systemUser={systemUser}
        data={convertedTableData}
        esoFilters={filterData}
        onEditModalSubmit={handleEditModalSubmit}
      />

      {openCreateESO && (
        <CustomModal
          title={t('CREATE_ESO')}
          open
          onClose={() => {
            setOpenCreateESO(false);
          }}
          actions={modalActionsCreateESO}
        >
          <CreateESO orderId={soId} ref={createESORef} onSubmitForm={handleCreateModalSumit} />
        </CustomModal>
      )}

      {anchorEl && (
        <FilterESO
          anchorEl={anchorEl}
          onClose={() => {
            setAnchorEl(null);
          }}
          onApply={handleApplyFilter}
          filterData={filterData}
        />
      )}
    </>
  );
};

export default ESO;
