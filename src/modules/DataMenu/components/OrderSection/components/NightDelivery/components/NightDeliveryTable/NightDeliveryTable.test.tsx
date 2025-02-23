import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import NightDeliveryTable from './NightDeliveryTable';

describe('NightDeliveryTable', () => {
  const mockedTableData = [
    {
      id: 1,
      bestDat: 'bestDat1',
      bestNr: 'bestNr1',
      soNr: 'soNr1',
      tourAm: 'tourAm1',
      sWGA: true,
      herstNr: 'herstNr1',
      manufacturer: 'manufacturer1',
    },
    {
      id: 2,
      bestDat: 'bestDat2',
      bestNr: 'bestNr2',
      soNr: 'soNr2',
      tourAm: 'tourAm2',
      sWGA: false,
      herstNr: 'herstNr2',
      manufacturer: 'manufacturer2',
    },
  ];

  const mockFilters = {
    orderNo: 'orderNo',
    manufacturer: 'manufacturer',
    so: 'so',
    articleNo: 'articleNo',
    articleRef: 'articleRef',
  };

  const mockOnEsoClick = jest.fn();
  const mockOnEditClick = jest.fn();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      data: mockedTableData,
      isLoading: false,
      filters: mockFilters,
      onEsoClick: mockOnEsoClick,
      onEditClick: mockOnEditClick,
    };

    return renderRootProvider(<NightDeliveryTable {...defaultProps} {...props} />);
  };

  it('should render the table', () => {
    renderComponent();

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render the table headers', () => {
    renderComponent();

    expect(screen.getByText('BEST_DAT')).toBeInTheDocument();
    expect(screen.getByText('BEST_NR_S7000')).toBeInTheDocument();
    expect(screen.getByText('SO_NR')).toBeInTheDocument();
    expect(screen.getByText('TOUR_AM')).toBeInTheDocument();
    expect(screen.getByText('S_WGA')).toBeInTheDocument();
  });

  it('should render the table data', () => {
    renderComponent();

    const tableRows = screen.getAllByLabelText('night-delivery-table-row');
    expect(tableRows).toHaveLength(2);
  });
});
