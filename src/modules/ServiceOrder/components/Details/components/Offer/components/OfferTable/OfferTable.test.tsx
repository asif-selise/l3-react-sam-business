import { screen, waitFor } from '@testing-library/react';
import { type HeadCell, type TableData } from '@/src/components/CustomTable/types';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import OfferTable from './OfferTable';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

jest.mock('../../../CreateOffer/CreateOffer', () => {
  const MockCreateOffer = () => <div data-testid="create-offer">Create Offer</div>;
  MockCreateOffer.displayName = 'MockCreateOffer';
  return MockCreateOffer;
});

const mockTableHeaders: HeadCell[] = [
  {
    id: 'so',
    label: 'SO',
    sortable: false,
  },
  {
    id: 'newOffer',
    label: 'NEW_OFFER',
    align: 'right',
    sortable: true,
  },
  {
    id: 'remarks',
    label: 'REMARKS',
    sortable: false,
  },
  {
    id: 'releaseOn',
    label: 'RELEASE_ON',
    sortable: false,
  },
];

const MockTableData: TableData[] = [
  {
    OrderId: 1,
    SamNoType: 12,
    CommentNo: 'TestComment1',
    ApprovalDate: '2024-01-24T10:13:40.2',
    TakenOverUser: 'user2',
    TakenOverAt: '2024-03-28T10:13:40.4',
    UpdatedAt: '2024-08-29T10:13:40.2',
    ChangedByNo: 'User4',
  },
  {
    OrderId: 2,
    SamNoType: 21,
    CommentNo: 'TestComment2',
    ApprovalDate: '2024-01-24T10:13:40.2',
    TakenOverUser: 'user7',
    TakenOverAt: '2024-03-28T10:13:40.4',
    UpdatedAt: '2024-08-29T10:13:40.2',
    ChangedByNo: 'User5',
  },
];

describe('OfferTable component', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      SORep: 1,
      data: MockTableData as any[],
      isLoading: false,
      getOfferList: jest.fn().mockResolvedValue([]),
      handleWoodOrderModal: jest.fn(),
      openOfferForCopy: false,
      setOpenOfferForCopy: jest.fn(),
    };

    (useIndexedDbData as jest.Mock).mockReturnValue({
      filteredDataList: [],
      getFilteredDataList: jest.fn().mockResolvedValue([]),
      dataList: [],
      getDataList: jest.fn().mockResolvedValue([]),
      isLoading: false,
    });

    return renderRootProvider(<OfferTable {...defaultProps} {...props} />);
  };

  test('renders table rows correctly when data is provided', () => {
    renderComponent();

    mockTableHeaders.forEach((headCell) => {
      expect(screen.getByText(headCell.label)).toBeInTheDocument();
    });

    waitFor(() => {
      MockTableData.forEach((row) => {
        expect(screen.getByText(String(row.SamNoType))).toBeInTheDocument();
        expect(screen.getByText(String(row.ChangedByNo))).toBeInTheDocument();
      });
    });
  });
});
