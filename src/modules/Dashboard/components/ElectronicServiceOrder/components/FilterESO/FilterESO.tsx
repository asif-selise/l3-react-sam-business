import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import CustomDropdown from '@/src/components/CustomDropdown/CustomDropdown';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { type ESOFilterFields } from '../../types';
import { SPECIAL, BRANCH } from '../../types';
import Iconify from '@/src/components/iconify/iconify';

interface Props {
  anchorEl: HTMLElement;
  onClose: () => void;
  onApply: (filterData: ESOFilterFields) => void;
  filterData: ESOFilterFields;
}

const FilterESO = ({ anchorEl, onClose, onApply, filterData }: Props) => {
  const { t } = useTranslation('index');

  const { register, control, handleSubmit } = useForm<ESOFilterFields>({
    mode: 'onTouched',
    defaultValues: filterData,
  });

  const onSubmit: SubmitHandler<ESOFilterFields> = (formData) => {
    onApply(formData);
  };

  const StyledAccordion = styled(Accordion)({
    border: '1px solid #919eab33',
    borderRadius: '8px',
    marginBottom: '16px',
    '&::before': { opacity: 0 },
    '& .MuiAccordionSummary-root': { minHeight: '32px' },
    '& .MuiAccordionSummary-content': { margin: '8px 0' },
  });

  return (
    <CustomDropdown
      anchorEl={anchorEl}
      onClose={onClose}
      header={{
        title: t('FILTERS'),
        button: { label: t('APPLY'), action: handleSubmit(onSubmit) },
      }}
      sxPaper={{ width: '25vw' }}
    >
      <StyledAccordion>
        <AccordionSummary expandIcon={<Iconify icon="ic:round-expand-more" width={24} />}>
          <Typography variant="body2">
            {t('SPECIAL') + ': ' + (filterData.Special ? `${filterData.Special}` : '')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Controller
            name="Special"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                value={field.value ?? ''}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
              >
                {SPECIAL.map((item) => (
                  <FormControlLabel
                    key={item.id}
                    value={item.value}
                    control={<Radio />}
                    label={<Typography variant="body2">{t(item.value)}</Typography>}
                  />
                ))}
              </RadioGroup>
            )}
          />
        </AccordionDetails>
      </StyledAccordion>

      <StyledAccordion>
        <AccordionSummary expandIcon={<Iconify icon="ic:round-expand-more" width={24} />}>
          <Typography variant="body2">
            {t('BRANCH') + ': ' + (filterData.Branch ? `${filterData.Branch}` : '')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Controller
            name="Branch"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                value={field.value ?? ''}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
              >
                {BRANCH.map((item) => (
                  <FormControlLabel
                    key={item.id}
                    value={item.value}
                    control={<Radio />}
                    label={<Typography variant="body2">{t(item.value)}</Typography>}
                  />
                ))}
              </RadioGroup>
            )}
          />
        </AccordionDetails>
      </StyledAccordion>

      <Controller
        name="RepSO"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value} />}
            label={t('Rep -SO / also search for an offer')}
          />
        )}
      />

      <TextField
        {...register('EsoID')}
        label={t('ESO_ID')}
        variant="outlined"
        size="small"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        {...register('SO')}
        label={t('SO')}
        variant="outlined"
        size="small"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        {...register('Remarks')}
        label={t('REMARKS')}
        variant="outlined"
        size="small"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
    </CustomDropdown>
  );
};

export default FilterESO;
