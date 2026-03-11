'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';

export interface PickedLocation {
  lat: number;
  lng: number;
  address: string;
}

interface GoogleMapPickerProps {
  onLocationSelect: (location: PickedLocation) => void;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  height?: string | number;
}

const DEFAULT_CENTER = { lat: 25.3463, lng: 55.4209 }; // Sharjah default

function MapInner({
  markerPos,
  setMarkerPos,
  onLocationSelect,
  initialZoom
}: {
  markerPos: google.maps.LatLngLiteral;
  setMarkerPos: (pos: google.maps.LatLngLiteral) => void;
  onLocationSelect: (location: PickedLocation) => void;
  initialZoom: number;
}) {
  const map = useMap();
  const placesLibrary = useMapsLibrary('places');
  const geocodingLibrary = useMapsLibrary('geocoding');

  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const autocompleteContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Geocoder
  useEffect(() => {
    if (geocodingLibrary) {
      geocoderRef.current = new geocodingLibrary.Geocoder();
    }
  }, [geocodingLibrary]);

  const reverseGeocode = useCallback(
    (lat: number, lng: number) => {
      if (!geocoderRef.current) return;
      geocoderRef.current.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const formatted = results[0].formatted_address;
            setAddress(formatted);
            onLocationSelect({ lat, lng, address: formatted });
          } else {
            const fallback = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            setAddress(fallback);
            onLocationSelect({ lat, lng, address: fallback });
          }
        }
      );
    },
    [onLocationSelect]
  );

  // Initialize PlaceAutocompleteElement
  useEffect(() => {
    if (!placesLibrary || !autocompleteContainerRef.current) return;

    // Create the new PlaceAutocompleteElement
    const autocompleteEl = new (placesLibrary as any).PlaceAutocompleteElement({
      componentRestrictions: { country: ['ae'] },
      requestedLanguage: 'en',
    });

    // Replace the container contents with the new element
    autocompleteContainerRef.current.innerHTML = '';
    autocompleteContainerRef.current.appendChild(autocompleteEl);

    // Style the input slightly to match previous aesthetics
    autocompleteEl.style.width = '100%';
    autocompleteEl.style.boxSizing = 'border-box';
    autocompleteEl.style.fontSize = '14px';
    autocompleteEl.style.fontFamily = '"DM Sans", sans-serif';

    const handlePlaceSelect = async (e: any) => {
      const selectedPlace = e.place || e.detail?.place;
      if (!selectedPlace) return;

      try {
        await selectedPlace.fetchFields({ 
          fields: ['location', 'formattedAddress', 'displayName'] 
        });

        if (!selectedPlace.location) return;

        const lat = typeof selectedPlace.location.lat === 'function' 
          ? selectedPlace.location.lat() 
          : selectedPlace.location.lat;
        const lng = typeof selectedPlace.location.lng === 'function' 
          ? selectedPlace.location.lng() 
          : selectedPlace.location.lng;
        
        const formatted = selectedPlace.formattedAddress || selectedPlace.displayName || '';

        setMarkerPos({ lat, lng });
        setAddress(formatted);
        onLocationSelect({ lat, lng, address: formatted });

        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(16);
        }
      } catch (error) {
        console.error('Error selecting place:', error);
      }
    };

    autocompleteEl.addEventListener('gmp-placeselect', handlePlaceSelect);

    return () => {
      autocompleteEl.removeEventListener('gmp-placeselect', handlePlaceSelect);
    };
  }, [placesLibrary, map, setMarkerPos, onLocationSelect]);

  const handleMapClick = useCallback((e: any) => {
    if (!e.detail.latLng) return;
    const lat = e.detail.latLng.lat;
    const lng = e.detail.latLng.lng;
    setMarkerPos({ lat, lng });
    reverseGeocode(lat, lng);
  }, [reverseGeocode, setMarkerPos]);

  const handleMarkerDragEnd = useCallback((e: any) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPos({ lat, lng });
    reverseGeocode(lat, lng);
  }, [reverseGeocode, setMarkerPos]);

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMarkerPos({ lat, lng });
        reverseGeocode(lat, lng);
        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(16);
        }
        setIsLocating(false);
      },
      () => {
        alert('Unable to get your location. Please allow location access.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, [map, reverseGeocode, setMarkerPos]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      {/* Search container */}
      <div 
        ref={autocompleteContainerRef} 
        style={{ 
          width: '100%', 
          borderRadius: 12, 
          background: '#faf8f5',
          border: '1.5px solid #e8ddd2',
        }} 
      />

      <div style={mapWrapperStyle(typeof window !== 'undefined' ? '100%' : 320)}>
        <Map
          mapId="sushi_fusion_map"
          defaultCenter={markerPos}
          defaultZoom={initialZoom}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          zoomControl={true}
          onClick={handleMapClick}
          style={{ width: '100%', height: '100%', borderRadius: 14 }}
        >
          <AdvancedMarker 
            position={markerPos}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
        </Map>

        {/* GPS button */}
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isLocating}
          style={gpsButtonStyle}
          title="Use my current location"
        >
          {isLocating ? (
            <div style={{ ...spinnerStyle, width: 16, height: 16, borderWidth: 2 }} />
          ) : (
            '📍'
          )}
        </button>
      </div>

      {/* Selected address display */}
      {address && (
        <div style={addressPillStyle}>
          <span style={{ fontSize: 14 }}>📌</span>
          <span style={{ fontSize: 12, color: '#5a4030', fontWeight: 600, lineHeight: 1.4 }}>
            {address}
          </span>
        </div>
      )}
    </div>
  );
}

export default function GoogleMapPicker(props: GoogleMapPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral>(
    props.initialCenter || DEFAULT_CENTER
  );

  if (!apiKey) {
    return (
      <div style={errorBoxStyle}>
        <p style={{ margin: 0, fontWeight: 700, color: '#d32f2f' }}>
          Failed to load Google Maps
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#888' }}>
          Check your API key in <code>.env.local</code>. (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing)
        </p>
      </div>
    );
  }

  return (
    <div style={{ height: props.height || 320, width: '100%' }}>
      <APIProvider apiKey={apiKey} libraries={['places', 'marker', 'geocoding']} version="beta">
        <MapInner 
          markerPos={markerPos} 
          setMarkerPos={setMarkerPos}
          onLocationSelect={props.onLocationSelect}
          initialZoom={props.initialZoom || 14}
        />
      </APIProvider>
    </div>
  );
}

// ── Styles ──

const mapWrapperStyle = (height: string | number): React.CSSProperties => ({
  position: 'relative',
  width: '100%',
  height: typeof height === 'number' ? height : height,
  borderRadius: 14,
  overflow: 'hidden',
  border: '1.5px solid #e8ddd2',
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
});

const gpsButtonStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 14,
  right: 14,
  width: 40,
  height: 40,
  borderRadius: '50%',
  border: '1.5px solid #e8ddd2',
  background: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: 18,
  boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
  transition: 'all 0.18s',
  zIndex: 2,
};

const addressPillStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 8,
  background: '#fff8f3',
  border: '1px solid #ffdcc4',
  borderRadius: 10,
  padding: '10px 14px',
};

const errorBoxStyle: React.CSSProperties = {
  padding: 24,
  borderRadius: 14,
  background: '#fff5f5',
  border: '1px solid #ffc9c9',
  textAlign: 'center',
};

const spinnerStyle: React.CSSProperties = {
  width: 24,
  height: 24,
  border: '3px solid #e8ddd2',
  borderTopColor: '#FF6A0C',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
  margin: '0 auto',
};
