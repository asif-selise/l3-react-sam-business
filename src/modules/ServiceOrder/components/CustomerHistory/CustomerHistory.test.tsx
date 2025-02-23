import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { useParams } from 'react-router-dom';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';

import CustomerHistory from './CustomerHistory';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

describe('CustomerHistory', () => {
  const mockedSoDetailsData = {
    CustomerStreet: 'Test Street',
    CustomerZipCityId: 12345,
    ProductGroup: 1,
  };

  const mockedProductGroups = [
    {
      id: 1,
      ProductGroupId: 1,
      ProductGroupName: 'Test Product Group',
    },
  ];

  const renderComponent = (props = {}) => {
    const defaultProps = {};

    (useParams as jest.Mock).mockReturnValue({ id: '1' });

    (useIndexedDbData as jest.Mock).mockReturnValue({
      dataItem: mockedSoDetailsData,
      getDataItem: jest.fn(),
      dataList: mockedProductGroups,
      getDataList: jest.fn(),
    });

    return renderRootProvider(<CustomerHistory {...defaultProps} {...props} />);
  };

  it('should render the CustomerHistory component', () => {
    renderComponent();

    expect(screen.getByLabelText('customer-history')).toBeInTheDocument();
  });

  it('should render the CustomerHistoryTable component', () => {
    renderComponent();

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render the CustomerHistoryFilter component', () => {
    renderComponent();

    expect(screen.getByLabelText('customer-history-filter')).toBeInTheDocument();
  });

  it('should render the CustomerHistoryFilter fields', () => {
    renderComponent();

    expect(screen.getByLabelText('CUSTOMER_STREET')).toBeInTheDocument();
    expect(screen.getByLabelText('CUSTOMER_POSTCODE')).toBeInTheDocument();
    expect(screen.getByLabelText('PRODUCT_GROUP')).toBeInTheDocument();
  });

  it('should clear the filter fields when the clear filter button is clicked', async () => {
    renderComponent();

    await user.type(screen.getByLabelText('CUSTOMER_STREET'), 'Sankt Gallerstrasse');
    await user.type(screen.getByLabelText('CUSTOMER_POSTCODE'), '8716');

    await user.click(screen.getByRole('button', { name: 'CLEAR' }));

    expect(screen.getByLabelText('CUSTOMER_STREET')).toHaveValue('');
    expect(screen.getByLabelText('CUSTOMER_POSTCODE')).toHaveValue('');
  });
});
