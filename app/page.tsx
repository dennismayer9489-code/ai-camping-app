'use client';

import React, { useState } from 'react';
import { MapPin, Trees, Dog, Waves, Sun, Sparkles, Navigation } from 'lucide-react';

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState(null);

  // Beispiel-Filter-Optionen
  const filters = [
    { id: 'sea', label: 'Am Meer', icon: Waves },
    { id: 'dogs', label: 'Hunde erlaubt', icon: Dog },
    { id: 'shade', label: 'Schattenplatz', icon: Trees },
    { id: 'pool', label: 'Pool & Wellness', icon: Sun },
  ];

  // Dummy-Campingplätze für den ersten visuellen Test
  const mockCampsites = [
    {
      id: 1,
      name: 'Camping Mon Perin',
      location: 'Bale / Rovinj, Kroatien',
      isSponsored: true,
      price: 'ab 42 € / Nacht',
      tags: ['Am Meer', 'Dichter Schatten', 'Paleo Park'],
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      name: 'Camping Polari',
      location: 'Rovinj, Kroatien',
      isSponsored: false,
      price: 'ab 35 € / Nacht',
      tags: ['Hunde willkommen', 'Poollandschaft'],
      image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=600&q=80',
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {/* Top Header */}
      <header className="bg-emerald-700 text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Trees className="h-7 w-7 text-emerald-300" />
          <h1 className="text-xl font-bold tracking-wide">AI CAMPING FINDER</h1>
        </div>
        <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs px-3 py-2 rounded-lg font-medium transition">
          <Navigation className="h-4 w-4" /> In meiner Nähe suchen
        </button>
      </header>

      {/* Main Content Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Linke Spalte: Filter & Trefferliste */}
        <div className="w-full md:w-1/2 p-4 overflow-y-auto flex flex-col gap-4">
          
          {/* Quick Filter Section */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Schnell-Filter wählen
            </h2>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => {
                const Icon = filter.icon;
                const isActive = selectedFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(isActive ? null : filter.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition ${
                      isActive
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ergebnis-Liste */}
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
              Empfohlene Plätze <Sparkles className="h-4 w-4 text-amber-500" />
            </h2>

            {mockCampsites.map((site) => (
              <div 
                key={site.id} 
                className={`bg-white rounded-xl overflow-hidden shadow-sm border transition hover:shadow-md ${
                  site.isSponsored ? 'border-amber-400 ring-1 ring-amber-400' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/3 h-36 relative">
                    <img 
                      src={site.image} 
                      alt={site.name} 
                      className="w-full h-full object-cover"
                    />
                    {site.isSponsored && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        SPONSORED
                      </span>
                    )}
                  </div>
                  <div className="p-4 sm:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800 text-base">{site.name}</h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                          {site.price}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-slate-400" /> {site.location}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {site.tags.map((tag, i) => (
                          <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg transition">
                      Details & Buchen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Rechte Spalte: Karte Platzhalter */}
        <div className="hidden md:flex w-1/2 bg-slate-200 relative items-center justify-center border-l border-slate-300">
          <div className="text-center p-6 bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white">
            <MapPin className="h-12 w-12 text-emerald-600 mx-auto mb-2 animate-bounce" />
            <h3 className="font-bold text-slate-800">Interaktive Karte</h3>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              Hier wird im nächsten Schritt die OpenStreetMap-Karte mit Live-Pins geladen.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}