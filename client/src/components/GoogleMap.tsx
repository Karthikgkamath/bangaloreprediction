import { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { getGoogleMapsApiKey, hasGoogleMapsApiKey } from '@/lib/askSecrets';

interface GoogleMapProps {
  onSelectLocation: (location: { lat: number; lng: number; address: string }) => void;
}

// Bangalore center coordinates
const bangaloreCenter = {
  lat: 12.9716,
  lng: 77.5946
};

// Define Bangalore neighborhoods
const bangaloreRegions = [
  { id: 'indiranagar', name: 'Indiranagar', location: { lat: 12.9784, lng: 77.6408 } },
  { id: 'koramangala', name: 'Koramangala', location: { lat: 12.9279, lng: 77.6271 } },
  { id: 'jayanagar', name: 'Jayanagar', location: { lat: 12.9299, lng: 77.5845 } },
  { id: 'whitefield', name: 'Whitefield', location: { lat: 12.9698, lng: 77.7500 } },
  { id: 'electronic-city', name: 'Electronic City', location: { lat: 12.8399, lng: 77.6770 } },
  { id: 'rajajinagar', name: 'Rajajinagar', location: { lat: 12.9855, lng: 77.5565 } },
  { id: 'hebbal', name: 'Hebbal', location: { lat: 13.0358, lng: 77.5970 } },
];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

export default function BangaloreGoogleMap({ onSelectLocation }: GoogleMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [clickedLocation, setClickedLocation] = useState<{lat: number; lng: number} | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [noApiKey, setNoApiKey] = useState<boolean>(false);

  // Check if API key is available
  useEffect(() => {
    setNoApiKey(!hasGoogleMapsApiKey());
  }, []);

  // Load the Google Maps JS API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: getGoogleMapsApiKey(),
  });

  // Map options
  const options = useMemo(() => ({
    disableDefaultUI: true,
    zoomControl: true,
    clickableIcons: true,
    scrollwheel: true,
    rotateControl: false,
    scaleControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    mapId: "6e2bf94fef01cf71", // Modern styled map
  }), []);

  // Handle map click
  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setClickedLocation({ lat, lng });
      
      // Use geocoder to get address from coordinates
      if (geocoder) {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const address = results[0].formatted_address;
            onSelectLocation({ lat, lng, address });
          }
        });
      }
    }
  }, [geocoder, onSelectLocation]);

  // Initialize map and geocoder
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setGeocoder(new google.maps.Geocoder());
  }, []);

  // Handle marker click
  const handleMarkerClick = (regionId: string) => {
    setSelectedMarker(regionId);
    const region = bangaloreRegions.find(r => r.id === regionId);
    
    if (region && geocoder) {
      const { lat, lng } = region.location;
      setClickedLocation({ lat, lng });
      
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const address = results[0].formatted_address;
          onSelectLocation({ lat, lng, address });
        }
      });
    }
  };

  // Determine marker color based on selection state
  const getMarkerIcon = (regionId: string) => {
    return selectedMarker === regionId
      ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
  };

  // Fallback UI when Google Maps API key is missing
  if (noApiKey) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-center">
        <div className="text-4xl mb-4 text-slate-400">🗺️</div>
        <h3 className="text-lg font-medium mb-2">Google Maps API Key Required</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Please add a Google Maps API key to enable the interactive map feature.
        </p>
        <div className="text-xs text-slate-500 dark:text-slate-500 bg-slate-200 dark:bg-slate-700 p-2 rounded w-full max-w-xs overflow-auto">
          VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
        </div>
      </div>
    );
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-center">
        <div className="text-4xl mb-4 text-red-500">⚠️</div>
        <h3 className="text-lg font-medium mb-2">Failed to load Google Maps</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          There was an error loading the map. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={bangaloreCenter}
        zoom={11}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {/* Region markers */}
        {bangaloreRegions.map((region) => (
          <Marker
            key={region.id}
            position={region.location}
            onClick={() => handleMarkerClick(region.id)}
            icon={getMarkerIcon(region.id)}
          >
            {selectedMarker === region.id && (
              <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                <div className="text-sm font-medium text-slate-900 p-1">
                  {region.name}
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}

        {/* User clicked location */}
        {clickedLocation && (
          <Marker
            position={clickedLocation}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            }}
          />
        )}
      </GoogleMap>
      
      <div className="absolute bottom-3 left-3 text-xs bg-slate-800/80 text-slate-300 py-1 px-2 rounded">
        Click anywhere on the map to select a location
      </div>
    </div>
  );
}