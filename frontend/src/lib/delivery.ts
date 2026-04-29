/**
 * Calculates the Haversine distance between two points on Earth in km.
 */
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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
