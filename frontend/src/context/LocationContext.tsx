'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getLocations, ApiLocation } from '@/lib/api';
import { getDistance } from '@/lib/delivery';

export interface LocationData {
    lat: number;
    lng: number;
    address: string;
    mode: 'Delivery' | 'Pickup' | 'DineIn';
    branchId: string | null;
}

interface LocationContextType {
    location: LocationData | null;
    setLocation: (data: LocationData) => void;
    distanceKm: number | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
    const [location, setLocationState] = useState<LocationData | null>(null);
    const [branches, setBranches] = useState<ApiLocation[]>([]);
    const [distanceKm, setDistanceKm] = useState<number | null>(null);

    useEffect(() => {
        getLocations().then(setBranches).catch(console.error);
        
        // Load from localStorage on mount
        const saved = localStorage.getItem('sushi_fusion_location');
        if (saved) {
            try {
                setLocationState(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse saved location:', e);
            }
        }
    }, []);

    useEffect(() => {
        if (location) {
            localStorage.setItem('sushi_fusion_location', JSON.stringify(location));
        }
    }, [location]);

    useEffect(() => {
        if (location && location.lat && location.lng && branches.length > 0) {
            let minDistance = Infinity;
            branches.forEach(b => {
                if (!b.isActive) return;
                const d = getDistance(location.lat, location.lng, b.latitude, b.longitude);
                if (d < minDistance) minDistance = d;
            });
            if (minDistance !== Infinity) {
                setDistanceKm(minDistance);
            }
        }
    }, [location, branches]);

    const setLocation = (data: LocationData) => {
        console.log('LocationContext: Setting global location:', data);
        setLocationState(data);
    };

    return (
        <LocationContext.Provider value={{ location, setLocation, distanceKm }}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocation() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
}
