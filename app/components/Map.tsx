'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Standard-Icon Fix für Leaflet in Next.js
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Definition der Datenstruktur für einen Campingplatz
interface CampingSite {
  id: number;
  name: string;
  location: string;
  lat: number;
  lng: number;
  tags: string[];
  price: string;
  sponsored: boolean;
  description: string;
}

interface MapProps {
  sites: CampingSite[];
}

export default function Map({ sites }: MapProps) {
  return (
    <MapContainer 
      center={[45.1094, 13.6006]} // Standard-Zentrum (z. B. Rovinj / Kroatien)
      zoom={10} 
      scrollWheelZoom={false}
      className="h-[450px] w-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Dynamisches Zeichnen aller übergebenen Campingplatz-Marker */}
      {sites && sites.map((site) => (
        <Marker key={site.id} position={[site.lat, site.lng]} icon={customIcon}>
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-sm">{site.name}</h3>
              <p className="text-xs text-slate-600">{site.location}</p>
              <p className="text-xs font-semibold text-emerald-600 mt-1">{site.price}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}