import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';

@Controller('geocode')
export class GeocodeController {
    private readonly logger = new Logger(GeocodeController.name);

    /**
     * Server-side geocoding fallback.
     * When client-side geocoding fails, the frontend can call this endpoint
     * to convert an address string into lat/lng coordinates.
     *
     * Uses the Google Maps Geocoding API.
     */
    @Post()
    @HttpCode(HttpStatus.OK)
    async geocode(@Body() body: { address: string }) {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            this.logger.warn('GOOGLE_MAPS_API_KEY not set — returning city-center fallback');
            // Fallback: Sharjah city center (matches the no-fault routing "use city-center" spec)
            return {
                lat: 25.3463,
                lng: 55.4209,
                formattedAddress: 'Sharjah, UAE (fallback)',
                isFallback: true,
            };
        }

        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(body.address)}&key=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'OK' && data.results.length > 0) {
                const result = data.results[0];
                return {
                    lat: result.geometry.location.lat,
                    lng: result.geometry.location.lng,
                    formattedAddress: result.formatted_address,
                    isFallback: false,
                };
            }

            // Geocoding API returned no results — use city-center fallback
            this.logger.warn(`Geocoding failed for "${body.address}": ${data.status}`);
            return {
                lat: 25.3463,
                lng: 55.4209,
                formattedAddress: 'Sharjah, UAE (fallback)',
                isFallback: true,
            };
        } catch (error) {
            this.logger.error(`Geocoding error for "${body.address}":`, error);
            return {
                lat: 25.3463,
                lng: 55.4209,
                formattedAddress: 'Sharjah, UAE (fallback)',
                isFallback: true,
            };
        }
    }
}
