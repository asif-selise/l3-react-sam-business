import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import RsLineListTable from './RsLineListTable';

describe('RsLineListTable', () => {
  const mockedTableData = [
    {
      OrderNo: 1001,
      ManufacturerNo: 200,
      ProductGroupNo: 10,
      Challenge: 'Quality check',
      Remarks: 'All units passed the inspection',
      DoneBy: 'John Doe',
      DoneOn: '2024-11-01T10:30:00',
      Author: 'Jane Smith',
      RecordedBy: 'Alice Brown',
      RecordedOn: '2024-11-01T11:00:00',
      RslineId: 501,
    },
  ];

  const renderComponent = (props = {}) => {
    return renderRootProvider(<RsLineListTable data={mockedTableData} isLoading={false} />);
  };

  it('should render the table', () => {
    renderComponent();

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render the table headers', () => {
    renderComponent();

    expect(screen.getByText('ORDER_NO')).toBeInTheDocument();
    expect(screen.getByText('MANUFACTURER_NO')).toBeInTheDocument();
    expect(screen.getByText('PRODUCT_GROUP_NO')).toBeInTheDocument();
    expect(screen.getByText('CHALLENGE')).toBeInTheDocument();
    expect(screen.getByText('REMARKS')).toBeInTheDocument();
    expect(screen.getByText('DONE_BY')).toBeInTheDocument();
    expect(screen.getByText('DONE_ON')).toBeInTheDocument();
    expect(screen.getByText('AUTHOR')).toBeInTheDocument();
    expect(screen.getByText('RECORDED_BY')).toBeInTheDocument();
    expect(screen.getByText('RECORDED_ON')).toBeInTheDocument();
    expect(screen.getByText('RSLINE_ID')).toBeInTheDocument();
  });

  it('should render the table data', () => {
    renderComponent();

    const tableRows = screen.getAllByLabelText('rs-line-list-table-row');
    expect(tableRows).toHaveLength(1);
  });
});
