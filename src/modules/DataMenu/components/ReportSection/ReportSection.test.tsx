import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import ReportSection from './ReportSection';

describe('ReportSection Component', () => {
  const renderComponent = () => {
    return renderRootProvider(<ReportSection />);
  };

  test('renders ReportSection component', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: 'REPORTS_AND_TRACKING' })).toBeInTheDocument();

    expect(screen.getByText('ABSENCE_REPORTS')).toBeInTheDocument();
    expect(screen.getByText('CREDIT_TIME_RECORDING')).toBeInTheDocument();
    expect(screen.getByText('ABSENCE_REPORTS_AND_CREDIT_NOTES_OVERVIEW')).toBeInTheDocument();
  });
});
