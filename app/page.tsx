'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamischer Import der Karten-Komponente (deaktiviert Server-Side-Rendering für Leaflet)
const Map = dynamic(() => import('./components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 font-medium">
      Karte wird geladen...
    </div>
  ),
});

// Beispiel-Datenstruktur für Campingplätze (Fallback / Initial-Daten)
const INITIAL_CAMPING_SITES = [
  {
    id: 1,
    name: 'Camping Mon Perin',
    location: 'Bale / Rovinj',
    lat: 45.0111,
    lng: 13.7236,
    tags: ['Schatten', 'Hunde erlaubt', 'Am Meer', 'Pool'],
    price: '42€',
    sponsored: true,
    description: 'Riesiges Areal im Eichenwald mit naturnahen Stränden und Paleo Park.',
  },
  {
    id: 2,
    name: 'Camping Polari',
    location: 'Rovinj',
    lat: 45.0608,
    lng: 13.6732,
    tags: ['Hunde erlaubt', 'Am Meer', 'Pool'],
    price: '38€',
    sponsored: false,
    description: 'Beliebter Familiencampingplatz in einer geschützten Bucht südlich von Rovinj.',
  },
  {
    id: 3,
    name: 'Camping Amarin',
    location: 'Rovinj',
    lat: 45.1052,
    lng: 13.6219,
    tags: ['Schatten', 'Am Meer'],
    price: '35€',
    sponsored: false,
    description: 'Blick auf die Altstadt von Rovinj mit wunderschönem Kiesstrand.',
  },
  {
    id: 4,
    name: 'Camping San Polo',
    location: 'Bale',
    lat: 45.0225,
    lng: 13.7088,
    tags: ['Schatten', 'Hunde erlaubt', 'Am Meer'],
    price: '30€',
    sponsored: false,
    description: 'Unberührte Naturbucht mit herrlichen Sonnenuntergängen.',
  },
];

export default function CampingApp() {
  const [activeFilter, setActiveFilter] = useState<string>('Alle');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Verfügbare Schnellfilter
  const filterOptions = ['Alle', 'Am Meer', 'Schatten', 'Hunde erlaubt', 'Pool'];

  // Gefilterte Liste ermitteln
  const filteredSites = INITIAL_CAMPING_SITES.filter((site) => {
    const matchesFilter =
      activeFilter === 'Alle' || site.tags.includes(activeFilter);
    const matchesSearch =
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏕️</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            AI Camping Finder
          </h1>
        </div>
        <div className="text-sm font-medium text-slate-500">
          Istrientour & Adria
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Linke Spalte: Filter & Karte */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          {/* Suchfeld & Filter-Buttons */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
            <input
              type="text"
              placeholder="Ort oder Name suchen (z. B. Rovinj)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm"
            />

            <div className="flex flex-wrap gap-2">
              {filterOptions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                    activeFilter === tag
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Interaktive Leaflet-Karte */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[500px]">
            <Map sites={filteredSites} />
          </div>
        </section>

        {/* Rechte Spalte: Trefferliste */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-bold text-slate-700">
              Gefundene Plätze ({filteredSites.length})
            </h2>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[620px] pr-1">
            {filteredSites.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                Keine Campingplätze für diesen Filter gefunden.
              </div>
            ) : (
              filteredSites.map((site) => (
                <div
                  key={site.id}
                  className={`bg-white p-5 rounded-2xl border transition hover:shadow-md flex flex-col gap-3 ${
                    site.sponsored
                      ? 'border-amber-300 ring-1 ring-amber-300/50 bg-amber-50/10'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {site.sponsored && (
                        <span className="inline-block px-2 py-0.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 rounded-md">
                          ★ Gesponsert
                        </span>
                      )}
                      <h3 className="font-bold text-slate-800 text-lg leading-snug">
                        {site.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        📍 {site.location}
                      </p>
                    </div>
                    <span className="text-emerald-700 font-bold text-lg whitespace-nowrap">
                      {site.price}
                      <span className="text-xs font-normal text-slate-400">
                        /Nacht
                      </span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {site.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {site.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[11px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}