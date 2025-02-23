import { getDate } from '@/src/helpers/formatDate';
import { type TempTechnician } from '@/src/hooks/useMasterData/masterData.interface';
import { type SamKv } from '@/src/hooks/useTourData/tourData.interface';
import { Grid, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  dataKv: SamKv | null | undefined;
  dataTechnician: TempTechnician | null;
}

const ProductDetails = ({ dataKv, dataTechnician }: Props) => {
  const { t } = useTranslation('index');

  return (
    <Grid container spacing={4}>
      <Grid item mobile={4}>
        <TextField
          value={dataTechnician?.FullName ?? '-'}
          fullWidth
          disabled
          label={`${t('TECHNICIAN')}`}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

      <Grid item mobile={4}>
        <TextField
          value={dataKv?.OrderId ?? '-'}
          fullWidth
          disabled
          label={`${t('SO')}`}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

      <Grid item mobile={4}>
        <TextField
          value={dataKv?.SamKvId ?? '-'}
          fullWidth
          disabled
          label={`${t('ID')}`}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

      <Grid item mobile={4}>
        <TextField
          value={dataKv?.CreatedAt ? getDate(dataKv?.CreatedAt) : '-'}
          fullWidth
          disabled
          label={`${t('CREATED_ON')}`}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

      <Grid item mobile={4}>
        <TextField
          value={dataKv?.UpdatedAt ? getDate(dataKv?.UpdatedAt) : '-'}
          fullWidth
          disabled
          label={`${t('MODIFIED_ON')}`}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

      <Grid item mobile={4}>
        <TextField
          value={dataKv?.ChangedBy ?? '-'}
          fullWidth
          disabled
          label={`${t('MODIFIED_BY')}`}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

      <Grid item mobile={4}>
        <TextField
          value={dataKv?.OrderTakenBy ?? '-'}
          fullWidth
          disabled
          label={`${t('RETRIEVED_BY')}`}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

      <Grid item mobile={4}>
        <TextField
          value={dataKv?.TakenOverOn ? getDate(dataKv?.TakenOverOn) : '-'}
          fullWidth
          disabled
          label={`${t('RETRIEVED_ON')}`}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

      <Grid item mobile={4}>
        <TextField
          value={dataKv?.ReleaseOn ? getDate(dataKv?.ReleaseOn) : '-'}
          fullWidth
          disabled
          label={`${t('RELEASE_ON')}`}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ProductDetails;
