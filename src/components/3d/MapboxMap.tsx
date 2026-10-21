import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
    onBuildingHover?: (building: string | null) => void;
    onBuildingClick?: (building: string) => void;
    isDayMode?: boolean;
}

// Location coordinates for animation sequence
const WORLD_CENTER = {
    lat: 20,
    lng: 0
};

const INDIA_CENTER = {
    lat: 20,
    lng: 78
};

const GWALIOR_CENTER = {
    lat: 26.2,
    lng: 78.15
};

const MITS_CENTER = {
    lat: 26.23027,
    lng: 78.20717
};

function MapboxMap({
    onBuildingHover,
    onBuildingClick,
    isDayMode = false
}: MapboxMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);

    // Set Mapbox token directly (split to avoid aggressive secret scanners)
    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN ?? "";

    useEffect(() => {
        // Token is guaranteed to exist now
        mapboxgl.accessToken = mapboxToken;

        if (!mapContainer.current) return;

        // Initialize map - start fully zoomed out
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: isDayMode ? 'mapbox://styles/mapbox/outdoors-v12' : 'mapbox://styles/mapbox/dark-v11',
            center: [WORLD_CENTER.lng, WORLD_CENTER.lat],
            zoom: 1.5,
            pitch: 0,
            bearing: 0,
            antialias: true
        });

        // Add 3D buildings layer and start animation sequence
        map.current.on('load', () => {
            if (!map.current) return;

            // Start zoom animation sequence after 2 seconds
            setTimeout(() => {
                if (!map.current) return;

                // Animate to India
                map.current.flyTo({
                    center: [INDIA_CENTER.lng, INDIA_CENTER.lat],
                    zoom: 4,
                    pitch: 0,
                    duration: 1000
                });

                // After India animation, animate to Gwalior
                setTimeout(() => {
                    if (!map.current) return;

                    map.current.flyTo({
                        center: [GWALIOR_CENTER.lng, GWALIOR_CENTER.lat],
                        zoom: 10,
                        pitch: 0,
                        duration: 1000
                    });

                    // After Gwalior animation, animate to MITS Gwalior College
                    setTimeout(() => {
                        if (!map.current) return;

                        map.current.flyTo({
                            center: [MITS_CENTER.lng, MITS_CENTER.lat],
                            zoom: 17,
                            pitch: 45,
                            bearing: 0,
                            duration: 1000
                        });
                    }, 1000);
                }, 1000);
            }, 1000);

            // Check if 3D buildings layer exists
            if (!map.current.getLayer('3d-buildings')) {
                map.current.addLayer(
                    {
                        id: '3d-buildings',
                        source: 'composite',
                        'source-layer': 'building',
                        type: 'fill-extrusion',
                        paint: {
                            'fill-extrusion-color': isDayMode ? '#D4C5B9' : '#8B8B8B',
                            'fill-extrusion-height': [
                                'interpolate',
                                ['linear'],
                                ['zoom'],
                                15,
                                0,
                                15.05,
                                ['get', 'height']
                            ],
                            'fill-extrusion-base': [
                                'interpolate',
                                ['linear'],
                                ['zoom'],
                                15,
                                0,
                                15.05,
                                ['get', 'min_height']
                            ],
                            'fill-extrusion-opacity': isDayMode ? 0.8 : 0.85
                        }
                    },
                    'waterway-label'
                );
            }

            // Add hover effect on buildings
            map.current.on('mousemove', '3d-buildings', (e) => {
                if (map.current) {
                    map.current.getCanvas().style.cursor = 'pointer';
                    // Get building data if available
                    const buildingName = (e.features?.[0]?.properties?.name as string) || 'Building';
                    onBuildingHover?.(buildingName);
                }
            });

            map.current.on('mouseleave', '3d-buildings', () => {
                if (map.current) {
                    map.current.getCanvas().style.cursor = 'default';
                    onBuildingHover?.(null);
                }
            });

            map.current.on('click', '3d-buildings', (e) => {
                const buildingName = (e.features?.[0]?.properties?.name as string) || 'Building';
                onBuildingClick?.(buildingName);
            });
        });

        // Update style when day/night mode changes
        const updateStyle = () => {
            if (map.current) {
                const newStyle = isDayMode ? 'mapbox://styles/mapbox/outdoors-v12' : 'mapbox://styles/mapbox/dark-v11';
                map.current.setStyle(newStyle);

                // Re-add 3D buildings layer after style change
                map.current.on('style.load', () => {
                    if (!map.current?.getLayer('3d-buildings')) {
                        map.current?.addLayer(
                            {
                                id: '3d-buildings',
                                source: 'composite',
                                'source-layer': 'building',
                                type: 'fill-extrusion',
                                paint: {
                                    'fill-extrusion-color': isDayMode ? '#D4C5B9' : '#8B8B8B',
                                    'fill-extrusion-height': [
                                        'interpolate',
                                        ['linear'],
                                        ['zoom'],
                                        15,
                                        0,
                                        15.05,
                                        ['get', 'height']
                                    ],
                                    'fill-extrusion-base': [
                                        'interpolate',
                                        ['linear'],
                                        ['zoom'],
                                        15,
                                        0,
                                        15.05,
                                        ['get', 'min_height']
                                    ],
                                    'fill-extrusion-opacity': isDayMode ? 0.8 : 0.85
                                }
                            },
                            'waterway-label'
                        );
                    }
                });
            }
        };

        // Cleanup function
        return () => {
            if (map.current) {
                map.current.remove();
            }
        };
    }, [isDayMode, onBuildingHover, onBuildingClick]);

    return (
        <div
            ref={mapContainer}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                position: 'relative'
            }}
            className="mapbox-container"
        />
    );
}

export { MapboxMap };
export default MapboxMap;
