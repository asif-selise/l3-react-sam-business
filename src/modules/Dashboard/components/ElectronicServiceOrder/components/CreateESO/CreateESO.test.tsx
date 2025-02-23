import { screen, waitFor } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import CreateEso from './CreateESO';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

describe('CreateEso', () => {
  const onSubmitForm = jest.fn();
  const onClose = jest.fn();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      onSubmitForm,
      onClose,
    };

    (useIndexedDbData as jest.Mock).mockReturnValue({
      filteredDataList: [],
      getFilteredDataList: jest.fn().mockResolvedValue([]),
      dataList: [],
      getDataList: jest.fn().mockResolvedValue([]),
      isLoading: false,
    });

    return renderRootProvider(<CreateEso {...defaultProps} {...props} />);
  };

  it('should render the component', () => {
    renderComponent();

    expect(screen.getByLabelText('create-eso-form')).toBeInTheDocument();
  });

  it('should render the form fields', () => {
    renderComponent();

    waitFor(() => {
      expect(screen.getByLabelText('FILTER_ESO_PROCESS')).toBeInTheDocument();
      expect(screen.getByLabelText('NEW_ESO')).toBeInTheDocument();
      expect(screen.getByLabelText('SO')).toBeInTheDocument();
      expect(screen.getByLabelText('REMARKS')).toBeInTheDocument();
    });
  });
});
