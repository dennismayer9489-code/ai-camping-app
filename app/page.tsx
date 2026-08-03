'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Search, Navigation, Filter, Star, Trees, Dog, Tent } from 'lucide-react';

// Karte dynamisch laden, damit Next.js sie im Browser ausführt
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-slate-500">Karte wird geladen...</div>,
});

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const campingSites = [
    {
      id: 1,
      name: 'Camping Polari',
      location: 'Rovinj, Kroatien',
      tags: ['Schatten', 'Hunde erlaubt', 'Am Meer'],
      rating: 4.8,
      price: '35 € / Nacht',
      isSponsored: true,
    },
    {
      id: 2,
      name: 'Camping Park Umag',
      location: 'Umag, Kroatien',
      tags: ['Pool', 'Familienfreundlich'],
      rating: 4.6,
      price: '42 € / Nacht',
      isSponsored: false,
    },
    {
      id: 3,
      name: 'Naturcamping Bale',
      location: 'Bale, Kroatien',
      tags: ['Ruhe', 'Pinienwald', 'Hunde erlaubt'],
      rating: 4.9,
      price: '29 € / Nacht',
      isSponsored: false,
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-emerald-700 text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Tent className="w-8 h-8" />
          <h1 className="text-xl font-bold tracking-wide">AI Camping Finder</h1>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition">
          <Navigation className="w-4 h-4" /> In meiner Nähe suchen
        </button>
      </header>

      {/* Filter-Leiste */}
      <div className="bg-white border-b px-4 py-3 flex gap-2 overflow-x-auto items-center shadow-sm">
        <span className="text-sm text-slate-500 font-medium flex items-center gap-1 mr-2">
          <Filter className="w-4 h-4" /> Filter:
        </span>
        <button className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-emerald-200">
          🌊 Am Meer
        </button>
        <button className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-slate-200 flex items-center gap-1">
          <Trees className="w-3.5 h-3.5" /> Schatten
        </button>
        <button className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-slate-200 flex items-center gap-1">
          <Dog className="w-3.5 h-3.5" /> Hunde erlaubt
        </button>
      </div>

      {/* Main Content Area (Split Screen) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* ECHTE KARTE (Links) */}
        <div className="w-full md:w-1/2 h-72 md:h-full relative border-r">
          <MapComponent />
        </div>

        {/* Ergebnis-Liste (Rechts) */}
        <div className="w-full md:w-1/2 p-4 overflow-y-auto space-y-4">
          <h2 className="text-lg font-bold text-slate-700">Gefundene Campingplätze</h2>

          {campingSites.map((site) => (
            <div 
              key={site.id} 
              className={`p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition ${
                site.isSponsored ? 'border-amber-400 bg-amber-50/30' : 'border-slate-200'
              }`}
            >
              {site.isSponsored && (
                <span className="bg-amber-400 text-amber-950 text-[10px] font-bold uppercase px-2 py-0.5 rounded mr-2">
                  Gesponsert
                </span>
              )}
              <div className="flex justify-between items-start mt-1">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{site.name}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" /> {site.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded text-amber-800 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {site.rating}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {site.tags.map((tag, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer / Preis */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
                <span className="font-bold text-emerald-700">{site.price}</span>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition">
                  Details & Buchen
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}