'use client';

import React, { useState, useEffect } from 'react';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: string;
    onProceed: (data: any) => void;
    t: (key: string) => string;
}

export default function LocationModal({ isOpen, onClose, mode, onProceed, t }: LocationModalProps) {
    const [activeTab, setActiveTab] = useState<'Delivery' | 'Pickup'>('Delivery');
    const [searchQuery, setSearchQuery] = useState('');
    const [city, setCity] = useState('');
    const [store, setStore] = useState('');
    const [geoError, setGeoError] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(mode === 'Pickup' ? 'Pickup' : 'Delivery');
            setGeoError(null);
        }
    }, [isOpen, mode]);

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            setGeoError('Geolocation is not supported in this browser.');
            return;
        }

        setIsLocating(true);
        setGeoError(null);

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setCurrentPosition({ lat: latitude, lng: longitude });
                const label = `Current location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
                setSearchQuery(label);
                setIsLocating(false);
            },
            (err) => {
                if (err.code === err.PERMISSION_DENIED) {
                    setGeoError('Location permission was denied. You can allow it in your browser settings.');
                } else {
                    setGeoError('Unable to fetch your current location. Please try again.');
                }
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const mapSrc = googleMapsKey
        ? currentPosition
            ? `https://www.google.com/maps/embed/v1/view?key=${googleMapsKey}&center=${currentPosition.lat},${currentPosition.lng}&zoom=15&maptype=roadmap`
            : `https://www.google.com/maps/embed/v1/view?key=${googleMapsKey}&center=25.3463,55.4209&zoom=13&maptype=roadmap`
        : currentPosition
            ? `https://www.openstreetmap.org/export/embed.html?bbox=${currentPosition.lng - 0.03},${currentPosition.lat - 0.03},${currentPosition.lng + 0.03},${currentPosition.lat + 0.03}&layer=mapnik&marker=${currentPosition.lat},${currentPosition.lng}`
            : "https://www.openstreetmap.org/export/embed.html?bbox=55.32%2C25.30%2C55.42%2C25.36&layer=mapnik";

    if (!isOpen) return null;

    const handleDeliverySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onProceed({ mode: 'Delivery', address: searchQuery || 'Current Location' });
    };

    const handlePickupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onProceed({ mode: 'Pickup', city, store });
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
                            <div className="delivery-search-bar">
                                <span className="search-icon">🔍</span>
                                <input 
                                    type="text" 
                                    placeholder="Search Location or Address" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <span className="country-flag">🇦🇪</span>
                            </div>

                            <div className="map-placeholder">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    frameBorder={0}
                                    scrolling="no"
                                    src={mapSrc}
                                    title="Location map"
                                />
                                <button
                                    type="button"
                                    className="map-recenter"
                                    title="Use my current location"
                                    onClick={handleUseMyLocation}
                                    disabled={isLocating}
                                >
                                    {isLocating ? '…' : '🧭'}
                                </button>
                            </div>

                            <div className="login-prompt-bar">
                                <span className="login-prompt-text">Login to use your saved addresses</span>
                                <button type="button" className="login-prompt-btn">Login</button>
                            </div>

                            {geoError && (
                                <p className="location-error-text">
                                    {geoError}
                                </p>
                            )}

                            <button type="submit" className="btn-primary-large">
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
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select your city...</option>
                                    <option value="Dubai">Dubai</option>
                                    <option value="Abu Dhabi">Abu Dhabi</option>
                                    <option value="Sharjah">Sharjah</option>
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
                                    <option value="Jumeirah Branch">Jumeirah Branch</option>
                                    <option value="Downtown Mall">Downtown Mall</option>
                                    <option value="Marina Walk">Marina Walk</option>
                                </select>
                            </div>

                            <button
                                type="button"
                                className="btn-outlined-location"
                                onClick={handleUseMyLocation}
                                disabled={isLocating}
                            >
                                {isLocating ? 'Locating…' : '📍 Use My Location'}
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
