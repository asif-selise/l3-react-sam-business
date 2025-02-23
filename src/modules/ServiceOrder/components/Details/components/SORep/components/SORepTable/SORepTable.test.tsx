import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import SORepTable from './SORepTable';

const MockTableData = [
  {
    SpecialOffer: 'Offer1',
    ErrorReportOffer: 'Error1',
    ManufacturerId: 1,
  },
  {
    SpecialOffer: 'Offer2',
    ErrorReportOffer: 'Error2',
    ManufacturerId: 2,
  },
];

describe('SORepTable component', () => {
  test('renders table rows correctly when data is provided', () => {
    renderRootProvider(
      <SORepTable data={MockTableData} isLoading={false} onSORepTableRowClick={jest.fn()} />
    );

    expect(screen.getByText('OFFER')).toBeInTheDocument();
    expect(screen.getByText('ERROR_REPORT_OFFER')).toBeInTheDocument();
    expect(screen.getByText('MANUFACTURER')).toBeInTheDocument();

    MockTableData.forEach((row) => {
      expect(screen.getByText(String(row.SpecialOffer))).toBeInTheDocument();
      expect(screen.getByText(String(row.ErrorReportOffer))).toBeInTheDocument();
      expect(screen.getByText(String(row.ManufacturerId))).toBeInTheDocument();
    });
  });
});
