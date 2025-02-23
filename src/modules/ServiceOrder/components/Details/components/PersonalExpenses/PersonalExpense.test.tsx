import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import PersonalExpenses from './PersonalExpenses';
import { screen } from '@testing-library/react';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'index:PERSONAL_EXPENSES') return 'Expenses';
      return key;
    },
  }),
}));

jest.mock('./components/PersonalExpensesTable', () => ({
  __esModule: true,
  default: () => <div>Mocked PersonalExpensesTable</div>,
}));

jest.mock('./components/AddEditPersonalExpenses', () => ({
  __esModule: true,
  default: () => <div>Mocked AddEditPersonalExpenses</div>,
}));

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () => {
  return jest.fn().mockReturnValue({
    filteredDataList: [],
    getFilteredDataList: jest.fn().mockResolvedValue([]),
    updateDataLists: jest.fn(),
    isLoading: false,
  });
});

describe('PersonalExpenses Component', () => {
  const renderComponent = () => {
    const defaultProps = {
      setPersonalEffortsData: jest.fn(),
    };
    return renderRootProvider(<PersonalExpenses {...defaultProps} />);
  };
  test('renders the PersonalExpenses component', () => {
    renderComponent();
    expect(screen.getByLabelText('Personal Expenses')).toBeInTheDocument();
  });
});
