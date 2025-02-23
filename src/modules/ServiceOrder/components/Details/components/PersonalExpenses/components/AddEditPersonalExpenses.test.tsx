import { screen, waitFor } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import AddEditPersonalExpenses from './AddEditPersonalExpenses';

jest.mock('@/src/helpers/formatDateByLuxon', () => ({
  convertFromMillis: jest.fn().mockReturnValue('25.11.1997 02:41'),
  convertToUtcDate: jest.fn().mockReturnValue('25.11.1997 02:41'),
  convertToUtcDateTime: jest.fn().mockReturnValue('25.11.1997 02:41'),
  convertToUtcTime: jest.fn().mockReturnValue('25.11.1997 02:41'),
  getMillis: jest.fn().mockReturnValue(0),
}));

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () =>
  jest.fn().mockReturnValue({
    dataList: [],
    getDataList: jest.fn().mockResolvedValue([]),
    customFilteredDataList: [],
    getCustomFilteredDataList: jest.fn().mockResolvedValue([]),
  })
);

describe('AddEditPersonalExpenses', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      onClose: jest.fn(),
      onSubmitForm: jest.fn(),
      type: 'add' as 'add' | 'edit',
    };

    return renderRootProvider(<AddEditPersonalExpenses {...defaultProps} {...props} />);
  };

  it('should render the component', () => {
    renderComponent();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should render the form fields', () => {
    renderComponent();

    waitFor(() => {
      expect(screen.getByLabelText('DATE')).toBeInTheDocument();
      expect(screen.getByLabelText('TECHNICIAN_NUMBER')).toBeInTheDocument();
      expect(screen.getByLabelText('TECHNICIAN_NAME')).toBeInTheDocument();
    });
  });

  it('should render the modal actions', () => {
    renderComponent();

    const buttonCancel = screen.getByRole('button', { name: 'DISCARD' });
    const buttonSave = screen.getByRole('button', { name: 'SAVE' });

    expect(buttonCancel).toBeInTheDocument();
    expect(buttonSave).toBeInTheDocument();
  });
});
