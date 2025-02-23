import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import ViewOrdersListTable from './ViewOrdersListTable';
import { type TableData } from '@/src/components/CustomTable/types';

describe('ViewOrdersListTable', () => {
  const mockedTableData = [
    {
      IsNightOrder: false,
      IsBooked: true,
      OrderedDate: '2007-12-24T00:00:00',
      OrderId: null,
      SamOrderId: 6323,
      AppointmentDate: null,
      OrderedQuantity: 1.0,
      ReceivedQuantity: 1.0,
      ManufacturerId: 300,
      ManufacturerName: 'V-Zug',
      ManufacturerArticleNumber: 'W79368',
      ListPriceExclTax: 20.0743,
      DeliveryNumber: '39-149-760',
      SamOrderDetailId: 16445,
      IsPartialDelivery: false,
      ProductId: 608780,
      ProductDescription: 'Flachbandkabel 16pol.vorm N, S',
    },
  ];

  const renderComponent = (props = {}) => {
    return renderRootProvider(
      <ViewOrdersListTable
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

    expect(screen.getByText('NIGHT_DELIVERY')).toBeInTheDocument();
    expect(screen.getByText('ORDER_DATE')).toBeInTheDocument();
    expect(screen.getByText('ORDER_NUMBER')).toBeInTheDocument();
    expect(screen.getByText('SO_NUMBER')).toBeInTheDocument();
    expect(screen.getByText('APPOINTMENT_DATE')).toBeInTheDocument();
  });

  it('should render the table data', () => {
    renderComponent();

    const tableRows = screen.getAllByLabelText('view-orders-table-row');
    expect(tableRows).toHaveLength(1);
  });
});
