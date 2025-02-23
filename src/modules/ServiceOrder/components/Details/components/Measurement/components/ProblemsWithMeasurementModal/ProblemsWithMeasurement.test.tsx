import ProblemsWithMeasurement from './ProblemsWithMeasurement';
import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';

describe('ProblemsWithMeasurement', () => {
  test('should render InfoIcon component properly', () => {
    renderRootProvider(<ProblemsWithMeasurement />);

    expect(screen.getByTestId('InfoIcon')).toBeInTheDocument();
    expect(screen.getByText('1_CLOSE_THIS_FORM')).toBeInTheDocument();
    expect(screen.getByText('OF_COURSE_WHEN_USING_THIS....')).toBeInTheDocument();
    expect(screen.getByText('IF_THE_MEASUREMENT_CANNOT_BE_STARTED....')).toBeInTheDocument();
  });
});
