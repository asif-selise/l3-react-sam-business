import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import ServiceOrder from './ServiceOrder';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import configureMockStore from 'redux-mock-store';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () => {
  return jest.fn().mockReturnValue({
    dataItem: {},
    getDataItem: jest.fn().mockResolvedValue({}),
    dataList: [],
    getDataList: jest.fn().mockResolvedValue([]),
    getFilteredDataList: jest.fn().mockResolvedValue([]),
  });
});

jest.mock('react-router-dom', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock('@/src/hooks/useManageSoStatus/useManageSoStatus');

jest.mock('@/src/hooks/useAutoSync/useAutoSync.hook', () => {
  return jest.fn().mockReturnValue({
    syncNeeded: jest.fn().mockResolvedValue(false),
  });
});

jest.mock('./components/Details/Details', () => {
  const Mock = () => <div data-testid="service-order-details">Service Order Details</div>;
  Mock.displayName = 'ServiceOrderDetails';
  return Mock;
});

jest.mock('./components/ESOHistory/ESOHistory', () => {
  const Mock = () => <div aria-label="ESO History">ESO History</div>;
  Mock.displayName = 'ESOHistory';
  return Mock;
});

jest.mock('./components/CustomerHistory/CustomerHistory', () => {
  const Mock = () => <div aria-label="Customer History">Customer History</div>;
  Mock.displayName = 'CustomerHistory';
  return Mock;
});

jest.mock('./components/SODocuments/SODocuments', () => {
  const Mock = () => <div aria-label="SO Documents">SO Documents</div>;
  Mock.displayName = 'SODocuments';
  return Mock;
});

jest.mock('./components/Checklist/Checklist', () => {
  const Mock = () => <div aria-label="Checklist">Checklist</div>;
  Mock.displayName = 'Checklist';
  return Mock;
});

jest.mock('./components/Photo/Photo', () => {
  const Mock = () => <div aria-label="Photo">Photo</div>;
  Mock.displayName = 'Photo';
  return Mock;
});

jest.mock('./components/QRCode/QRCode', () => {
  const Mock = () => <div aria-label="QRCode">QRCode</div>;
  Mock.displayName = 'QRCode';
  return Mock;
});

jest.mock('./components/WoodOrderDetails/WoodOrderDetails', () => {
  const Mock = () => <div aria-label="WoodOrderDetails">WoodOrderDetails</div>;
  Mock.displayName = 'WoodOrderDetails';
  return Mock;
});

describe('Testing ServiceOrder component', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {};

    const store = configureMockStore()({
      serviceOrder: {
        id: 1,
      },
      soStatus: {
        soStatus: 'ReadOnly',
      },
    });

    return renderRootProvider(<ServiceOrder {...defaultProps} {...props} />, { store });
  };

  test('should render the CustomBreadcrumbs and Tabs properly ', () => {
    renderComponent();

    expect(screen.getByText('DASHBOARD')).toBeInTheDocument();
    expect(screen.getByText('ESO_HISTORY')).toBeInTheDocument();
    expect(screen.getByText('SO_DOCUMENTS')).toBeInTheDocument();
  });

  test('should switch tabs correctly', () => {
    renderComponent();

    const detailsComponent = screen.getByText('Service Order Details');
    expect(detailsComponent).toBeInTheDocument();

    const esoHistoryTab = screen.getByText('ESO_HISTORY');
    fireEvent.click(esoHistoryTab);

    const esoHistoryComponent = screen.getByLabelText('ESO History');

    expect(esoHistoryComponent).toBeInTheDocument();
    expect(detailsComponent).not.toBeInTheDocument();
  });
});
