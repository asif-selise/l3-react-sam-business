import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrintLayout from './PrintLayout';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';

jest.mock('@/src/helpers/formatDate', () => ({
  getDate: jest.fn((date) => date),
}));

describe('PrintLayout Component', () => {
  const mockData = [
    {
      TourDate: '2023-11-01',
      Orders: 123,
      TechnicianEmployeeNumber: 456,
      FirstName: 'John',
      LastName: 'Doe',
      IsTechnician: true,
      IsInstaller: false,
      BranchLocation: 'Branch A',
      LoadingLocation: 'Location X',
      Print: true,
    },
    {
      TourDate: '2023-11-02',
      Orders: 124,
      TechnicianEmployeeNumber: 789,
      FirstName: 'Jane',
      LastName: 'Smith',
      IsTechnician: false,
      IsInstaller: true,
      BranchLocation: 'Branch B',
      LoadingLocation: 'Location Y',
      Print: false,
    },
  ];

  const ref = React.createRef<HTMLDivElement>();

  test('renders without crashing', () => {
    renderRootProvider(<PrintLayout selectedItems={mockData} ref={ref} />);
  });

  test('renders table headers correctly', () => {
    renderRootProvider(<PrintLayout selectedItems={mockData} ref={ref} />);

    expect(screen.getByText('TOUR_DATE')).toBeInTheDocument();
    expect(screen.getByText('SO_NO')).toBeInTheDocument();
    expect(screen.getByText('TECHNICIAN_EMPLOYEE_NUMBER')).toBeInTheDocument();
    expect(screen.getByText('FIRST_NAME')).toBeInTheDocument();
    expect(screen.getByText('LAST_NAME')).toBeInTheDocument();
    expect(screen.getByText('BRANCH_LOCATION')).toBeInTheDocument();
    expect(screen.getByText('LOADING_LOCATION')).toBeInTheDocument();
  });

  test('renders table rows with data', () => {
    renderRootProvider(<PrintLayout selectedItems={mockData} ref={ref} />);

    mockData.forEach((item) => {
      expect(screen.getByText(item.TourDate)).toBeInTheDocument();
      expect(screen.getByText(item.Orders)).toBeInTheDocument();
      expect(screen.getByText(item.TechnicianEmployeeNumber)).toBeInTheDocument();
      expect(screen.getByText(item.FirstName)).toBeInTheDocument();
      expect(screen.getByText(item.LastName)).toBeInTheDocument();
      expect(screen.getByText(item.BranchLocation)).toBeInTheDocument();
      expect(screen.getByText(item.LoadingLocation)).toBeInTheDocument();
    });
  });

  test('hides component from display', () => {
    const { container } = renderRootProvider(<PrintLayout selectedItems={mockData} ref={ref} />);

    expect(container.firstChild).toHaveStyle('display: none');
  });
});
