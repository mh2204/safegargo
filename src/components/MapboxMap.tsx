import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
    accessToken: string;
    pickupLat?: number;
    pickupLng?: number;
    deliveryLat?: number;
    deliveryLng?: number;
}

const MapboxMap = ({
    accessToken,
    pickupLat,
    pickupLng,
    deliveryLat,
    deliveryLng,
}: MapboxMapProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current || !accessToken) return;

        mapboxgl.accessToken = accessToken;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v11', // Midnight aesthetic
            center: [pickupLng || 36.8219, pickupLat || -1.2921], // Default to Nairobi
            zoom: 12,
        });

        mapRef.current = map;

        map.on('load', async () => {
            // Add markers
            if (pickupLat && pickupLng) {
                new mapboxgl.Marker({ color: '#00ffff' }) // Electric Cyan
                    .setLngLat([pickupLng, pickupLat])
                    .addTo(map);
            }

            if (deliveryLat && deliveryLng) {
                new mapboxgl.Marker({ color: '#06b6d4' }) // Primary
                    .setLngLat([deliveryLng, deliveryLat])
                    .addTo(map);
            }

            // Add route line if both points exist
            if (pickupLat && pickupLng && deliveryLat && deliveryLng) {
                try {
                    // Simple straight line for now, or use Mapbox Directions API for real routing
                    // For a true logistics feel, a real route is better
                    const query = await fetch(
                        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupLng},${pickupLat};${deliveryLng},${deliveryLat}?steps=true&geometries=geojson&access_token=${accessToken}`
                    );
                    const json = await query.json();
                    const data = json.routes[0];
                    const route = data.geometry.coordinates;

                    map.addSource('route', {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'LineString',
                                coordinates: route,
                            },
                        },
                    });

                    map.addLayer({
                        id: 'route',
                        type: 'line',
                        source: 'route',
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round',
                        },
                        paint: {
                            'line-color': '#00ffff',
                            'line-width': 4,
                            'line-opacity': 0.75,
                        },
                    });

                    // Fit bounds
                    const bounds = new mapboxgl.LngLatBounds()
                        .extend([pickupLng, pickupLat])
                        .extend([deliveryLng, deliveryLat]);

                    map.fitBounds(bounds, { padding: 50 });

                } catch (error) {
                    console.error('Error fetching route:', error);
                }
            }
        });

        return () => map.remove();
    }, [accessToken, pickupLat, pickupLng, deliveryLat, deliveryLng]);

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            <div ref={mapContainerRef} className="w-full h-full" />
        </div>
    );
};

export default MapboxMap;
