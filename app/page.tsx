'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Star, Trees, Dog, Waves, Sparkles, Loader2, RefreshCw } from 'lucide-react';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-slate-500 font-medium">
      Karte wird geladen...
    </div>
  ),
});

export interface CampingSite {
  id: number;
  name: string;
  location: string;
  lat: number;
  lng: number;
  tags: string[];
  rating: number;
  price: string;
  isSponsored?: boolean;
}

export default function Home() {
  const [sites, setSites] = useState<CampingSite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState('Alle');

  // Echte Live-Daten von OpenStreetMap (Overpass API) abrufen
  const fetchLiveCampingSites = async () => {
    setLoading(true);
    try {
      // Bounding Box für Istria / Kroatien (Süd-West bis Nord-Ost)
      const query = `
        [out:json][timeout:25];
        (
          node["tourism"="camp_site"](44.90,13.50,45.25,13.90);
          way["tourism"="camp_site"](44.90,13.50,45.25,13.90);
        );
        out center 20;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
      });

      const data = await response.json();

      // Umwandeln der OSM-Daten in unser App-Format
      const parsedSites: CampingSite[] = data.elements
        .filter((element: any) => element.tags && (element.tags.name || element.tags['name:de']))
        .map((element: any, index: number) => {
          const lat = element.lat || (element.center && element.center.lat);
          const lng = element.lon || (element.center && element.center.lon);
          const tagsList: string[] = [];

          // Tags aus den echten OpenStreetMap-Eigenschaften erkennen
          if (element.tags.dog === 'yes' || element.tags.pets === 'yes') tagsList.push('Hunde erlaubt');
          if (element.tags.shade === 'yes' || element.tags.trees === 'yes' || element.tags.natural) tagsList.push('Schatten');
          if (element.tags.beach || element.tags.waterfront === 'yes' || element.tags.sea === 'yes') tagsList.push('Am Meer');
          
          // Standard-Fallback-Tags, falls OSM wenig Detail-Info hat
          if (tagsList.length === 0) tagsList.push('Natur & Camping');

          return {
            id: element.id,
            name: element.tags.name || element.tags['name:de'] || 'Campingplatz',
            location: element.tags['addr:city'] ? `${element.tags['addr:city']}, Kroatien` : 'Kroatien',
            lat: lat,
            lng: lng,
            tags: tagsList,
            rating: Number((4.2 + (index % 8) * 0.1).toFixed(1)), // Dynamische Beispiel-Bewertung
            price: `${30 + (index % 5) * 4} € / Nacht`,
            isSponsored: index === 0, // Erster Platz als gesponserte Demo
          };
        });

      setSites(parsedSites);
    } catch (error) {
      console.error('Fehler beim Laden der Live-Daten:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveCampingSites();
  }, []);

  // Filter-Logik für die Live-Daten
  const filteredSites = sites.filter((site) => {
    if (selectedFilter === 'Alle') return true;
    return site.tags.includes(selectedFilter);
  });

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header & Filter-Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-xl text-white">
            <Trees className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-900 leading-none">Camping Finder</h1>
            <p className="text-xs text-slate-500 mt-1">Live OpenStreetMap Daten</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {[
            { name: 'Alle', icon: Sparkles },
            { name: 'Schatten', icon: Trees },
            { name: 'Hunde erlaubt', icon: Dog },
            { name: 'Am Meer', icon: Waves },
          ].map((filter) => {
            const Icon = filter.icon;
            const isActive = selectedFilter === filter.name;
            return (
              <button
                key={filter.name}
                onClick={() => setSelectedFilter(filter.name)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {filter.name}
              </button>
            );
          })}
          
          <button 
            onClick={fetchLiveCampingSites} 
            title="Daten neu laden"
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Content: Karte (links) & Liste (rechts) */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Karte Container */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full relative z-0 border-r border-slate-200">
          <MapComponent sites={filteredSites} />
        </div>

        {/* Ergebnis-Liste Container */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full overflow-y-auto p-6 space-y-4 bg-slate-50">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              {loading && <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />}
              {filteredSites.length} echte Campingplätze gefunden
            </h2>
            <span className="text-xs text-slate-500">Filter: {selectedFilter}</span>
          </div>

          {!loading && filteredSites.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              Keine Campingplätze für diesen Filter in der Region gefunden.
            </div>
          )}

          {filteredSites.map((site) => (
            <div
              key={site.id}
              className={`bg-white rounded-2xl p-5 border transition-all hover:shadow-md ${
                site.isSponsored
                  ? 'border-amber-400 ring-1 ring-amber-400/20'
                  : 'border-slate-200'
              }`}
            >
              {site.isSponsored && (
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mb-2">
                  Empfehlung
                </span>
              )}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{site.name}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {site.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-amber-700 text-xs font-bold border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {site.rating}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {site.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
                <span className="font-bold text-emerald-700 text-lg">{site.price}</span>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2 rounded-xl transition-colors">
                  Details & Buchen
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}