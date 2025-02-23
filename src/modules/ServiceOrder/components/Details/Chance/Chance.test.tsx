import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { useParams } from 'react-router-dom';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';

import Chance from './Chance';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

describe('Chance', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      onClose: jest.fn(),
    };

    (useParams as jest.Mock).mockReturnValue({ id: '1' });

    (useIndexedDbData as jest.Mock).mockReturnValue({
      dataList: [],
      getDataList: jest.fn(),
      updateDataLists: jest.fn(),
      filteredDataList: [],
      getFilteredDataList: jest.fn(),
      dataItem: {},
      getDataItem: jest.fn(),
    });

    return renderRootProvider(<Chance {...defaultProps} {...props} />);
  };

  it('should render the component', () => {
    renderComponent();

    expect(screen.getByLabelText('CREATE_NEW_CHANCE')).toBeInTheDocument();
  });

  it('should render the sections', () => {
    renderComponent();

    expect(screen.getByLabelText('chance-details')).toBeInTheDocument();
    expect(screen.getByLabelText('product-details')).toBeInTheDocument();
    expect(screen.getByLabelText('chance-history')).toBeInTheDocument();
  });

  it('should render the form fields', () => {
    renderComponent();

    expect(screen.getByLabelText('ADMINISTRATION')).toBeInTheDocument();
    expect(screen.getByLabelText('PRODUCT_GROUP')).toBeInTheDocument();
    expect(screen.getByLabelText('CATEGORY')).toBeInTheDocument();
  });

  it('should render the form buttons', () => {
    renderComponent();

    expect(screen.getByRole('button', { name: 'SAVE' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'DISCARD' })).toBeInTheDocument();
  });

  it('should call onClose when discard button is clicked', async () => {
    const onClose = jest.fn();

    renderComponent({ onClose });

    const buttonDiscard = screen.getByRole('button', { name: 'DISCARD' });

    await user.click(buttonDiscard);

    expect(onClose).toHaveBeenCalled();
  });

  it('should render add chance history modal when add new item is clicked', async () => {
    renderComponent();

    const buttonAddNew = screen.getByRole('button', { name: 'ADD_NEW_ITEM' });

    await user.click(buttonAddNew);

    expect(screen.getByLabelText('ADD_CHANCE_HISTORY')).toBeInTheDocument();
  });
});
