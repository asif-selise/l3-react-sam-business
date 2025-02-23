import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { type TableData } from '@/src/components/CustomTable/types';
import TourSheetAndArpListTable from './TourSheetAndArpListTable';

describe('TourSheetAndArpListTable', () => {
  const mockedTableData = [
    {
      Day: 'Mi',
      Date: '19.06.2024',
      Status: 'Tourenblatt',
      Text: '[06:00] Ferien\r\n\r\n[06:30] Ferien\r\n\r\n[07:00] Ferien\r\n\r\n[07:30] Ferien\r\n\r\n[08:00] Ferien\r\n\r\n[09:00] Ferien\r\n\r\n[10:00] Ferien\r\n\r\n[11:00] Ferien\r\n\r\n[11:30] Ferien\r\n\r\n[12:00] Ferien\r\n\r\n[13:00] Ferien\r\n\r\n[13:30] Ferien\r\n\r\n[14:00] Ferien\r\n\r\n[15:00] Ferien\r\n\r\n[16:00] Ferien\r\n\r\n[17:00] Ferien\r\n\r\n[18:00] Ferien\r\n\r\n[19:00] Ferien',
      IsRouteSheet: true,
      IsARP: false,
    },
  ];

  const renderComponent = (props = {}) => {
    return renderRootProvider(
      <TourSheetAndArpListTable
        data={(mockedTableData as unknown as TableData[]) ?? []}
        isLoading={false}
      />
    );
  };

  it('should render the table', () => {
    renderComponent();

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render the table headers', () => {
    renderComponent();

    expect(screen.getByText('DAY')).toBeInTheDocument();
    expect(screen.getByText('DATE')).toBeInTheDocument();
    expect(screen.getByText('STATUS')).toBeInTheDocument();
    expect(screen.getByText('TEXT')).toBeInTheDocument();
  });

  it('should render the table data', () => {
    renderComponent();

    const tableRows = screen.getAllByLabelText('tour-sheet-and-arp-list-table-table-row');
    expect(tableRows).toHaveLength(1);
  });
});
