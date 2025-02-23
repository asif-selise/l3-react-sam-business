import MeasurementConfirmationModal from './MeasurementConfirmationModal';
import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';

describe('MeasurementConfirmationModal', () => {
  test('should render InfoIcon component properly', () => {
    renderRootProvider(<MeasurementConfirmationModal />);

    expect(screen.getByTestId('HelpIcon')).toBeInTheDocument();
    expect(screen.getByText('PLEASE_CHECK_THE....POINTS')).toBeInTheDocument();
    expect(screen.getByText('NOT_RUNNING_AT_THE_MOMENT')).toBeInTheDocument();
    expect(screen.getByText('IF_YOU_CAN_ANSWER....START_THE_EXAM.')).toBeInTheDocument();
  });
});
