import { screen } from '@testing-library/react';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import ImageDetails from './ImageDetails';
import configureMockStore from 'redux-mock-store';

jest.mock('@/src/hooks/usePhotoManagement/usePhotoManagement', () => {
  return jest.fn(() => ({
    photos: [],
    selectedPhoto: {},
    setSelectedPhoto: jest.fn(),
    handleUpdatePhotoDetails: jest.fn(),
    handleDeletePhoto: jest.fn(),
    handleSavePhoto: jest.fn(),
    originalBase64Image: '',
    isPhotosLoading: false,
    isNoPhotosFound: false,
    isOriginalPhotoLoading: false,
  }));
});

jest.mock('./components/ReferenceImage/ReferenceImage', () => {
  const MockReferenceImage = () => <div data-testid="reference-image">Reference Image</div>;
  MockReferenceImage.displayName = 'MockReferenceImage';
  return MockReferenceImage;
});

jest.mock('./components/ActionButton/ActionButton', () => {
  const MockActionButton = () => <div data-testid="action-button">ADD_NEW_PHOTO</div>;
  MockActionButton.displayName = 'MockActionButton';
  return MockActionButton;
});

jest.mock('../../../Photo/components/PhotoGrid/PhotoGrid', () => {
  const MockPhotoGrid = () => <div data-testid="photo-grid">Photo Grid</div>;
  MockPhotoGrid.displayName = 'MockPhotoGrid';
  return MockPhotoGrid;
});

jest.mock('../../../Photo/components/ViewOriginalPhoto/ViewOriginalPhoto', () => {
  const MockViewOriginalPhoto = () => (
    <div data-testid="view-original-photo">View Original Photo</div>
  );
  MockViewOriginalPhoto.displayName = 'MockViewOriginalPhoto';
  return MockViewOriginalPhoto;
});

jest.mock('../../../Photo/components/NewPhoto/NewPhoto', () => {
  const MockNewPhoto = () => <div data-testid="new-photo">New Photo</div>;
  MockNewPhoto.displayName = 'MockNewPhoto';
  return MockNewPhoto;
});

jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useEffect: jest.fn(),
  };
});

describe('ImageDetails Component', () => {
  const store = configureMockStore()({
    snackbar: {
      snackbarQueue: [
        {
          key: 'snackbar_id_1',
          isVisible: true,
          type: 'success',
          title: 'Success snackbar',
        },
        {
          key: 'snackbar_id_2',
          isVisible: true,
          type: 'error',
          title: 'Error snackbar',
        },
      ],
    },
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      completionStatus: false,
      woodOrderDetails: { Id: 1, isNew: false },
    };
    return renderRootProvider(<ImageDetails {...defaultProps} {...props} />, { store });
  };

  test('should render the ImageDetails component', () => {
    renderComponent();
    expect(screen.getByText('IMAGE_DETAILS')).toBeInTheDocument();
    expect(screen.getByText('ADD_NEW_PHOTO')).toBeInTheDocument();
  });

  test('should render the reference image component', () => {
    renderComponent();
    expect(screen.getByTestId('reference-image')).toBeInTheDocument();
  });
});
