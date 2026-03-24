/**
 * Calculates the Haversine distance between two points on Earth in km.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

/**
 * Calculates delivery fee based on distance:
 * - Within 10KM: Free
 * - Up to 15KM: 10 AED
 * - Above 15KM: 15 AED
 */
export function calculateDeliveryFee(distanceKm: number): number {
    if (distanceKm <= 10) return 0;
    if (distanceKm <= 15) return 10;
    return 15;
}
