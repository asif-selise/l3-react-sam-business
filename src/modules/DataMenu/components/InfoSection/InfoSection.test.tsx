import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import InfoSection from './InfoSection';

jest.mock('./components/InventoryLists/InventoryLists', () => {
  const InventoryLists = () => <div>InventoryLists</div>;
  return InventoryLists;
});

jest.mock('./components/PrintSetupLists/PrintSetupLists', () => {
  const PrintSetupLists = () => <div>PrintSetupLists</div>;
  return PrintSetupLists;
});

jest.mock('./components/TourSheetAndArpDates/TourSheetAndArpDates', () => {
  const TourSheetAndArpDates = () => <div>TourSheetAndArpDates</div>;
  return TourSheetAndArpDates;
});

jest.mock('./components/QrCodeInfo/QrCodeInfo', () => {
  const QrCodeInfo = () => <div>QrCodeInfo</div>;
  return QrCodeInfo;
});

describe('InfoSection Component', () => {
  const renderComponent = () => {
    return renderRootProvider(<InfoSection />);
  };

  test('renders InfoSection component', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: 'INFORMATION_AND_SEARCH' })).toBeInTheDocument();

    expect(screen.getByText('TOUR_SHEET_AND_ARP_DATES')).toBeInTheDocument();
    expect(screen.getByText('WAREHOUSE_STOCK_REPORT')).toBeInTheDocument();
    expect(screen.getByText('QR_CODE_INFO')).toBeInTheDocument();
    expect(screen.getByText('PRINT_SETUP_LISTS')).toBeInTheDocument();
  });
});
