import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import AbsenceCreditOverview from './AbsenceCreditOverview';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

describe('AbsenceCreditOverview', () => {
  const onClose = jest.fn();
  const mockedTableData = [
    {
      id: 1,
      reasonForAbsence: 'reasonForAbsence1',
      From: '2023-10-01T08:00:00Z',
      shift: 'shift1',
      until: '2023-10-01T17:00:00Z',
      remarks: 'remarks1',
    },
    {
      id: 2,
      reasonForAbsence: 'reasonForAbsence2',
      From: '2023-10-02T08:00:00Z',
      shift: 'shift2',
      until: '2023-10-02T17:00:00Z',
      remarks: 'remarks2',
    },
  ] as any[];

  const renderComponent = (props = {}) => {
    const defaultProps = {
      data: mockedTableData,
      isLoading: false,
      onClose,
    };

    (useIndexedDbData as jest.Mock).mockReturnValue({
      filteredDataList: [],
      getFilteredDataList: jest.fn().mockResolvedValue([]),
      dataList: [],
      getDataList: jest.fn().mockResolvedValue([]),
      isLoading: false,
    });

    return renderRootProvider(<AbsenceCreditOverview {...defaultProps} {...props} />);
  };

  it('should render the modal', () => {
    renderComponent();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should render the title', () => {
    renderComponent();

    expect(screen.getByText('ABSENCE_REPORTS_AND_CREDIT_NOTES_OVERVIEW')).toBeInTheDocument();
  });

  it('should render the table', () => {
    renderComponent();

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should call onClose when the modal is closed', () => {
    renderComponent();

    const closeButton = screen.getByRole('button', { name: 'DISCARD' });
    closeButton.click();

    expect(onClose).toHaveBeenCalled();
  });
});
