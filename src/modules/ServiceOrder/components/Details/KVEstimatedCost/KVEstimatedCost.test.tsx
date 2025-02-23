import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';

import KVEstimatedCost from './KVEstimatedCost';
import { useParams } from 'react-router-dom';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('@/src/helpers/formatDateByLuxon', () => ({
  getMillis: jest.fn().mockReturnValue(1483369),
  getUtcCurrentDateTime: jest.fn().mockReturnValue('2021-08-27T00:00:00.000Z'),
}));

describe('KVEstimatedCost', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      isItNewKv: false,
      setIsItNewKv: jest.fn(),
      soRep: 1,
      onClose: jest.fn(),
    };

    (useParams as jest.Mock).mockReturnValue({ id: '1' });

    (useIndexedDbData as jest.Mock).mockReturnValue({
      filteredDataList: [],
      getFilteredDataList: jest.fn().mockResolvedValue([]),
      dataList: [],
      getDataList: jest.fn().mockResolvedValue([]),
      isLoading: false,
    });

    return renderRootProvider(<KVEstimatedCost {...defaultProps} {...props} />);
  };

  it('should render the modal', () => {
    renderComponent();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should render the title', () => {
    renderComponent();

    expect(screen.getByText('KV_ESTIMATED_COST')).toBeInTheDocument();
  });
});
