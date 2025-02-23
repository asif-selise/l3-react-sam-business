import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MessageListComponent from './components/MessageListComponent/MessageListComponent';
import AdditionalText from './components/AdditionalText/AdditionalText';
import { useEffect, type SetStateAction } from 'react';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { type AutoText } from '@/src/hooks/useMasterData/masterData.interface';
import { COMMON } from '@/src/hooks/useCustomTheme/colors/commonColorPalette';

interface Props {
  selectedMeasure: string;
  selectedErrorType: string;
  selectedFaultLocation: string;
  selectedAdditionalText: string;
  setSelectedMeasure: React.Dispatch<SetStateAction<string>>;
  setSelectedErrorType: React.Dispatch<SetStateAction<string>>;
  setSelectedFaultLocation: React.Dispatch<SetStateAction<string>>;
  setSelectedAdditionalText: React.Dispatch<SetStateAction<string>>;
  isEBSO: boolean;
  type: 'report' | 'invoice';
}

const AddMessage = ({
  selectedMeasure,
  selectedErrorType,
  selectedFaultLocation,
  selectedAdditionalText,
  setSelectedMeasure,
  setSelectedErrorType,
  setSelectedFaultLocation,
  setSelectedAdditionalText,
  isEBSO,
  type,
}: Props) => {
  const { t } = useTranslation('index');

  const { dataList: autoTextData, getDataList: getAutoTexts } = useIndexedDbData<AutoText>(
    'MasterData',
    'AutoTexts'
  );

  useEffect(() => {
    getAutoTexts();
  }, []);

  const groups = type === 'invoice' ? [4] : [4, 5];
  const subgroups = isEBSO ? [2, 3] : [1, 3];

  const faultLocationAutoTexts = autoTextData.filter(
    (x) => x.Group === 1 && subgroups.includes(x.SubGroup ?? 3) && x.Name?.trim().length > 0
  );
  const errorTypeAutoTexts = autoTextData.filter(
    (x) => x.Group === 2 && subgroups.includes(x.SubGroup ?? 3) && x.Name?.trim().length > 0
  );
  const measureAutoTexts = autoTextData.filter(
    (x) => x.Group === 3 && subgroups.includes(x.SubGroup ?? 3) && x.Name?.trim().length > 0
  );
  const additionalTextAutoTexts = autoTextData
    .filter(
      (x) =>
        groups.includes(x.Group) && subgroups.includes(x.SubGroup ?? 3) && x.Name?.trim().length > 0
    )
    .sort((a, b) => a.Name.localeCompare(b.Name));

  return (
    <Box p={'0px 16px 16px 16px'}>
      <Box
        display={'flex'}
        columnGap={2}
        p={1.5}
        mb={3}
        bgcolor={COMMON.grey[100]}
        borderRadius={1}
      >
        <Typography variant={'subtitle1'}>{t('SELECTED_MESSAGES')}</Typography>
        <Typography variant={'body1'}>
          {selectedFaultLocation} {selectedErrorType} {selectedMeasure} {selectedAdditionalText}
        </Typography>
      </Box>
      <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
        <Box width={'32%'}>
          <MessageListComponent
            title={t('FAULT_LOCATION')}
            messageList={faultLocationAutoTexts}
            selectedItem={selectedFaultLocation}
            setSelectedItem={setSelectedFaultLocation}
          />
        </Box>
        <Box width={'32%'}>
          <MessageListComponent
            title={t('ERROR_TYPE')}
            messageList={errorTypeAutoTexts}
            selectedItem={selectedErrorType}
            setSelectedItem={setSelectedErrorType}
          />
        </Box>
        <Box width={'32%'}>
          <MessageListComponent
            title={t('MEASURE')}
            messageList={measureAutoTexts}
            selectedItem={selectedMeasure}
            setSelectedItem={setSelectedMeasure}
          />
        </Box>
      </Box>
      <Box mt={3}>
        <AdditionalText
          additionalTextList={additionalTextAutoTexts}
          selectedItem={selectedAdditionalText}
          setSelectedItem={setSelectedAdditionalText}
        />
      </Box>
    </Box>
  );
};

export default AddMessage;
