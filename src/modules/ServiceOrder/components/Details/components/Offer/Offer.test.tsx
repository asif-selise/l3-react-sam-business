import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { screen } from '@testing-library/react';
import Offer from './Offer';
import configureMockStore from 'redux-mock-store';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

jest.mock('./components/OfferTable/OfferTable', () => ({
  __esModule: true,
  default: () => <div>Mocked OfferTable</div>,
}));

jest.mock('../CreateOffer/CreateOffer', () => ({
  __esModule: true,
  default: () => <div>Mocked NEW_OFFER</div>,
}));

describe('Offer Component', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });

    (useParams as jest.Mock).mockReturnValue({ id: '1' });

    (useIndexedDbData as jest.Mock).mockReturnValue({
      filteredDataList: [
        {
          OrderId: 2,
          SamNoType: 21,
          CommentNo: 'TestComment',
          ApprovalDate: '2024-01-24T10:13:40.2',
          TakenOverUser: 'user2',
          TakenOverAt: '2024-03-28T10:13:40.4',
          UpdatedAt: '2024-08-29T10:13:40.2',
          ChangedByNo: 'User4',
        },
      ],
      getFilteredDataList: jest.fn(),
      isLoading: false,
      getCustomFilteredDataList: jest.fn().mockResolvedValue([]),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      SORep: 1,
      openCreateOfferModal: false,
      setOpenCreateOfferModal: jest.fn(),
      samOfferUId: 'test-uid',
      samOfferId: 123,
      handleWoodOrderModal: jest.fn(),
      openOfferForCopy: false,
      setOpenOfferForCopy: jest.fn(),
    };

    const store = configureMockStore()({
      serviceOrder: {
        id: 1,
      },
      soStatus: {
        soStatus: 'ReadOnly',
      },
    });

    return renderRootProvider(<Offer {...defaultProps} {...props} />, { store });
  };

  test('renders the Offer component with table headers and data', async () => {
    renderComponent();

    // expect(screen.getByText('NEW_OFFER')).toBeInTheDocument();
    expect(screen.getByText('OFFERS')).toBeInTheDocument();
    expect(screen.getByLabelText('Offer')).toBeInTheDocument();
  });
});
