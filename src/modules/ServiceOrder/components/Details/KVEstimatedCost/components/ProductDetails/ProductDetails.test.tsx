import { screen, waitFor } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import ProductDetails from './ProductDetails';
import { type SamKv } from '@/src/hooks/useTourData/tourData.interface';
import { type TempTechnician } from '@/src/hooks/useMasterData/masterData.interface';

describe('ProductDetails', () => {
  const mockedDataKv: SamKv = {
    UId: '12345-abcde-67890-fghij',
    CalculationVersion: 1,
    CreatedAt: '2022-12-01T10:00:00Z',
    ChangedBy: 'John Doe',
    CustomerInformant: 'Jane Doe',
    CustomerName: 'ABC Corp',
    LifeTimeTravelCosts: 5000,
    LifeTimeVisitedWorkingTimeMin2: 1200,
    LifespanOperatingMinutes: 45000,
    OperatingCosts: 30000,
    OperatingCostsPerMinute: 0.67,
    OperatingMinutes: 5000,
    OperatingMinutesInVisit: 180,
    OrderId: 98765,
    OrderTakenBy: 'James Smith',
    ProcessingPercentage: 80,
    ReferralFrom: 101,
    ReleaseOn: '2023-05-15T09:00:00Z',
    Remarks: 'This is a sample remark.',
    TakenOverOn: '2023-06-01T12:30:00Z',
    SamKvId: 1001,
    SmallClientPercentage: 5,
    TechnicianId: 56789,
    UpdatedAt: '2023-06-15T15:00:00Z',
    VatRate: 19,
    CustomerInformedBy: 'Customer Service',
    CustomerInformedAt: '2023-06-20T10:00:00Z',
    ServiceOrderOfferNotificationId: 1234,
  };

  const mockedDataTechnician: TempTechnician = {
    Id: 1,
    TechnicianEmployeeNumber: 4,
    Name: 'Name1',
    FirstName: 'FirstName1',
    IsTechnician: true,
    IsInstaller: true,
    Branch: 1,
    IsInactive: true,
    SystemUserWithoutDomainT: 'SystemUser WithoutDomainT1',
    FullName: 'FullName1',
  };

  const renderComponent = (props = {}) => {
    const defaultProps = {
      dataKv: mockedDataKv,
      dataTechnician: mockedDataTechnician,
    };

    return renderRootProvider(<ProductDetails {...defaultProps} {...props} />);
  };

  test('renders product details correctly', async () => {
    renderComponent();

    waitFor(() => {
      expect(screen.findByText('CustomerName1')).toBeInTheDocument();
      expect(screen.findByText('OrderTakenBy1')).toBeInTheDocument();
      expect(screen.findByText('ReleaseOn1')).toBeInTheDocument();
    });
  });

  test('renders product details with default values', async () => {
    renderComponent({
      dataKv: null,
      dataTechnician: null,
    });

    waitFor(() => {
      expect(screen.findByText('-')).toBeInTheDocument();
    });
  });
});
