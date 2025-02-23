import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import { screen } from '@testing-library/react';
import ServiceOrderArticle from './ServiceOrderArticle';

describe('Testing ServiceOrderArticle', () => {
  test('should render ServiceOrderArticle component with a table', () => {
    renderRootProvider(<ServiceOrderArticle />);

    expect(screen.getByText('SERVICE_ORDER_ARTICLE')).toBeInTheDocument();
  });
});
