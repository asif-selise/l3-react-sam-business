import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import ReferenceImage from './ReferenceImage';

describe('ReferenceImage Component', () => {
  test('should render Typography with correct text', () => {
    renderRootProvider(<ReferenceImage />);
    expect(screen.getByText('REFERENCE')).toBeInTheDocument();
  });

  // test('should render Image with correct attributes', () => {
  //   renderRootProvider(<ReferenceImage />);

  //   const image = screen.getByRole('img');

  //   expect(image).toHaveAttribute('src', '/assets/images/woodReference.png');
  //   expect(image).toHaveAttribute('alt', 'Appliance image');
  // });
});
