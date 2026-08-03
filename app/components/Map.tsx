'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Standard-Icon-Fix für Leaflet in Next.js (verhindert fehlende Marker-Grafiken)
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Campingplatz-Beispieldaten für die Karten-Marker
const campsites = [
  {
    id: 1,
    name: 'Camping Mon Perin',
    location: 'Bale / Rovinj',
    lat: 45.0117,
    lng: 13.7228,
    description: 'Riesiges Areal am Meer mit Paleo Park & viel Schatten.',
  },
  {
    id: 2,
    name: 'Camping Polari',
    location: 'Rovinj',
    lat: 45.0603,
    lng: 13.6736,
    description: 'Große Poollandschaft und direkte Strandlage.',
  },
  {
    id: 3,
    name: 'Camping Amarin',
    location: 'Rovinj',
    lat: 45.1051,
    lng: 13.6214,
    description: 'Familienfreundlicher Platz mit Blick auf die Altstadt.',
  },
];

export default function Map() {
  // Zentrierung der Karte auf die Region Rovinj
  const centerPosition: [number, number] = [45.0812, 13.6387];

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-md">
      <MapContainer
        center={centerPosition}
        zoom={11}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[400px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {campsites.map((site) => (
          <Marker
            key={site.id}
            position={[site.lat, site.lng]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-base mb-1">{site.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{site.location}</p>
                <p className="text-xs text-gray-500">{site.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}