import { screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import ScanQRCode from './ScanQRCode';

jest.mock('webcam-easy', () => {
  return jest.fn().mockImplementation(() => ({
    start: jest.fn().mockResolvedValue(true),
    stop: jest.fn(),
    snap: jest.fn().mockResolvedValue('mockedImageBase64'),
    flip: jest.fn(),
  }));
});

jest.mock('qr-scanner', () => ({
  scanImage: jest.fn().mockReturnValue({ data: 'https://service7000.ch' }),
}));

// eslint-disable-next-line react/display-name
jest.mock('@/src/components/EditImage/EditImage', () => ({ image, onSaveImage, onClose }: any) => (
  <div data-testid="edit-image-modal">
    <button onClick={onClose}>Discard</button>
    <button onClick={() => onSaveImage('editedImageBase64')}>Save</button>
  </div>
));

describe('ScanQRCode Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      scanOption: 'discard' as const,
      onScanDevice: jest.fn(),
    };

    return renderRootProvider(<ScanQRCode {...defaultProps} />);
  };

  it('renders all elements properly', () => {
    renderComponent();

    expect(screen.getByLabelText('webcam-video')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'capture-image' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'switch-camera' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'UPLOAD_IMAGE' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'EDIT_IMAGE' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'READ_QR_INFO' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'DISCARD_QR' })).toBeInTheDocument();
  });

  // it('starts the webcam and captures an image', async () => {
  //   renderComponent();

  //   const captureButton = screen.getByRole('button', { name: 'capture-image' });

  //   await user.click(captureButton);

  //   const imageElement = screen.getByAltText('captured-image');

  //   waitFor(() => {
  //     expect(imageElement).toHaveAttribute('src', 'mockedImageBase64');
  //   });
  // });

  // it('uploads an image from device', async () => {
  //   renderComponent();

  //   const uploadButton = screen.getByRole('button', { name: 'UPLOAD_IMAGE' });

  //   await user.click(uploadButton);

  //   const fileInput = screen.getByLabelText('file-input');

  //   await user.upload(fileInput, new File(['dummy'], 'testImage.jpg', { type: 'image/jpg' }));

  //   const imageElement = screen.getByAltText('captured-image');

  //   waitFor(() => {
  //     expect(imageElement).toHaveAttribute('src', 'mockedImageBase64');
  //   });
  // });

  it('scans QR code from captured image', async () => {
    renderComponent();

    const captureButton = screen.getByRole('button', { name: 'capture-image' });
    await user.click(captureButton);

    const scanButton = screen.getByRole('button', { name: 'READ_QR_INFO' });
    await user.click(scanButton);

    waitFor(() => {
      const qrLink = screen.getByDisplayValue('https://service7000.ch');
      expect(qrLink).toBeInTheDocument();
    });
  });

  // it('switches the camera when the button is clicked', async () => {
  //   const { container } = renderComponent();

  //   const switchCameraButton = screen.getByRole('button', { name: 'switch-camera' });
  //   await user.click(switchCameraButton);

  //   waitFor(
  //     () => {
  //       const videoElement = container.querySelector('video');
  //       expect(videoElement).toHaveAttribute('data-facing-mode', 'environment');
  //     },
  //     { timeout: 1000 }
  //   );
  // });

  // it('opens the edit image modal', async () => {
  //   renderComponent();

  //   const captureButton = screen.getByRole('button', { name: 'capture-image' });
  //   await user.click(captureButton);

  //   const editButton = screen.getByRole('button', { name: 'EDIT_IMAGE' });
  //   await user.click(editButton);

  //   const editImageModal = screen.getByTestId('edit-image-modal');

  //   expect(editImageModal).toBeInTheDocument();
  // });
});
