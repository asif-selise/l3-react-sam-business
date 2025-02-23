import ChecklistTable from './components/ChecklistTable/ChecklistTable';
import { type InstallationChecklist } from '@/src/hooks/useTourData/tourData.interface';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { type TableData } from '@/src/components/CustomTable/types';
import { useTranslation } from 'react-i18next';
import { Box, Checkbox, MenuItem, TextField, Typography } from '@mui/material';
import { getUniqueID } from '@/src/helpers/generateID';
import { useDispatch, useSelector } from '@/src/redux/store';
import { type SamCheckListInstallation } from '@/src/hooks/useMasterData/masterData.interface';
import { showErrorMessage, showSuccessMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import dayjs from 'dayjs';
import useTechnicianData from '@/src/hooks/useTechnicianData/useTechnicianData.hook';
import ConfirmationModal from '@/src/components/ConfirmationModal/ConfirmationModal';

const CheckList = forwardRef((_, ref) => {
  const { t } = useTranslation();
  const soId = useSelector((state) => state.serviceOrder.id);
  const dispatch = useDispatch();

  const { data: technicianData } = useTechnicianData();

  const {
    filteredDataList: installationChecklist,
    getFilteredDataList: getInstallationChecklist,
    updateDataLists: updateInstallationChecklist,
  } = useIndexedDbData<InstallationChecklist>('TourPlanData', 'InstallationChecklist');

  const { dataList: samCheckListInstallations, getDataList: getSamCheckListInstallations } =
    useIndexedDbData<SamCheckListInstallation>('MasterData', 'SamCheckListInstallations');

  const [pg, setPg] = useState<number | null>(null);
  const [productGroups, setProductGroups] = useState<Map<number, string>>(new Map([]));
  const [availablePgSamCheckList, setAvailablePgSamCheckList] = useState<Map<number, boolean>>(
    new Map([])
  );
  const [isAllAnswersChecked, setIsAllAnswersChecked] = useState<boolean>(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

  useEffect(() => {
    getSamCheckListInstallations();
  }, []);

  useEffect(() => {
    if (soId) {
      getInstallationChecklist('OrderId', soId);
    }
  }, [soId]);

  useImperativeHandle(ref, () => ({
    handleAddChecklist: () => {
      if (!pg) {
        dispatch(showErrorMessage(t('PLEASE_SELECT_PG_FIRST_TO_ADD_CHECKLIST')));
        return;
      }
      if (availablePgSamCheckList.get(pg)) {
        dispatch(showErrorMessage(t('PG_ALREADY_ADDED', { pg })));
        return;
      }

      const newCheckListFromSamCheckList: InstallationChecklist[] = samCheckListInstallations
        .filter((samCheckListInstallation) => samCheckListInstallation.ProductGroupNumber === pg)
        .map((samCheckListInstallation) => {
          return {
            UId: getUniqueID(),
            ChecklistDataId: 0,
            OrderId: soId,
            ChecklistId: samCheckListInstallation.Id,
            Answer: null,
            ModifiedAt: dayjs().toISOString(),
            ModifiedBy: technicianData?.systemUser ?? '',
            ProductGroupId: samCheckListInstallation.ProductGroup,
            Question: samCheckListInstallation.Question,
            Sorting: samCheckListInstallation.SortOrder,
            ProductGroupNumber: samCheckListInstallation.ProductGroupNumber,
          };
        });

      const updatedinstallationChecklist = installationChecklist.concat(
        newCheckListFromSamCheckList
      );

      updateInstallationChecklist(
        updatedinstallationChecklist,
        'OrderId',
        soId,
        newCheckListFromSamCheckList,
        'InsertRecords',
        'InstallationChecklistUpdateRequestModel'
      );

      dispatch(showSuccessMessage(t('PG_ADDED_SUCCESSFULLY', { pg })));
    },

    handleDeleteConfirmChecklist: () => {
      if (!pg) {
        dispatch(showErrorMessage(t('PLEASE_SELECT_PG_FIRST_TO_DELETE_CHECKLIST')));
        return;
      }
      if (!availablePgSamCheckList.get(pg)) {
        dispatch(showErrorMessage(t('PG_NOT_ADDED', { pg })));
        return;
      }

      setOpenDeleteConfirmation(true);
    },
  }));

  const handleDeleteChecklist = () => {
    const updatedChecklist = installationChecklist.filter(
      (checklist) => checklist.ProductGroupNumber !== pg
    );

    const deletedChecklist = installationChecklist.filter(
      (checklist) => checklist.ProductGroupNumber === pg
    );

    updateInstallationChecklist(
      updatedChecklist,
      'OrderId',
      soId,
      deletedChecklist,
      'DeleteRecords',
      'InstallationChecklistUpdateRequestModel'
    );

    dispatch(showSuccessMessage(t('PG_DELETED_SUCCESSFULLY', { pg })));
  };

  const updateAnswer = (answer: boolean | null) => {
    switch (answer) {
      case null:
        return false;
      case false:
        return true;
      case true:
        return null;
    }
  };

  const handleUpdateChecklistRow = (row: TableData) => {
    const updatedChecklistRow: InstallationChecklist = {
      ...(row as unknown as InstallationChecklist),
      Answer: updateAnswer(row.Answer as boolean | null),
    };
    const updatedChecklist = installationChecklist.map((checklist) => {
      if (checklist.UId === updatedChecklistRow.UId) {
        return updatedChecklistRow;
      }
      return checklist;
    });
    updateInstallationChecklist(
      updatedChecklist,
      'OrderId',
      soId,
      updatedChecklistRow,
      'UpdateRecords',
      'InstallationChecklistUpdateRequestModel'
    );
    dispatch(showSuccessMessage(t('ANSWER_UPDATED_SUCCESSFULLY')));
  };

  useEffect(() => {
    if (samCheckListInstallations) {
      const productGroupMap = new Map<number, string>();
      samCheckListInstallations.forEach((samCheckListInstallation) => {
        if (!productGroupMap.has(samCheckListInstallation.ProductGroupNumber)) {
          productGroupMap.set(
            samCheckListInstallation.ProductGroupNumber,
            samCheckListInstallation.ProductGroupName
          );
        }
      });
      setProductGroups(productGroupMap);
    }
  }, [samCheckListInstallations]);

  const updateChecklistDataMap = () => {
    if (installationChecklist.length === 0) {
      setAvailablePgSamCheckList(new Map([]));
      setIsAllAnswersChecked(false);
      return;
    }

    const availablePgSamCheckListMap = new Map<number, boolean>();
    installationChecklist.forEach((checklist) => {
      if (!availablePgSamCheckListMap.has(checklist.ProductGroupNumber)) {
        availablePgSamCheckListMap.set(checklist.ProductGroupNumber, true);
      }
    });

    setAvailablePgSamCheckList(availablePgSamCheckListMap);
    setIsAllAnswersChecked(installationChecklist.every((checklist) => checklist.Answer === true));
  };

  useEffect(() => {
    updateChecklistDataMap();
  }, [installationChecklist]);

  const handleUpdateAllAnswers = () => {
    if (installationChecklist.length === 0) {
      dispatch(showErrorMessage(t('NO_CHECKLIST_AVAILABLE_TO_UPDATE')));
      return;
    }

    const updatedChecklist = installationChecklist.map((checklist) => ({
      ...checklist,
      Answer: !isAllAnswersChecked,
    }));

    updateInstallationChecklist(
      updatedChecklist,
      'OrderId',
      soId,
      updatedChecklist,
      'UpdateRecords',
      'InstallationChecklistUpdateRequestModel'
    );

    dispatch(showSuccessMessage(t('ALL_ANSWERS_UPDATED_SUCCESSFULLY')));
  };

  return (
    <>
      <Box sx={{ display: 'flex', mb: 3, mt: '4px', gap: 2 }}>
        <TextField
          value={pg}
          onChange={(e) => {
            setPg(Number(e.target.value));
          }}
          select
          label={t('PG')}
          InputLabelProps={{ shrink: true }}
          SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 250 } } } }}
          size="small"
          sx={{ width: '30%' }}
        >
          {Array.from(productGroups).map(([productGroupNumber, productGroupName]) => (
            <MenuItem key={productGroupNumber} value={productGroupNumber}>
              {productGroupNumber} - {productGroupName}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: 'flex', gap: 1, alignItems: { tablet: 'start', desktop: 'center' } }}>
          <Checkbox checked={isAllAnswersChecked} onChange={handleUpdateAllAnswers} sx={{ p: 0 }} />
          <Typography variant="body2" color={'text.primary'}>
            {t('HAVE_ALL_POINTS_CHECKED')}
          </Typography>
        </Box>
      </Box>

      <ChecklistTable
        data={installationChecklist as unknown as TableData[]}
        onUpdatedChecklistRow={handleUpdateChecklistRow}
      />

      {openDeleteConfirmation && pg && (
        <ConfirmationModal
          open
          title={t('DELETE_CHECKLIST_ASK')}
          details={
            <Box>
              <Typography variant="body1">{t('DELETE')}!!!</Typography>
              <Typography variant="body1">
                {t('DELETE_CHECKLIST_CONFIRMATION', { pg, pgName: productGroups.get(pg) })}
              </Typography>
            </Box>
          }
          primaryActionButton={{
            title: t('YES'),
            actionId: '',
            action: () => {
              setOpenDeleteConfirmation(false);
              handleDeleteChecklist();
            },
          }}
          discardButton={{
            title: t('NO'),
            action: () => {
              setOpenDeleteConfirmation(false);
            },
          }}
        />
      )}
    </>
  );
});

CheckList.displayName = 'CheckList';

export default CheckList;
