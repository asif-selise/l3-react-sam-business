import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import EditImage from './EditImage';

jest.mock('react-filerobot-image-editor', () => ({
  __esModule: true,
  default: jest.fn(({ onSave }) => (
    <button
      data-testid="mock-filerobot-editor"
      onClick={() => onSave({ imageBase64: 'mockedImageBase64' })}
    >
      Mock Filerobot Editor
    </button>
  )),
  TABS: {
    ADJUST: 'adjust',
    ANNOTATE: 'annotate',
    WATERMARK: 'watermark',
  },
  TOOLS: {
    CROP: 'crop',
    TEXT: 'text',
  },
}));

describe('EditImage Component', () => {
  const mockImage = 'testImage.jpg';
  const mockOnClose = jest.fn();
  const mockOnSaveImage = jest.fn();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      image: mockImage,
      onClose: mockOnClose,
      onSaveImage: mockOnSaveImage,
    };

    return renderRootProvider(<EditImage {...defaultProps} {...props} />);
  };

  it('renders the EditImage component', () => {
    renderComponent();

    expect(screen.getByLabelText('EDIT_IMAGE')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'DISCARD' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SAVE' })).toBeInTheDocument();
  });

  it('calls the onClose function when the Discard button is clicked', async () => {
    renderComponent();

    const buttonDiscard = screen.getByRole('button', { name: 'DISCARD' });
    await user.click(buttonDiscard);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSaveImage with the edited image when Save button is clicked', async () => {
    renderComponent();

    const buttonSaveInEditor = screen.getByTestId('mock-filerobot-editor');
    await user.click(buttonSaveInEditor);

    const buttonSave = screen.getByRole('button', { name: 'SAVE' });
    await user.click(buttonSave);

    expect(mockOnSaveImage).toHaveBeenCalledWith('mockedImageBase64');
  });
});
