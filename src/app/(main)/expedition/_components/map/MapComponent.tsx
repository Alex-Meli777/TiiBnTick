import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapComponentProps {
    initialCenter: [number, number];
    initialZoom: number;
    onMapReady: (map: maplibregl.Map) => void;
}

const MapComponent = ({ initialCenter, initialZoom, onMapReady }: MapComponentProps) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://demotiles.maplibre.org/style.json', // Style gratuit pour démo
            center: [initialCenter[1], initialCenter[0]], // Longitude, Latitude
            zoom: initialZoom
        });

        map.current.on('load', () => {
            if (onMapReady && map.current) {
                onMapReady(map.current);
            }
        });

    }, [initialCenter, initialZoom, onMapReady]);

    return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};

export default MapComponent;
