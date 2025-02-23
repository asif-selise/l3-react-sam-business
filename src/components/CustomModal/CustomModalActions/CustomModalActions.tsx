import {
  Box,
  Button,
  DialogActions,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  type SxProps,
} from '@mui/material';
import { type StepDetails, type ModalActions } from '../types';

interface CustomModalActionsProps {
  actions: ModalActions[];
  stepDetails?: StepDetails;
  sx?: SxProps;
}

const CustomModalActions = ({ actions, stepDetails, sx }: CustomModalActionsProps) => {
  return (
    <DialogActions
      sx={{
        pt: 1.5,
        pb: 0.4,
        gap: 1.5,
        ...sx,
        justifyContent: stepDetails ? 'space-between' : 'flex-end',
      }}
    >
      {stepDetails && (
        <Stepper
          activeStep={stepDetails.activeStep}
          connector={<StepConnector sx={{ width: '16px' }} />}
        >
          {stepDetails.stepLabels?.map((label, index) => {
            return (
              <Step key={index} completed={stepDetails.completedSteps[index]}>
                <StepLabel StepIconProps={{ sx: { '&.Mui-completed': { color: 'success.main' } } }}>
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      )}

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant ?? 'contained'}
            color="primary"
            aria-label={action.label}
            onClick={action.onClick}
            disabled={action.disabled ?? false}
          >
            {action.label}
          </Button>
        ))}
      </Box>
    </DialogActions>
  );
};

export default CustomModalActions;
