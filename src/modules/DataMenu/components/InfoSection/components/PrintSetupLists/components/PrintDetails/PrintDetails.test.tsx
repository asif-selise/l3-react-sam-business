import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import PrintDetails from './PrintDetails';
import dayjs from 'dayjs';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

describe('PrintDetails Component', () => {
  const mockOnFilter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useIndexedDbData as jest.Mock).mockImplementation((_, key: string) => {
      switch (key) {
        case 'SamPrinters':
          return {
            dataList: [{ Id: 1, Name: 'Printer1', Display: 'Printer 1' }],
            getDataList: jest.fn(),
            isLoading: false,
          };
        case 'Branches':
          return {
            dataList: [
              { Id: 1, Name: 'Branch1' },
              { Id: 2, Name: 'Branch2' },
              { Id: 3, Name: 'Branch3' },
              { Id: 4, Name: 'Branch4' },
            ],
            getDataList: jest.fn(),
            isLoading: false,
          };
        case 'TempTechnician':
          return {
            dataList: [
              { Id: 1, TechnicianEmployeeNumber: 'T001' },
              { Id: 2, TechnicianEmployeeNumber: 'T002' },
            ],
            getFilteredDataList: jest.fn(),
            getFilteredTechnicianList: jest.fn(),
            isLoading: false,
          };
        default:
          return {};
      }
    });
  });

  test('renders PrintDetails component with fields and buttons', () => {
    renderRootProvider(<PrintDetails onFilter={mockOnFilter} />);
    expect(screen.getByText('PRINT_DETAILS')).toBeInTheDocument();
    expect(screen.getByLabelText('TOUR_DATE')).toBeInTheDocument();
    expect(screen.getByText('CLEAR_ALL')).toBeInTheDocument();
    expect(screen.getByText('FILTER')).toBeInTheDocument();
  });

  test('handles form submission with valid data', async () => {
    renderRootProvider(<PrintDetails onFilter={mockOnFilter} />);

    fireEvent.change(screen.getByLabelText('TOUR_DATE'), {
      target: { value: dayjs('2023-09-01').format('YYYY-MM-DD') },
    });

    fireEvent.mouseDown(screen.getByLabelText('Printer'));

    fireEvent.click(screen.getByText('FILTER'));
  });
});
