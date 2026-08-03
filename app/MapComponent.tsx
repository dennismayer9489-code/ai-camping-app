'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Standard-Icon-Fix für Leaflet in Next.js
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapComponent() {
  return (
    <MapContainer 
      center={[45.0812, 13.6428]} // Zentrum: Rovinj, Kroatien
      zoom={11} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Marker für Camping Polari */}
      <Marker position={[45.0532, 13.6705]} icon={customIcon}>
        <Popup>
          <b>Camping Polari</b><br />Rovinj, Kroatien<br />35 € / Nacht
        </Popup>
      </Marker>

      {/* Marker für Camping Park Umag */}
      <Marker position={[45.3900, 13.5300]} icon={customIcon}>
        <Popup>
          <b>Camping Park Umag</b><br />Umag, Kroatien<br />42 € / Nacht
        </Popup>
      </Marker>

      {/* Marker für Naturcamping Bale */}
      <Marker position={[45.0350, 13.7000]} icon={customIcon}>
        <Popup>
          <b>Naturcamping Bale</b><br />Bale, Kroatien<br />29 € / Nacht
        </Popup>
      </Marker>
    </MapContainer>
  );
}