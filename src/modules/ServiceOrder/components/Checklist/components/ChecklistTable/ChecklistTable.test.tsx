import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import ChecklistTable from './ChecklistTable';

describe('ChecklistTable', () => {
  const mockedTableData = [
    {
      ProductGroupNumber: 1,
      Question: 'Question 1',
      Answer: false,
      ChecklistDataId: 1,
      OrderId: 1,
    },
    {
      ProductGroupNumber: 2,
      Question: 'Question 2',
      Answer: false,
      ChecklistDataId: 2,
      OrderId: 2,
    },
  ];

  const renderComponent = (props = {}) => {
    const defaultProps = {
      data: mockedTableData,
      onUpdatedChecklistRow: jest.fn(),
    };

    return renderRootProvider(<ChecklistTable {...defaultProps} {...props} />);
  };

  it('should render the table', () => {
    renderComponent();

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render the table headers', () => {
    renderComponent();

    expect(screen.getByText('PG')).toBeInTheDocument();
    expect(screen.getByText('CHECK_QUESTION')).toBeInTheDocument();
    expect(screen.getByText('ANSWER')).toBeInTheDocument();
  });
});
