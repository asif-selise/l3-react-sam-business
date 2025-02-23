import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
  Autocomplete,
} from '@react-google-maps/api';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import environment from '@/environment';
import MapDirectionInfo from '../MapDirectionInfo/MapDirectionInfo';

const containerStyle: CSSProperties = {
  height: '60vh',
};

const defaultPosition = {
  lat: 47.07072609176986,
  lng: 9.059202416919591,
};

interface Props {
  defaultDestination?: string;
}

const Map = ({ defaultDestination }: Props) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: environment.googleMapsApiKey,
    libraries: ['places'],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentPosition, setCurrentPosition] = useState<google.maps.LatLngLiteral | undefined>(
    undefined
  );
  const [isCurrentLocationAllowed, setIsCurrentLocationAllowed] = useState<boolean>(false);
  const [destination, setDestination] = useState<string>(defaultDestination ?? '');
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(
    null
  );
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode>(
    'DRIVING' as google.maps.TravelMode
  );
  const [totalDistance, setTotalDistance] = useState<string>('');
  const [totalDuration, setTotalDuration] = useState<string>('');

  const directionInfoRef = useRef<HTMLDivElement | null>(null);
  const destinationInputRef = useRef<HTMLInputElement | null>(null);

  const handleLoadAutocomplete = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      setDestination(place.formatted_address ?? '');
    }
  };

  useEffect(() => {
    let locationWatchId: number;

    if (typeof window !== 'undefined' && navigator.geolocation) {
      locationWatchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsCurrentLocationAllowed(true);
        },
        (error) => {
          alert(`${error.message}. Using default location.`);
          setCurrentPosition(defaultPosition);
          setIsCurrentLocationAllowed(false);
        },
        { enableHighAccuracy: true, maximumAge: 2000, timeout: 5000 }
      );
    }

    return () => {
      if (navigator.geolocation && locationWatchId !== undefined) {
        navigator.geolocation.clearWatch(locationWatchId);
      }
    };
  }, []);

  useEffect(() => {
    if (map && currentPosition) {
      map.panTo(currentPosition);
    }
  }, [currentPosition]);

  const calculateRoute = async () => {
    if (!currentPosition || !destination) {
      alert('Please enter a destination.');
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    await directionsService.route(
      {
        origin: currentPosition,
        destination,
        travelMode,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirectionsResponse(result);

          const leg = result.routes[0].legs[0];
          setTotalDistance(leg.distance?.text ?? '');
          setTotalDuration(leg.duration?.text ?? '');
        } else {
          alert('Error fetching directions.');
        }
      }
    );
  };

  useEffect(() => {
    if (currentPosition && destination) {
      calculateRoute();
    }
  }, [currentPosition, destination]);

  useEffect(() => {
    if (map && directionInfoRef.current) {
      map.controls[google.maps.ControlPosition.TOP_CENTER].clear();
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(directionInfoRef.current);
    }
  }, [map, directionInfoRef.current, totalDistance, totalDuration]);

  const validateDestination = async (address: string) => {
    if (!address || !map) return;

    const service = new google.maps.places.AutocompleteService();

    const predictionsResponse = await service.getPlacePredictions(
      { input: address },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          return predictions;
        } else {
          throw new Error('No predictions found for the provided address.');
        }
      }
    );

    return predictionsResponse.predictions;
  };

  useEffect(() => {
    const initializeDefaultDestination = async () => {
      if (defaultDestination && map) {
        try {
          const predictions = await validateDestination(defaultDestination);

          if (predictions && predictions.length > 0) {
            const placeId = predictions[0].place_id;
            const placesService = new google.maps.places.PlacesService(map);

            placesService.getDetails({ placeId }, (placeResult, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && placeResult) {
                setDestination(placeResult.formatted_address ?? defaultDestination);

                if (destinationInputRef.current) {
                  destinationInputRef.current.value =
                    placeResult.formatted_address ?? defaultDestination;
                }
              } else {
                alert('Error fetching default destination.');
              }
            });
          }
        } catch (error) {}
      }
    };

    initializeDefaultDestination();
  }, [defaultDestination, map]);

  return isLoaded ? (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Box sx={{ width: '65%' }}>
          <Autocomplete onLoad={handleLoadAutocomplete} onPlaceChanged={handlePlaceChanged}>
            <TextField
              type="text"
              placeholder="Enter destination"
              fullWidth
              size="small"
              inputRef={destinationInputRef}
            />
          </Autocomplete>
        </Box>

        <TextField
          select
          label="Select Travel Mode"
          value={travelMode}
          onChange={(e) => {
            setTravelMode(e.target.value as google.maps.TravelMode);
          }}
          size="small"
          sx={{ width: '20%' }}
        >
          <MenuItem value={google.maps.TravelMode.DRIVING}>Driving</MenuItem>
          <MenuItem value={google.maps.TravelMode.WALKING}>Walking</MenuItem>
          <MenuItem value={google.maps.TravelMode.BICYCLING}>Bicycling</MenuItem>
          <MenuItem value={google.maps.TravelMode.TRANSIT}>Transit</MenuItem>
        </TextField>

        <Button onClick={calculateRoute} variant="outlined">
          Get Directions
        </Button>
      </Box>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition}
        zoom={16}
        onLoad={(mapLoaded) => {
          setMap(mapLoaded);
        }}
        onUnmount={() => {
          setMap(null);
        }}
        // options={{
        //   disableDefaultUI: true,
        //   zoomControl: true,
        // }}
      >
        <Box ref={directionInfoRef}>
          {totalDistance && totalDuration && (
            <MapDirectionInfo totalDistance={totalDistance} totalDuration={totalDuration} />
          )}
        </Box>

        {currentPosition && (
          <>
            {isCurrentLocationAllowed ? (
              <Marker
                position={currentPosition}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: '#4285F4',
                  fillOpacity: 1,
                  strokeColor: '#4285F4',
                  strokeOpacity: 0.3,
                  strokeWeight: 15,
                }}
              />
            ) : (
              <Marker position={currentPosition} />
            )}
          </>
        )}
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>
    </Box>
  ) : (
    <></>
  );
};

export default Map;
