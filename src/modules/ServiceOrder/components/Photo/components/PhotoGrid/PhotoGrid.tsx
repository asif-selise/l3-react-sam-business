import { Box, Grid } from '@mui/material';
import React from 'react';
import { type PhotoData } from '@/src/hooks/useGetCompressedPhotos/types';

interface Props {
  photos: PhotoData[];
  onPhotoClick: (photo: PhotoData) => void;
  size?: number;
}

const PhotoGrid = ({ photos, onPhotoClick, size = 120 }: Props) => {
  return (
    <Grid container rowSpacing={2} columnSpacing={6} sx={{ alignItems: 'center' }}>
      {photos
        .slice()
        .sort((a, b) => a.SortOrder - b.SortOrder)
        .map((photo) => (
          <Grid item key={photo.Id}>
            <Box
              component="img"
              src={photo.Base64String}
              alt={photo.Remarks}
              width={size}
              height={size}
              sx={{
                objectFit: 'cover',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
              onClick={() => onPhotoClick(photo)}
            />
          </Grid>
        ))}
    </Grid>
  );
};

export default PhotoGrid;
