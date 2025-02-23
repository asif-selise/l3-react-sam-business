import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import WoodOrderDetailsTable from './components/WoodOrderDetailsTable/WoodOrderDetailsTable';
import { type SelectedWoodOrderDetails } from '../../WoodOrderDetails';

interface Props {
  selectedWoodOrderID: number | null;
  selectedWoodOrderDetails: SelectedWoodOrderDetails | undefined;
  setSelectedWoodOrderDetails: React.Dispatch<
    React.SetStateAction<SelectedWoodOrderDetails | undefined>
  >;
  showEditMode?: boolean;
  completionStatus: boolean;
}

const Details = ({
  selectedWoodOrderID,
  selectedWoodOrderDetails,
  setSelectedWoodOrderDetails,
  showEditMode = true,
  completionStatus,
}: Props) => {
  const { t } = useTranslation('index');

  return (
    <Box
      aria-label="Wood Order Details Table"
      sx={{
        width: '100%',
        borderRadius: 2,
        boxShadow: `0 -12px 24px -4px rgba(145, 158, 171, 0.12)`,
      }}
    >
      <Typography p={'24px'} variant="h6" color={'text.primary'}>
        {t('DETAILS')}
      </Typography>
      <WoodOrderDetailsTable
        selectedWoodOrderID={selectedWoodOrderID}
        selectedWoodOrderDetails={selectedWoodOrderDetails}
        setSelectedWoodOrderDetails={setSelectedWoodOrderDetails}
        showEditMode={showEditMode}
        completionStatus={completionStatus}
      />
    </Box>
  );
};

export default Details;
