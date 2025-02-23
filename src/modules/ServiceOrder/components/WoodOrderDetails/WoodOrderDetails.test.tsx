import { screen } from '@testing-library/react';
import WoodOrderDetails from './WoodOrderDetails';
import WoodOrder from './components/WoodOrder/WoodOrder';
import Details from './components/Details/Details';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';

jest.mock('./components/WoodOrder/WoodOrder', () => jest.fn(() => <div>WoodOrder Component</div>));
jest.mock('./components/Details/Details', () => jest.fn(() => <div>Details Component</div>));
jest.mock('./components/ImageDetails/ImageDetails', () =>
  jest.fn(() => <div>ImageDetails Component</div>)
);

jest.mock('@/src/hooks/useIndexedDbData/useIndexedDbData.hook', () =>
  jest.fn().mockReturnValue({
    getDataItem: jest.fn().mockResolvedValue({}),
    getDataList: jest.fn().mockResolvedValue([]),
  })
);

describe('WoodOrderDetails', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      samOfferUId: null,
      samOfferId: null,
      showSamOfferWoodOrders: false,
    };

    return renderRootProvider(<WoodOrderDetails {...defaultProps} {...props} />);
  };

  test('renders without crashing and displays child components', () => {
    renderComponent();

    expect(screen.getByText('WoodOrder Component')).toBeInTheDocument();
    expect(screen.getByText('Details Component')).toBeInTheDocument();
    expect(screen.getByText('ImageDetails Component')).toBeInTheDocument();
  });

  test('sets selectedWoodOrderID in WoodOrder component', () => {
    renderComponent();

    expect(WoodOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        setSelectedWoodOrderID: expect.any(Function),
      }),
      {}
    );
  });

  test('passes selectedWoodOrderID to Details component', () => {
    renderComponent();

    expect(Details).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedWoodOrderID: null,
      }),
      {}
    );
  });
});
