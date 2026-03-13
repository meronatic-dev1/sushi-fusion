'use client';

import React, { useState, useEffect } from 'react';
import { getLocations, ApiLocation } from '@/lib/api';
import GoogleMapPicker, { PickedLocation } from './GoogleMapPicker';

function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: string;
    onProceed: (data: any) => void;
    t: (key: string) => string;
}

export default function LocationModal({ isOpen, onClose, mode, onProceed, t }: LocationModalProps) {
    const [activeTab, setActiveTab] = useState<'Delivery' | 'Pickup'>('Delivery');
    const [city, setCity] = useState('');
    const [store, setStore] = useState('');
    const [locations, setLocations] = useState<ApiLocation[]>([]);
    const [isLocating, setIsLocating] = useState(false);

    // State from Google Map Picker
    const [pickedLocation, setPickedLocation] = useState<PickedLocation | null>(null);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(mode === 'Pickup' ? 'Pickup' : 'Delivery');
            loadLocations();
        }
    }, [isOpen, mode]);

    const loadLocations = async () => {
        try {
            const data = await getLocations();
            setLocations(data);
        } catch (e) {
            console.error('Failed to load locations', e);
        }
    };

    const handleLocationSelect = (loc: PickedLocation) => {
        setPickedLocation(loc);

        // Auto-select nearest branch for pickup too
        if (locations.length > 0) {
            let nearest = locations[0];
            let minDist = getHaversineDistance(loc.lat, loc.lng, nearest.latitude, nearest.longitude);
            for (let i = 1; i < locations.length; i++) {
                const d = getHaversineDistance(loc.lat, loc.lng, locations[i].latitude, locations[i].longitude);
                if (d < minDist) {
                    minDist = d;
                    nearest = locations[i];
                }
            }
            setCity('Auto-detected');
            setStore(nearest.id);
        }
    };

    const handleUseMyLocationForPickup = () => {
        if (!navigator.geolocation) return;
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setPickedLocation({ lat: latitude, lng: longitude, address: 'Current Location' });

                if (locations.length > 0) {
                    let nearest = locations[0];
                    let minDist = getHaversineDistance(latitude, longitude, nearest.latitude, nearest.longitude);
                    for (let i = 1; i < locations.length; i++) {
                        const d = getHaversineDistance(latitude, longitude, locations[i].latitude, locations[i].longitude);
                        if (d < minDist) {
                            minDist = d;
                            nearest = locations[i];
                        }
                    }
                    setCity('Auto-detected');
                    setStore(nearest.id);
                }
                setIsLocating(false);
            },
            () => { setIsLocating(false); },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    if (!isOpen) return null;

    const handleDeliverySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pickedLocation) {
            alert('Please select a delivery location on the map.');
            return;
        }
        onProceed({
            mode: 'Delivery',
            address: pickedLocation.address,
            lat: pickedLocation.lat,
            lng: pickedLocation.lng,
        });
    };

    const handlePickupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedBranch = locations.find(l => l.id === store);
        onProceed({
            mode: 'Pickup',
            city,
            store,
            lat: selectedBranch?.latitude || pickedLocation?.lat || 0,
            lng: selectedBranch?.longitude || pickedLocation?.lng || 0,
            address: selectedBranch?.address || '',
        });
    };

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">
                        {activeTab === 'Delivery' ? 'Select Delivery Location' : 'Select Pickup Location'}
                    </h2>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-tabs">
                    <button
                        className={`modal-tab ${activeTab === 'Delivery' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Delivery')}
                        type="button"
                    >
                        Delivery
                    </button>
                    <button
                        className={`modal-tab ${activeTab === 'Pickup' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Pickup')}
                        type="button"
                    >
                        Pickup
                    </button>
                </div>

                <div className="modal-body">
                    {activeTab === 'Delivery' && (
                        <form id="delivery-form" onSubmit={handleDeliverySubmit}>
                            <GoogleMapPicker
                                onLocationSelect={handleLocationSelect}
                                height={300}
                            />

                            <div className="login-prompt-bar" style={{ marginTop: 12 }}>
                                <span className="login-prompt-text">Login to use your saved addresses</span>
                                <button type="button" className="login-prompt-btn">Login</button>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary-large"
                                style={{ marginTop: 12, opacity: pickedLocation ? 1 : 0.5 }}
                            >
                                CONFIRM LOCATION
                            </button>
                        </form>
                    )}

                    {activeTab === 'Pickup' && (
                        <form id="pickup-form" onSubmit={handlePickupSubmit} className="pickup-form">
                            <div className="pickup-form-group">
                                <label className="pickup-form-label" htmlFor="city-select">Select City</label>
                                <select
                                    id="city-select"
                                    className="pickup-form-select"
                                    value={city}
                                    onChange={(e) => {
                                        setCity(e.target.value);
                                        setStore('');
                                    }}
                                    required
                                >
                                    <option value="" disabled>Select your city...</option>
                                    <option value="Auto-detected">Auto-detected</option>
                                    {Array.from(new Set(locations.map(l => l.address.split(',').pop()?.trim() || 'Other'))).map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pickup-form-group">
                                <label className="pickup-form-label" htmlFor="store-select">Select Outlet</label>
                                <select
                                    id="store-select"
                                    className="pickup-form-select"
                                    value={store}
                                    onChange={(e) => setStore(e.target.value)}
                                    required
                                    disabled={!city}
                                >
                                    <option value="" disabled>Select an outlet...</option>
                                    {locations
                                        .filter(l => city === 'Auto-detected' || l.address.toLowerCase().includes(city.toLowerCase()))
                                        .map(l => (
                                            <option key={l.id} value={l.id}>{l.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <button
                                type="button"
                                className="btn-outlined-location"
                                onClick={handleUseMyLocationForPickup}
                                disabled={isLocating}
                            >
                                {isLocating ? 'Locating…' : <><img src="/images/location.png" alt="" style={{ width: 14, height: 14, objectFit: 'contain', verticalAlign: 'middle' }} /> Use My Location</>}
                            </button>

                            <p className="pickup-helper-text">
                                Which outlet you would like to pickup from. Pickup service is available at select outlets only.
                            </p>

                            <button
                                type="submit"
                                className="btn-primary-large"
                                disabled={!city || !store}
                            >
                                PROCEED
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
