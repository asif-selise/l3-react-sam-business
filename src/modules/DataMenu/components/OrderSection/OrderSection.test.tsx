import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import OrderSection from './OrderSection';

describe('OrderSection Component', () => {
  const renderComponent = () => {
    return renderRootProvider(<OrderSection />);
  };

  test('renders OrderSection component', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: 'ORDERS_AND_RECEIPTS' })).toBeInTheDocument();

    expect(screen.getByText('POST_GOODS_RECEIPTS_FOR_OVERNIGHT_DELIVERIES')).toBeInTheDocument();
    expect(screen.getByText('ORDERS_WGA')).toBeInTheDocument();
    expect(screen.getByText('VIEW_ORDERS')).toBeInTheDocument();
  });
});
