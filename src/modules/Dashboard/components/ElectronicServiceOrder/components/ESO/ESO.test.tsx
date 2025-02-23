import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import ESO from './ESO';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

describe('ESO', () => {
  const setOpenCreateESO = jest.fn();

  const renderComponent = (props = {}) => {
    (useIndexedDbData as jest.Mock).mockReturnValue({
      dataList: [],
      getDataList: jest.fn(),
      isLoading: false,
    });

    const defaultProps = {
      openCreateESO: false,
      setOpenCreateESO,
    };

    return renderRootProvider(<ESO {...defaultProps} {...props} />);
  };

  it('should render the table', () => {
    renderComponent();

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should open the create ESO dialog', () => {
    renderComponent({ openCreateESO: true });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('create-eso-form')).toBeInTheDocument();
  });
});
