'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Karte dynamisch ohne Server-Side Rendering (SSR) laden
const Map = dynamic(() => import('@/app/components/Map'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center">Karte lädt...</div>
});
export interface CampingSite {
  id: number | string;
  name: string;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
  description?: string;
}

// Sichere Fallback-Daten
const FALLBACK_PLAEZE: CampingSite[] = [
  { id: 1, name: "Camping Mon Perin", lat: 45.0112, lon: 13.7225, description: "Riesiges Areal im Eichenwald direkt am Strand mit Paleo Park." },
  { id: 2, name: "Camping Polari", lat: 45.0608, lon: 13.6733, description: "Große Poolanlage, flacher Kiesstrand, ideal für Familien." },
  { id: 3, name: "Camping Veštar", lat: 45.0531, lon: 13.6828, description: "Ruhige Bucht mit Sandstrand und Bootsanleger." },
  { id: 4, name: "Camping Amarin", lat: 45.1052, lon: 13.6219, description: "Toller Blick auf die Altstadt von Rovinj." }
];

export default function CampingApp() {
  const [campsites, setCampsites] = useState<CampingSite[]>(FALLBACK_PLAEZE);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchRegion] = useState<string>('Rovinj / Istrien');

  // Echte Camping-Daten über Overpass API abfragen
  const fetchOverpassData = async () => {
    setLoading(true);
    const overpassQuery = `
      [out:json][timeout:15];
      (
        node["tourism"="camp_site"](44.95,13.55,45.18,13.80);
        way["tourism"="camp_site"](44.95,13.55,45.18,13.80);
      );
      out center;
    `;

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: 'data=' + encodeURIComponent(overpassQuery),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      if (!response.ok) throw new Error('Overpass API HTTP Error');

      const data = await response.json();
      
      if (data.elements && data.elements.length > 0) {
        const loadedSites: CampingSite[] = data.elements.map((el: any) => ({
          id: el.id,
          name: el.tags?.name || 'Unbenannter Campingplatz',
          lat: el.lat || el.center?.lat,
          lon: el.lon || el.center?.lon,
          tags: el.tags,
          description: el.tags?.description || el.tags?.website || 'Echter OpenStreetMap-Eintrag'
        })).filter((item: CampingSite) => item.lat && item.lon);

        if (loadedSites.length > 0) {
          setCampsites(loadedSites);
        }
      }
    } catch (err) {
      console.warn("Overpass API nicht erreichbar, nutze Fallback-Daten", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverpassData();
  }, []);

  const filteredCampsites = campsites.filter(site => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'dogs' && site.tags?.dog) return site.tags.dog !== 'no';
    if (activeFilter === 'pool' && site.tags?.swimming_pool) return site.tags.swimming_pool !== 'no';
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
              🏕️ AI Camping Finder
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Echte Live-Campingplätze in {searchRegion} (OpenStreetMap Data)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {loading ? 'Lade OpenStreetMap...' : `${filteredCampsites.length} Plätze gefunden`}
            </span>
          </div>
        </header>

        {/* Filter-Buttons */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeFilter === 'all' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            Alle Plätze
          </button>
          <button 
            onClick={() => setActiveFilter('dogs')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeFilter === 'dogs' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            🐶 Hunde erlaubt
          </button>
          <button 
            onClick={() => setActiveFilter('pool')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeFilter === 'pool' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            🏊 mit Pool
          </button>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[450px] lg:h-[600px]">
            <Map campsites={filteredCampsites} />
          </div>

          <div className="lg:col-span-5 space-y-3 overflow-y-auto max-h-[600px] pr-1">
            {filteredCampsites.map((site) => (
              <div key={site.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-emerald-500 transition-all">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-800 text-lg">{site.name}</h3>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-mono">
                    ID: {site.id}
                  </span>
                </div>
                <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                  {site.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    📍 {site.lat.toFixed(4)}, {site.lon.toFixed(4)}
                  </span>
                  <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    Details anzeigen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}