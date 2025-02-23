export interface ModalActions {
  label: string;
  variant?: 'text' | 'outlined' | 'contained' | 'soft';
  onClick: () => void;
  disabled?: boolean;
}

export interface StepDetails {
  activeStep: number;
  stepLabels: string[];
  completedSteps: Record<number, boolean>;
}

export interface ModalDetails {
  name: string;
  title: string;
  actions: ModalActions[];
}
