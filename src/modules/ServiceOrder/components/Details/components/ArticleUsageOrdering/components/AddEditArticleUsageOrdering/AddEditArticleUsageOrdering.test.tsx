import { screen, waitFor } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import AddEditArticleUsageOrdering, {
  type AddEditArticleUsageOrderingProps,
} from './AddEditArticleUsageOrdering';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockReturnValue({ id: '22546681' }),
}));

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () =>
  jest.fn().mockReturnValue({
    filteredDataList: [],
    getFilteredDataList: jest.fn().mockResolvedValue([]),
    dataList: [],
    getDataList: jest.fn().mockResolvedValue([]),
    customFilteredDataList: [],
    getCustomFilteredDataList: jest.fn().mockResolvedValue([]),
    isLoading: false,
  })
);

describe('AddEditArticleUsageOrdering', () => {
  const renderComponent = (props = {}) => {
    const defaultProps: AddEditArticleUsageOrderingProps = {
      onSubmitForm: jest.fn(),
      type: 'add',
      showAllSourceStocks: false,
    };

    return renderRootProvider(<AddEditArticleUsageOrdering {...defaultProps} {...props} />);
  };

  it('should render the component', () => {
    renderComponent();

    expect(screen.getByLabelText('Edit Article Usage Ordering Modal')).toBeInTheDocument();
  });

  it('should render the form fields', () => {
    renderComponent();

    waitFor(() => {
      expect(screen.getByLabelText('ARTICLE_NO')).toBeInTheDocument();
      expect(screen.getByLabelText('ARTICLE_DESCRIPTION')).toBeInTheDocument();
      expect(screen.getByLabelText('ANZ')).toBeInTheDocument();
      expect(screen.getByLabelText('GROSS_INCL')).toBeInTheDocument();
      expect(screen.getByLabelText('GROSS_EXCL')).toBeInTheDocument();
    });
  });
});
