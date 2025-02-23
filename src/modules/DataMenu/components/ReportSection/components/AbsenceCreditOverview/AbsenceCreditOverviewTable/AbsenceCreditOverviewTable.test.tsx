import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import AbsenceCreditOverviewTable from './AbsenceCreditOverviewTable';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

describe('AbsenceCreditOverviewTable', () => {
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
    };

    (useIndexedDbData as jest.Mock).mockReturnValue({
      filteredDataList: [],
      getFilteredDataList: jest.fn().mockResolvedValue([]),
      dataList: [],
      getDataList: jest.fn().mockResolvedValue([]),
      isLoading: false,
    });

    return renderRootProvider(<AbsenceCreditOverviewTable {...defaultProps} {...props} />);
  };

  it('should render the table', () => {
    renderComponent();

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render the table headers', () => {
    renderComponent();

    expect(screen.getByText('REASON_FOR_ABSENCE')).toBeInTheDocument();
    expect(screen.getByText('FROM')).toBeInTheDocument();
    expect(screen.getByText('UNTIL')).toBeInTheDocument();
  });

  it('should render the table data', () => {
    renderComponent();

    const tableRows = screen.getAllByLabelText('absence-credit-overview-row');
    expect(tableRows).toHaveLength(2);
  });
});
