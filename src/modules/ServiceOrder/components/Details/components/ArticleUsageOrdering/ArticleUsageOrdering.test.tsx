import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import ArticleUsageOrdering from './ArticleUsageOrdering';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

describe('ArticleUsageOrdering', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {};
    (useIndexedDbData as jest.Mock).mockReturnValue({
      filteredDataList: [],
      getFilteredDataList: jest.fn().mockResolvedValue([]),
      dataList: [],
      getDataList: jest.fn().mockResolvedValue([]),
      isLoading: false,
    });
    return renderRootProvider(<ArticleUsageOrdering {...defaultProps} {...props} />);
  };

  it('should render the ArticleUsageOrdering component', () => {
    renderComponent();
    expect(screen.getByLabelText('Article Usage Ordering')).toBeInTheDocument();
  });
});
