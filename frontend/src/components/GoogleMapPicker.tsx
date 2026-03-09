'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    Autocomplete,
} from '@react-google-maps/api';

const LIBRARIES: ('places')[] = ['places'];

const MAP_CONTAINER_STYLE: React.CSSProperties = {
    width: '100%',
    height: '100%',
    borderRadius: 14,
};

const DEFAULT_CENTER = { lat: 25.3463, lng: 55.4209 }; // Sharjah default

const MAP_OPTIONS: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    gestureHandling: 'greedy',
    styles: [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
        },
        {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
        },
    ],
};

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

export default function GoogleMapPicker({
    onLocationSelect,
    initialCenter,
    initialZoom = 14,
    height = 320,
}: GoogleMapPickerProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        libraries: LIBRARIES,
    });

    const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral>(
        initialCenter || DEFAULT_CENTER
    );
    const [address, setAddress] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const mapRef = useRef<google.maps.Map | null>(null);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    // Initialize geocoder when map loads
    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
        geocoderRef.current = new google.maps.Geocoder();
    }, []);

    // Reverse-geocode a lat/lng to a readable address
    const reverseGeocode = useCallback(
        (lat: number, lng: number) => {
            if (!geocoderRef.current) return;
            geocoderRef.current.geocode(
                { location: { lat, lng } },
                (results, status) => {
                    if (status === 'OK' && results && results[0]) {
                        const formatted = results[0].formatted_address;
                        setAddress(formatted);
                        setSearchValue(formatted);
                        onLocationSelect({ lat, lng, address: formatted });
                    } else {
                        const fallback = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                        setAddress(fallback);
                        setSearchValue(fallback);
                        onLocationSelect({ lat, lng, address: fallback });
                    }
                }
            );
        },
        [onLocationSelect]
    );

    // Handle map click — place marker
    const handleMapClick = useCallback(
        (e: google.maps.MapMouseEvent) => {
            if (!e.latLng) return;
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMarkerPos({ lat, lng });
            reverseGeocode(lat, lng);
        },
        [reverseGeocode]
    );

    // Handle marker drag end
    const handleMarkerDragEnd = useCallback(
        (e: google.maps.MapMouseEvent) => {
            if (!e.latLng) return;
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMarkerPos({ lat, lng });
            reverseGeocode(lat, lng);
        },
        [reverseGeocode]
    );

    // Handle autocomplete place selection
    const handlePlaceChanged = useCallback(() => {
        if (!autocompleteRef.current) return;
        const place = autocompleteRef.current.getPlace();
        if (!place.geometry?.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const formatted = place.formatted_address || place.name || '';

        setMarkerPos({ lat, lng });
        setAddress(formatted);
        setSearchValue(formatted);
        onLocationSelect({ lat, lng, address: formatted });

        // Pan map to the selected place
        if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(16);
        }
    }, [onLocationSelect]);

    // "Use My Location" — browser geolocation
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
                if (mapRef.current) {
                    mapRef.current.panTo({ lat, lng });
                    mapRef.current.setZoom(16);
                }
                setIsLocating(false);
            },
            () => {
                alert('Unable to get your location. Please allow location access.');
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    }, [reverseGeocode]);

    // ── Loading / Error states ──
    if (loadError) {
        return (
            <div style={errorBoxStyle}>
                <p style={{ margin: 0, fontWeight: 700, color: '#d32f2f' }}>
                    Failed to load Google Maps
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#888' }}>
                    Check your API key in <code>.env.local</code>
                </p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div style={{ ...mapWrapperStyle(height), display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f0ea' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={spinnerStyle} />
                    <p style={{ fontSize: 13, color: '#a08060', marginTop: 12 }}>Loading map…</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Search bar with autocomplete */}
            <div style={{ position: 'relative' }}>
                <Autocomplete
                    onLoad={(ac) => { autocompleteRef.current = ac; }}
                    onPlaceChanged={handlePlaceChanged}
                    options={{
                        componentRestrictions: { country: 'ae' },
                        fields: ['geometry', 'formatted_address', 'name'],
                    }}
                >
                    <input
                        type="text"
                        placeholder="Search for your address…"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        style={searchInputStyle}
                    />
                </Autocomplete>
                <span style={searchIconStyle}>🔍</span>
            </div>

            {/* Map container */}
            <div style={mapWrapperStyle(height)}>
                <GoogleMap
                    mapContainerStyle={MAP_CONTAINER_STYLE}
                    center={markerPos}
                    zoom={initialZoom}
                    options={MAP_OPTIONS}
                    onClick={handleMapClick}
                    onLoad={onMapLoad}
                >
                    <Marker
                        position={markerPos}
                        draggable
                        onDragEnd={handleMarkerDragEnd}
                        animation={google.maps.Animation.DROP}
                    />
                </GoogleMap>

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

const searchInputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 16px 12px 38px',
    fontSize: 14,
    fontFamily: '"DM Sans", sans-serif',
    color: '#1a1108',
    background: '#faf8f5',
    border: '1.5px solid #e8ddd2',
    borderRadius: 12,
    outline: 'none',
    transition: 'all 0.18s',
};

const searchIconStyle: React.CSSProperties = {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 14,
    pointerEvents: 'none',
};

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
