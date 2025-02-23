import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import Sak7000ListTable from './Sak7000ListTable';

describe('Sak7000ListTable', () => {
  const mockedTableData = [
    {
      Source: 'Sensor A',
      Quality: 95,
      ID: 1,
      Text1: 'Data received successfully',
      Text2: 'Temperature stable at 22°C',
    },
    {
      Source: 'Sensor B',
      Quality: 88,
      ID: 2,
      Text1: 'Warning: Low battery',
      Text2: 'Battery level at 20%',
    },
  ];

  const renderComponent = (props = {}) => {
    return renderRootProvider(<Sak7000ListTable data={mockedTableData} isLoading={false} />);
  };

  it('should render the table', () => {
    renderComponent();

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render the table headers', () => {
    renderComponent();

    expect(screen.getByText('SOURCE')).toBeInTheDocument();
    expect(screen.getByText('QUALITY')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('TEXT_1')).toBeInTheDocument();
    expect(screen.getByText('TEXT_2')).toBeInTheDocument();
  });

  it('should render the table data', () => {
    renderComponent();

    const tableRows = screen.getAllByLabelText('sak-7000-list-table-row');
    expect(tableRows).toHaveLength(2);
  });
});
