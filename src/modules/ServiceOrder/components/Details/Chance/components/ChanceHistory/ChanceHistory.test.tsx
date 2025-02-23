import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import ChanceHistory from './ChanceHistory';

describe('ChanceHistory', () => {
  const mockedTableData = [
    {
      Id: '1',
      EntryDateTime: '2022-01-01',
      MustBeCompletedByDateTime: '2022-01-02',
      MailReceivedOnDateTime: '2022-01-03',
      Remark: 'Remark 1',
      AvailableLetter: 'Available Letter 1',
      CompletedOnDateTime: '2022-01-04',
      ChangedByUser: 'Changed By 1',
      ChangedDateTime: '2022-01-05',
    },
    {
      Id: '2',
      EntryDateTime: '2022-01-06',
      MustBeCompletedByDateTime: '2022-01-07',
      MailReceivedOnDateTime: '2022-01-08',
      Remark: 'Remark 2',
      AvailableLetter: 'Available Letter 2',
      CompletedOnDateTime: '2022-01-09',
      ChangedByUser: 'Changed By 2',
      ChangedDateTime: '2022-01-10',
    },
  ];

  const renderComponent = (props = {}) => {
    const defaultProps = {
      data: mockedTableData,
      isLoading: false,
    };

    return renderRootProvider(<ChanceHistory {...defaultProps} {...props} />);
  };

  it('should render the table', () => {
    renderComponent();

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render the table headers', () => {
    renderComponent();

    expect(screen.getByText('ENTRANCE')).toBeInTheDocument();
    expect(screen.getByText('LETTER')).toBeInTheDocument();
    expect(screen.getByText('MUST_BE_COMPLETED_BY')).toBeInTheDocument();
  });

  it('should render the table rows', () => {
    renderComponent();

    expect(screen.getAllByLabelText('chance-history-row')).toHaveLength(2);
  });
});
