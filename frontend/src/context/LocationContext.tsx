'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
    const [location, setLocationState] = useState<LocationData | null>(null);

    const setLocation = (data: LocationData) => {
        console.log('LocationContext: Setting global location:', data);
        setLocationState(data);
    };

    return (
        <LocationContext.Provider value={{ location, setLocation }}>
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
