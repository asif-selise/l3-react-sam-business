import type { HeadCell } from '@/src/components/CustomTable/types';
import PersonalExpensesTable from './PersonalExpensesTable';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { screen } from '@testing-library/react';
import { type PersonalEffort } from '@/src/hooks/useTourData/tourData.interface';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'index:DATE': 'Date',
        'index:TECHNICIAN_NUMBER': 'Technician Number',
        'index:TECHNICIAN_NAME': 'Technician Name',
        'index:FROM': 'From',
        'index:UNTIL': 'Until',
        'index:TRAVEL_TIME': 'Travel Time',
        'index:CODE': 'Code',
        'index:WORK_FROM_HOME': 'Work From Home',
        'index:SECOND_CHECK_REASON': 'Second Check Reason',
        'index:WORKSHOP': 'Workshop',
      };
      return translations[key] || key;
    },
  }),
}));

const personalExpensesData: PersonalEffort[] = [
  {
    UId: '1',
    Date: '19.03.2024 15:35',
    TechnicianEmployeeNumber: 101,
    TechnicianName: 'Richard',
    Start: '19.03.2024 15:35',
    End: '19.03.2024 16:35',
    TravelTime: 69,
    Code: '1011',
    WorkFromHome: true,
    NoSecondWayReason: 1,
    PersonalEffortId: 0,
    OrderId: 56,
    CalculatedHW: null,
  },
  {
    UId: '2',
    Date: '19.03.2024 15:35',
    TechnicianEmployeeNumber: 102,
    TechnicianName: 'Richard',
    Start: '19.03.2024 15:35',
    End: '19.03.2024 16:35',
    TravelTime: 69,
    Code: '1012',
    WorkFromHome: false,
    NoSecondWayReason: 2,
    PersonalEffortId: 0,
    OrderId: 56,
    CalculatedHW: null,
  },
  {
    UId: '3',
    Date: '19.03.2024 15:35',
    TechnicianEmployeeNumber: 103,
    TechnicianName: 'Richard',
    Start: '19.03.2024 15:35',
    End: '19.03.2024 16:35',
    TravelTime: 69,
    Code: '1013',
    WorkFromHome: true,
    NoSecondWayReason: 3,
    PersonalEffortId: 0,
    OrderId: 56,
    CalculatedHW: null,
  },
];

const headCells: HeadCell[] = [
  { id: 'Date', label: 'Date', sortable: true, align: 'left' },
  { id: 'TechnicianNumber', label: 'Technician Number', sortable: true, align: 'left' },
  { id: 'TechnicianName', label: 'Technician Name', sortable: true, align: 'left' },
  { id: 'Start', label: 'From', sortable: true, align: 'left' },
  { id: 'End', label: 'Until', sortable: true, align: 'left' },
  { id: 'TravelTime', label: 'Travel Time', sortable: true, align: 'left' },
  { id: 'Code', label: 'Code', sortable: true, align: 'left' },
  { id: 'WorkFromHome', label: 'Work From Home', sortable: true, align: 'center' },
  { id: 'NoSecondWayReason', label: 'Second Check Reason', sortable: true, align: 'left' },
  { id: 'Workshop', label: 'Workshop', sortable: true, align: 'left' },
  { id: 'ActionButton', label: '', sortable: false, align: 'left' },
];

jest.mock('@/src/helpers/formatDateByLuxon', () => ({
  convertToUtcFormatedDate: jest.fn().mockReturnValue('19.03.2024 15:35'),
  isToday: jest.fn().mockReturnValue(false),
}));

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () =>
  jest.fn().mockReturnValue({
    dataList: [],
    getDataList: jest.fn().mockResolvedValue([]),
  })
);

jest.mock('../../../KVEstimatedCost/utils/helpers', () => ({
  revertDateTime1900: jest.fn().mockReturnValue('19.03.2024 15:35'),
}));

describe('PersonalExpensesTable Component', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      data: personalExpensesData,
      headCells,
      isLoading: false,
      onEditModalSubmit: jest.fn(),
      onDeleteSubmit: jest.fn(),
    };

    return renderRootProvider(<PersonalExpensesTable {...defaultProps} {...props} />);
  };

  test('renders the PersonalExpensesTable component', () => {
    renderComponent();
    expect(screen.getByText('Technician Name')).toBeInTheDocument();
    expect(screen.getByText('Until')).toBeInTheDocument();
  });

  test('displays technician names correctly', () => {
    renderComponent();
    expect(screen.getAllByText('Richard').length).toBe(3);
  });

  test('displays and interacts with the ActionButton menu', async () => {
    renderComponent();

    const actionButtons = screen.getAllByRole('button', { name: 'action-buttons' });
    expect(actionButtons.length).toBeGreaterThan(0);
  });
});
