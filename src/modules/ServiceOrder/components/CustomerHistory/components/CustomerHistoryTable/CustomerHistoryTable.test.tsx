import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import CustomerHistoryTable from './CustomerHistoryTable';

describe('CustomerHistoryTable', () => {
  const mockedTableData = [
    {
      OrderId: '1',
      ManagementId: '1',
      CreatedAt: '2022-01-01',
    },

    {
      OrderId: '2',
      ManagementId: '2',
      CreatedAt: '2022-01-02',
    },
  ];

  const renderComponent = (props = {}) => {
    const defaultProps = {
      data: mockedTableData,
      isLoading: false,
    };

    return renderRootProvider(<CustomerHistoryTable {...defaultProps} {...props} />);
  };

  it('should render the table', () => {
    renderComponent();

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render the table headers', () => {
    renderComponent();

    expect(screen.getByText('SO_NR')).toBeInTheDocument();
    expect(screen.getByText('KD_NR')).toBeInTheDocument();
    expect(screen.getByText('MANUFACTURER')).toBeInTheDocument();
  });
});
