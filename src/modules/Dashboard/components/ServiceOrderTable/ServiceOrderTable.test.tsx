import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { screen } from '@testing-library/react';
import ServiceOrderTable from './ServiceOrderTable';

jest.mock('react-router-dom', () => ({
  useRouter: jest.fn(),
}));
// jest.mock('../../hooks/useServiceOrderTable/useServiceOrderTable.hooks');
// jest.spyOn(useServiceOrderTable, 'default').mockReturnValue([
//   [
//     {
//       TimeId: 11214156,
//       DayTime: '7:30',
//       Date: '2024-01-25T00:00:00',
//       Appointment: 'VO 1. Hä ',
//       Text: '22546681',
//       OrderId: 22546681,
//       Status: 'V',
//       ProductGroupNumber: 20,
//       CustomerName: 'Gvozdenovic',
//       CustomerStreet: 'Südstrasse 11',
//       CustomerPostalCode: '8753 Mollis',
//       WorkflowItem_Rs: '2',
//       CompletionStatus: 'Kontrolle verrechnen',
//       CustomerOrderNo: 22546681,
//       QcpKV: 0,
//       QcpNO: 0,
//     },
//   ],
//   false,
//   jest.fn(),
// ]);

describe('Unit tests for Service Order table', () => {
  test('Service Order rows rendered properly', () => {
    renderRootProvider(<ServiceOrderTable isFetchingTourData={false} />);
    expect(screen.getByLabelText('Service Order Table Row')).toBeInTheDocument();
  });
});
