import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import QRCodeHistory from './QRCodeHistory';

describe('QRCodeHistory Component', () => {
  const online = false;

  const mockFilterData = {
    TopRecordNumber: 50,
    IsInactive: null,
    ObjectId: null,
    ApartmentId: null,
    SerialNumber: null,
    Filter: null,
  };

  const renderComponent = (props = {}) => {
    const defaultProps = {
      online,
      data: [],
      isLoading: false,
      qrFilters: mockFilterData,
    };

    return renderRootProvider(<QRCodeHistory {...defaultProps} {...props} />);
  };

  test('renders QRCodeHistory component', () => {
    renderComponent();

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.queryAllByLabelText('qr-code-history-row')).toHaveLength(0);
  });
});
