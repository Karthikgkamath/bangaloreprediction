import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import type { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icons issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Create default icon
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// @ts-ignore - Setting default icon for all markers
L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icons
const createMarkerIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker-icon",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [24, 24] as [number, number],
    iconAnchor: [12, 12] as [number, number],
    popupAnchor: [0, -12] as [number, number]
  });
};

// Bangalore center coordinates
const bangaloreCenter: LatLngExpression = [12.9716, 77.5946];

// Define Bangalore neighborhoods
const bangaloreRegions = [
  { id: 'indiranagar', name: 'Indiranagar', location: [12.9784, 77.6408] as LatLngExpression, color: '#FF6B6B' },
  { id: 'koramangala', name: 'Koramangala', location: [12.9279, 77.6271] as LatLngExpression, color: '#4ECDC4' },
  { id: 'jayanagar', name: 'Jayanagar', location: [12.9299, 77.5845] as LatLngExpression, color: '#FFD166' },
  { id: 'whitefield', name: 'Whitefield', location: [12.9698, 77.7500] as LatLngExpression, color: '#6A0572' },
  { id: 'electronic-city', name: 'Electronic City', location: [12.8399, 77.6770] as LatLngExpression, color: '#1A535C' },
  { id: 'rajajinagar', name: 'Rajajinagar', location: [12.9855, 77.5565] as LatLngExpression, color: '#F5587B' },
  { id: 'hebbal', name: 'Hebbal', location: [13.0358, 77.5970] as LatLngExpression, color: '#00A8E8' },
];

interface OpenStreetMapProps {
  onSelectLocation: (location: { lat: number; lng: number; address: string }) => void;
}

// MapEventHandler component to capture clicks
function MapEventHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e: LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function BangaloreOpenStreetMap({ onSelectLocation }: OpenStreetMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [clickedLocation, setClickedLocation] = useState<LatLngExpression | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Function to handle map click
  const handleMapClick = async (lat: number, lng: number) => {
    setClickedLocation([lat, lng]);
    
    try {
      // Use Nominatim API for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        onSelectLocation({ lat, lng, address: data.display_name });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      // Fallback to a generic address if geocoding fails
      onSelectLocation({ 
        lat, 
        lng, 
        address: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}` 
      });
    }
  };
  
  // Handle marker click for predefined regions
  const handleMarkerClick = async (regionId: string) => {
    setSelectedRegion(regionId);
    const region = bangaloreRegions.find(r => r.id === regionId);
    
    if (region) {
      const latLng = region.location;
      setClickedLocation(latLng);
      
      // Extract lat/lng from the LatLngExpression
      const lat = Array.isArray(latLng) ? latLng[0] : latLng.lat;
      const lng = Array.isArray(latLng) ? latLng[1] : latLng.lng;
      
      try {
        // Use Nominatim API for reverse geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        if (data && data.display_name) {
          onSelectLocation({ lat, lng, address: data.display_name });
        } else {
          // Fallback if we can't get the address
          onSelectLocation({ lat, lng, address: `${region.name}, Bangalore` });
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        // Fallback to region name if geocoding fails
        onSelectLocation({ lat, lng, address: `${region.name}, Bangalore` });
      }
    }
  };

  const mapStyle = { height: '100%', width: '100%', borderRadius: '0.5rem' };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative">
      <MapContainer
        center={bangaloreCenter}
        zoom={11}
        style={mapStyle}
        ref={mapRef}
      >
        {/* Base map layer */}
        <TileLayer
          // @ts-ignore - attribution property exists but TypeScript doesn't recognize it
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Event handler for map clicks */}
        <MapEventHandler onMapClick={handleMapClick} />
        
        {/* Region markers */}
        {bangaloreRegions.map((region) => (
          <Marker
            key={region.id}
            position={region.location}
            // @ts-ignore - icon property exists but TypeScript doesn't recognize it
            icon={createMarkerIcon(region.color)}
            // @ts-ignore - eventHandlers property exists but TypeScript doesn't recognize it
            eventHandlers={{
              click: () => handleMarkerClick(region.id),
            }}
          >
            <Popup>
              <div className="text-sm font-medium p-1">
                {region.name}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* User clicked location */}
        {clickedLocation && (
          <Marker
            position={clickedLocation}
            // @ts-ignore - icon property exists but TypeScript doesn't recognize it
            icon={createMarkerIcon('#4CAF50')} // Green marker for user clicks
          >
            <Popup>
              <div className="text-sm font-medium p-1">
                Selected Location
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      <div className="absolute bottom-3 left-3 text-xs bg-slate-800/80 text-slate-300 py-1 px-2 rounded z-[1000]">
        Click anywhere on the map to select a location
      </div>
    </div>
  );
}