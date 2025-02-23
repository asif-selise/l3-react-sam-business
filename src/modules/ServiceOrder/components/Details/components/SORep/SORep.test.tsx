import SORep from './SORep';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import useIndexedDbData from '@/src/hooks/useIndexedDbData/useIndexedDbData.hook';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { screen, waitFor } from '@testing-library/react';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook');

describe('SORep Component', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
    });

    (useParams as jest.Mock).mockReturnValue({ id: '1' });

    (useIndexedDbData as jest.Mock).mockReturnValue({
      dataItem: { SO_Rep: 'rep1' },
      getDataItem: jest.fn(),
      filteredDataList: [
        {
          SpecialOffer: 'Offer1',
          ErrorReportOffer: 'Error1',
          ManufacturerId: 1,
          ProductGroupId: 1,
        },
      ],
      getFilteredDataList: jest.fn(),
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the SORep component with table headers and data', async () => {
    renderRootProvider(<SORep />);

    expect(screen.getByText('OFFER')).toBeInTheDocument();
    expect(screen.getByText('ERROR_REPORT_OFFER')).toBeInTheDocument();
    expect(screen.getByText('MANUFACTURER')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Offer1')).toBeInTheDocument();
      expect(screen.getByText('Error1')).toBeInTheDocument();
    });
  });
});
