import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import Checklist from './Checklist';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

describe('Checklist', () => {
  const renderComponent = () => {
    (useIndexedDbData as jest.Mock).mockReturnValue({
      filteredDataList: [
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
      ],
      getFilteredDataList: jest.fn(),
      dataList: [],
      getDataList: jest.fn(),
      updateDataLists: jest.fn(),
      isLoading: false,
    });

    return renderRootProvider(<Checklist />);
  };

  it('should render the component', () => {
    renderComponent();

    expect(screen.getAllByLabelText('PG')).toHaveLength(2);
    expect(screen.getByLabelText('CHECK_QUESTION')).toBeInTheDocument();
    expect(screen.getByLabelText('ANSWER')).toBeInTheDocument();
  });

  it('should render the table', () => {
    renderComponent();

    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
