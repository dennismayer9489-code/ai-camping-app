'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamischer Import der Karte (behebt Server-Side-Rendering Fehler von Leaflet)
const Map = dynamic(() => import('./components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-500">
      Karte wird geladen...
    </div>
  )
});

// Unsere sicheren Fallback-Daten (die Top-Plätze)
const fallbackSites = [
  { id: 1, name: 'Camping Mon Perin', location: 'Bale, Kroatien', lat: 45.029, lng: 13.738, description: 'Riesiges Areal im Eichenwald, Paleo Park in Dino-Form. Perfekt für Familien.' },
  { id: 2, name: 'Camping Polari', location: 'Rovinj, Kroatien', lat: 45.059, lng: 13.674, description: 'Großer Platz mit riesiger Poollandschaft und direktem Zugang zum Strand.' },
  { id: 3, name: 'Maistra Camping Amarin', location: 'Rovinj, Kroatien', lat: 45.106, lng: 13.621, description: 'Herrlicher Blick auf die Altstadt von Rovinj. Kies- und Felsstrände.' }
];

export default function CampingApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([45.08, 13.63]); // Standard: Rovinj
  const [sites, setSites] = useState(fallbackSites);
  const [isLoading, setIsLoading] = useState(false);

  // Live-Stadt-Suche mit OpenStreetMap (Nominatim API)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    setIsLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();

      if (data && data.length > 0) {
        // Koordinaten der gefundenen Stadt auslesen
        const newLat = parseFloat(data[0].lat);
        const newLng = parseFloat(data[0].lon);
        setMapCenter([newLat, newLng]); // Karte dorthin bewegen
      } else {
        alert('Ort nicht gefunden. Bitte versuche es mit einer anderen Stadt (z.B. München, Berlin, Rovinj).');
      }
    } catch (error) {
      console.error('Fehler bei der Ortssuche:', error);
      alert('Es gab ein Problem bei der Suche. Bitte überprüfe deine Internetverbindung.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Header mit Suchleiste */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-emerald-600 tracking-tight">🏕️ AI Camping Finder</h1>
          
          <form onSubmit={handleSearch} className="w-full md:w-auto flex-1 max-w-xl flex gap-2">
            <input
              type="text"
              placeholder="Stadt eingeben (z.B. München, Paris, Rovinj)..."
              className="w-full px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-sm disabled:opacity-50" 
              disabled={isLoading}
            >
              {isLoading ? 'Sucht...' : 'Suchen'}
            </button>
          </form>
        </div>
      </header>

      {/* Hauptbereich: 2-Spalten-Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Linke Seite: Karte */}
        <div className="lg:col-span-7 h-[50vh] lg:h-[75vh] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative z-0">
          <Map sites={sites} center={mapCenter} />
        </div>

        {/* Rechte Seite: Ergebnisliste */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto lg:h-[75vh] pr-2 scrollbar-thin scrollbar-thumb-slate-300">
          <h2 className="text-xl font-semibold mb-2">Gefundene Plätze</h2>
          
          {sites.map(site => (
            <div 
              key={site.id} 
              onClick={() => setMapCenter([site.lat, site.lng])}
              className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">{site.name}</h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded">Top</span>
              </div>
              <p className="text-slate-500 text-sm mb-3">📍 {site.location}</p>
              <p className="text-slate-600 text-sm leading-relaxed">{site.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}