import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import AddAbsenceReport from './AddAbsenceReport';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { useAbsenceAndCreditTime } from '@/src/hooks/useAbsenceAndCreditTime/useAbsenceAndCreditTime.hook';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');
jest.mock('@/src/hooks/useAbsenceAndCreditTime/useAbsenceAndCreditTime.hook');

describe('AddAbsenceReport', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      onClose: jest.fn(),
      onSave: jest.fn(),
    };

    (useIndexedDbData as jest.Mock).mockReturnValue({
      dataList: [],
      getDataList: jest.fn().mockResolvedValue([]),
    });

    (useAbsenceAndCreditTime as jest.Mock).mockReturnValue({
      ViewMode: 'AbsentMessage',
    });

    return renderRootProvider(<AddAbsenceReport {...defaultProps} {...props} />);
  };

  it('should render the component', () => {
    renderComponent();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should render the form fields', () => {
    renderComponent();

    expect(screen.getByText('REASON_FOR_ABSENCE')).toBeInTheDocument();
    expect(screen.getByLabelText('START_TIME')).toBeInTheDocument();
    expect(screen.getByLabelText('END_TIME')).toBeInTheDocument();
    expect(screen.getByLabelText('NUMBER_OF_DAYS')).toBeInTheDocument();
    expect(screen.getByLabelText('REMARKS')).toBeInTheDocument();
  });

  it('should render the modal actions', () => {
    renderComponent();

    const buttonBack = screen.getByRole('button', { name: 'DISCARD' });
    const buttonSave = screen.getByRole('button', { name: 'SAVE' });

    expect(buttonBack).toBeInTheDocument();
    expect(buttonSave).toBeInTheDocument();
  });
});
