import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { screen } from '@testing-library/react';
import Details from './Details';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import configureMockStore from 'redux-mock-store';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

jest.mock('./components/ServiceOrderDetails/ServiceOrderDetails', () => {
  const Mock = () => <div data-testid="service-order-details">Service Order Details</div>;
  Mock.displayName = 'ServiceOrderDetails';
  return Mock;
});

jest.mock('./components/PersonalExpenses/PersonalExpenses', () => {
  const Mock = () => null;
  Mock.displayName = 'PersonalExpenses';
  return Mock;
});

jest.mock('./components/CustomerDetails/CustomerDetails', () => {
  const Mock = () => <div data-testid="customer-details">Customer Details</div>;
  Mock.displayName = 'CustomerDetails';
  return Mock;
});

jest.mock('./components/DeviceDetails/DeviceDetails', () => {
  const Mock = () => null;
  Mock.displayName = 'DeviceDetails';
  return Mock;
});

jest.mock('./components/ServiceOrderArticle/ServiceOrderArticle', () => {
  const Mock = () => null;
  Mock.displayName = 'ServiceOrderArticle';
  return Mock;
});

jest.mock('./components/ArticleUsageOrdering/ArticleUsageOrdering', () => {
  const Mock = () => null;
  Mock.displayName = 'ArticleUsageOrdering';
  return Mock;
});

jest.mock('./components/SORep/SORep', () => {
  const Mock = () => null;
  Mock.displayName = 'SORep';
  return Mock;
});

jest.mock('./components/Message/Message', () => {
  const Mock = () => null;
  Mock.displayName = 'Message';
  return Mock;
});

jest.mock('./components/ExpenseCalculator/ExpenseCalculator', () => {
  const Mock = () => null;
  Mock.displayName = 'ExpenseCalculator';
  return Mock;
});

jest.mock('./components/Offer/Offer', () => {
  const Mock = () => null;
  Mock.displayName = 'Offer';
  return Mock;
});

jest.mock('./KVEstimatedCost/KVEstimatedCost', () => {
  const Mock = () => null;
  Mock.displayName = 'KVEstimatedCost';
  return Mock;
});

jest.mock('./components/WoodOrderModal/WoodOrderModal', () => {
  const Mock = () => null;
  Mock.displayName = 'WoodOrderModal';
  return Mock;
});

jest.mock('react', () => {
  const originalReact = jest.requireActual('react');

  return {
    ...originalReact,
    useState: (intialValue: unknown) => {
      if (intialValue === false) {
        return [true, jest.fn()];
      }
      return originalReact.useState(intialValue);
    },
  };
});

describe('Testing Details component', () => {
  const renderComponent = (props = {}, storeProps = {}) => {
    (useIndexedDbData as jest.Mock).mockReturnValue({
      dataItem: {},
      getDataItem: jest.fn().mockResolvedValue({}),
      dataList: [],
      getDataList: jest.fn().mockResolvedValue([]),
      getFilteredDataList: jest.fn().mockResolvedValue([]),
    });

    const store = configureMockStore()({
      serviceOrder: {
        id: 1,
      },
      soStatus: {
        soStatus: 'ReadOnly',
      },
      ...storeProps,
    });

    const defaultProps = {
      statusChangeCallback: jest.fn(),
      setDetailsPageDataLoaded: jest.fn(),
    };

    return renderRootProvider(<Details {...defaultProps} {...props} />, { store });
  };

  test('should render service order and customer details component properly', () => {
    renderComponent();
    expect(screen.getByTestId('service-order-details')).toBeInTheDocument();
    expect(screen.getByTestId('customer-details')).toBeInTheDocument();
    expect(screen.getByText('Service Order Details')).toBeInTheDocument();
    expect(screen.getByText('Customer Details')).toBeInTheDocument();
  });

  test('should render readonly message when soStatus is ReadOnly', () => {
    renderComponent();
    expect(screen.getByText('SO_ORDER_READ_ONLY_MESSAGE')).toBeInTheDocument();
  });

  test('should  render Modified message when soStatus is Modified', () => {
    renderComponent({}, { soStatus: { soStatus: 'Modified' } });
    expect(screen.queryByText('SO_ORDER_MODIFIED_MESSAGE')).toBeInTheDocument();
  });
});
