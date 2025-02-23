import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { screen, waitFor } from '@testing-library/react';
import ServiceOrderArticleTable from './ServiceOrderArticleTable';
import { type TableData } from '@/src/components/CustomTable/types';

const mockedServiceOrderArticleData: TableData[] = [
  {
    id: 2,
    ArticleDescription: 'EHL4S7000-A',
    itemName: 'Service 7000 by Electrolux AAV413-SERVICE7000',
    FixedPriceExcl: '1997',
    Gross: '1656.00',
    rabAutomation: true,
    rabCostion: '50',
    Sensitivity: '10.00',
    bestAm: '19.03.2024 15:35',
    productCode: '1473-000001',
  },
];
describe('Testing ServiceOrderArticle', () => {
  test('should render should render ServiceOrderArticleTable with given data', () => {
    renderRootProvider(
      <ServiceOrderArticleTable data={mockedServiceOrderArticleData} isLoading={false} />
    );

    waitFor(() => {
      expect(screen.getByText('EHL4S7000-A')).toBeInTheDocument();
      expect(screen.getByText(1997)).toBeInTheDocument();
      expect(screen.getByText(1656.0)).toBeInTheDocument();
    });
  });
});
