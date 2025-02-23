import React, { useState, useEffect } from 'react';
import environment from '@/environment';
import { Box, MenuItem, TextField, Typography } from '@mui/material';

const TravelMode = {
  DRIVING: 'driving',
  WALKING: 'walking',
  BICYCLING: 'bicycling',
  TRANSIT: 'transit',
  FLYING: 'flying',
};

const defaultPosition = {
  lat: 47.07072609176986,
  lng: 9.059202416919591,
};

interface Props {
  destination: string;
}

const MapEmbed = ({ destination }: Props) => {
  const apiKey = environment.googleMapsApiKey;

  const [mapUrl, setMapUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [travelMode, setTravelMode] = useState<string>(TravelMode.FLYING);

  const updateMapUrl = (origin: string) => {
    const encodedDestination = encodeURIComponent(destination);
    const googleMapsUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${origin}&destination=${encodedDestination}&mode=${travelMode}`;

    setMapUrl(googleMapsUrl);
  };

  const getDirection = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const origin = `${latitude},${longitude}`;
          updateMapUrl(origin);
        },
        (err) => {
          setError(`${err.message}. Using default location.`);
          const origin = `${defaultPosition.lat},${defaultPosition.lng}`;
          updateMapUrl(origin);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  useEffect(() => {
    getDirection();
  }, [destination, travelMode]);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  return (
    <Box sx={{ mt: '4px' }}>
      <TextField
        select
        label="Select Travel Mode"
        value={travelMode}
        onChange={(e) => {
          setTravelMode(e.target.value);
        }}
        size="small"
        sx={{ width: '20%', mb: 3 }}
      >
        <MenuItem value={TravelMode.DRIVING}>Driving</MenuItem>
        <MenuItem value={TravelMode.WALKING}>Walking</MenuItem>
        <MenuItem value={TravelMode.BICYCLING}>Bicycling</MenuItem>
        <MenuItem value={TravelMode.TRANSIT}>Transit</MenuItem>
        <MenuItem value={TravelMode.FLYING}>Flying</MenuItem>
      </TextField>
      <Box sx={{ height: '60vh' }}>
        {mapUrl ? (
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
            allowFullScreen
          ></iframe>
        ) : (
          <Typography variant="subtitle1">Loading map...</Typography>
        )}
      </Box>
    </Box>
  );
};

export default MapEmbed;
