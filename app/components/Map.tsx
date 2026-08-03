'use client';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Standard-Icon-Fix für Next.js, damit die Nadeln immer sichtbar sind
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Hilfskomponente, damit die Karte bei einer neuen Suche automatisch zum Ort springt
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 12);
  return null;
}

// Typisierung, damit TypeScript nicht mehr meckert
interface MapProps {
  sites: Array<{
    id: number;
    name: string;
    location: string;
    lat: number;
    lng: number;
    description?: string;
  }>;
  center: [number, number];
}

export default function Map({ sites, center }: MapProps) {
  return (
    <MapContainer 
      center={center} 
      zoom={12} 
      style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Automatischer Zoom auf die gesuchte Stadt */}
      <ChangeView center={center} />
      
      {/* Nadeln für alle Campingplätze setzen */}
      {sites.map(site => (
        <Marker key={site.id} position={[site.lat, site.lng]} icon={customIcon}>
          <Popup>
            <div className="font-sans">
              <strong className="text-lg text-emerald-700">{site.name}</strong><br />
              <span className="text-slate-500 text-sm">{site.location}</span><br />
              <p className="mt-2 text-sm">{site.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}