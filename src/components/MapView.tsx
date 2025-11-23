import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

interface MapViewProps {
  chargers: any[];
  center?: [number, number];
  zoom?: number;
}

export function MapView({ chargers, center = [28.6139, 77.2090], zoom = 11 }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Leaflet CSS
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    link.onload = () => {
      setIsLoaded(true);
    };

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || !isLoaded) return;

    // Fix default icon issue with Leaflet
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Custom icon
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: linear-gradient(135deg, #10b981 0%, #2563eb 100%);
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg style="transform: rotate(45deg); width: 16px; height: 16px;" viewBox="0 0 24 24" fill="white">
            <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // Add markers for each charger
    chargers.forEach((charger) => {
      const marker = L.marker([charger.lat, charger.lng], { icon: customIcon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(
          `
          <div style="min-width: 200px;">
            <h3 style="font-weight: 600; margin-bottom: 8px;">${charger.location}</h3>
            <p style="color: #6b7280; margin-bottom: 8px; font-size: 14px;">${charger.area}</p>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${charger.type}</span>
              <span style="font-size: 14px;">${charger.power}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid #e5e7eb;">
              <span style="font-weight: 600;">₹${charger.price}/hr</span>
              <button 
                onclick="window.location.href='/charger/${charger.id}'" 
                style="background: #10b981; color: white; padding: 4px 12px; border-radius: 6px; border: none; cursor: pointer; font-size: 14px;"
              >
                View Details
              </button>
            </div>
          </div>
        `,
          { maxWidth: 300 }
        );

      marker.on('click', () => {
        // Navigate to charger details when marker is clicked
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (chargers.length > 0) {
      const bounds = L.latLngBounds(chargers.map((c) => [c.lat, c.lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [chargers]);

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
