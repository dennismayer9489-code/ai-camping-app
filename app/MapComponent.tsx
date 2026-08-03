'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { CampingSite } from './page';

const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface MapProps {
  sites: CampingSite[];
}

export default function MapComponent({ sites }: MapProps) {
  // Standard-Zentrum: Kroatien
  const defaultCenter: [number, number] = [45.0812, 13.6428];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {sites.map((site) => (
        <Marker key={site.id} position={[site.lat, site.lng]} icon={customIcon}>
          <Popup>
            <div className="p-1">
              <b className="text-base">{site.name}</b>
              <br />
              <span className="text-sm text-slate-600">{site.location}</span>
              <br />
              <span className="font-bold text-emerald-600 mt-1 inline-block">{site.price}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}