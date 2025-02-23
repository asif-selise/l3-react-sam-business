import { Card, Box, IconButton } from '@mui/material';
import React, { type Dispatch, type SetStateAction, useEffect, useRef, useState } from 'react';
import Iconify from '../iconify/iconify';
import WebcamEasy from 'webcam-easy';

interface Props {
  capturedImage: string | null;
  setCapturedImage: Dispatch<SetStateAction<string | null>>;
}

const Webcam = ({ capturedImage, setCapturedImage }: Props) => {
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const webcamElementRef = useRef<HTMLVideoElement | null>(null);
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const webcamRef = useRef<typeof WebcamEasy | null>(null);

  useEffect(() => {
    if (capturedImage === null) {
      const timer = setTimeout(() => {
        if (webcamElementRef.current && canvasElementRef.current) {
          if (webcamRef.current) {
            webcamRef.current.stop();
          }

          webcamRef.current = new WebcamEasy(
            webcamElementRef.current,
            facingMode,
            canvasElementRef.current
          );
          startWebcam();
        }
      }, 10);

      return () => {
        clearTimeout(timer);
        stopWebcam();
      };
    }
  }, [capturedImage, facingMode]);

  const startWebcam = () => {
    webcamRef.current?.start();
  };

  const stopWebcam = () => {
    if (webcamRef.current) {
      webcamRef.current.stop();
    }
  };

  const handleCapture = () => {
    if (webcamRef.current) {
      const picture = webcamRef.current.snap();
      setCapturedImage(picture as string);
    }
  };

  const handleSwitchCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  return (
    <Card
      sx={{
        position: 'relative',
        width: '100%',
        height: 0,
        paddingTop: '50%',
      }}
    >
      {capturedImage ? (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${capturedImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ) : (
        <>
          <video
            id="webcam"
            aria-label="webcam-video"
            autoPlay
            playsInline
            ref={webcamElementRef}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              objectFit: 'cover',
            }}
          />
          <canvas id="webcam-canvas" style={{ display: 'none' }} ref={canvasElementRef} />
        </>
      )}
      <Box
        sx={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 3,
        }}
      >
        <IconButton
          aria-label="switch-camera"
          onClick={handleSwitchCamera}
          disabled={!!capturedImage}
          sx={{
            bgcolor: 'background.default',
            borderRadius: '25%',
            p: 1.5,
            ':hover': { bgcolor: 'secondary.light' },

            '&:disabled': {
              bgcolor: 'grey.300',
              cursor: 'not-allowed',
            },
          }}
        >
          <Iconify icon="material-symbols:sync" width={26} />
        </IconButton>
        <IconButton
          aria-label="capture-image"
          onClick={handleCapture}
          disabled={!!capturedImage}
          color="primary"
          sx={{
            bgcolor: 'background.default',
            borderRadius: '25%',
            p: 1.5,
            ':hover': { bgcolor: 'secondary.light' },
            '&:disabled': {
              bgcolor: 'grey.300',
              cursor: 'not-allowed',
            },
          }}
        >
          <Iconify icon="solar:camera-bold" width={26} />
        </IconButton>
      </Box>
    </Card>
  );
};

export default Webcam;
