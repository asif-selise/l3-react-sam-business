import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import DataMenu from './DataMenu';
import '@testing-library/jest-dom';
import { useParams } from 'react-router-dom';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

jest.mock('./components/InfoSection/InfoSection', () => {
  const MockInfoSection = () => <div data-testid="info-section">INFORMATION_AND_SEARCH</div>;
  MockInfoSection.displayName = 'MockInfoSection';
  return MockInfoSection;
});

describe('DataMenu Component', () => {
  const renderComponent = () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });

    (useIndexedDbData as jest.Mock).mockReturnValue({
      filteredDataList: [],
      getFilteredDataList: jest.fn().mockResolvedValue([]),
      dataList: [],
      getDataList: jest.fn().mockResolvedValue([]),
      isLoading: false,
    });

    return renderRootProvider(<DataMenu />);
  };

  test('renders DataMenu component', () => {
    renderComponent();

    expect(screen.getByText('DATA_OVERVIEW')).toBeInTheDocument();

    expect(screen.getByText('INFORMATION_AND_SEARCH')).toBeInTheDocument();
    expect(screen.getByText('ORDERS_AND_RECEIPTS')).toBeInTheDocument();
    expect(screen.getByText('REPORTS_AND_TRACKING')).toBeInTheDocument();
    expect(screen.getAllByText('SETTINGS')).toHaveLength(2);
  });
});
