import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  ArrowRight,
  Package,
  Wrench,
  Tag,
  Eye,
  Sparkles,
  Grid,
  Info,
  Compass,
  CheckCircle2
} from 'lucide-react';

interface GondolaTransitionGuideProps {
  onNavigateToZone?: (zoneName: string) => void;
  onCloseModal?: () => void;
}

export function GondolaTransitionGuide({ onNavigateToZone, onCloseModal }: GondolaTransitionGuideProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'disposition' | 'hardware' | 'searcy_map'>('visual');

  return (
    <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden text-gray-800 my-2">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003B73] via-[#00529B] to-[#0072CE] p-3.5 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-400 text-[#003B73] rounded-lg font-black text-xs">
            BLUEPRINT
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white leading-tight">
              Beat the BELL! NOW Wall & Gondola Planogram
            </h3>
            <p className="text-[11px] text-blue-100 font-medium">
              Americana Summer Removal & Backpack Replacement Guide
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase bg-white/20 text-white px-2 py-0.5 rounded backdrop-blur">
          Searcy, AR #4150
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('visual')}
          className={`flex-1 py-2.5 px-3 min-w-[100px] flex items-center justify-center gap-1.5 transition border-b-2 ${
            activeTab === 'visual'
              ? 'border-[#00529B] text-[#00529B] bg-white font-extrabold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Eye className="w-4 h-4" /> Completed View
        </button>
        <button
          onClick={() => setActiveTab('disposition')}
          className={`flex-1 py-2.5 px-3 min-w-[110px] flex items-center justify-center gap-1.5 transition border-b-2 ${
            activeTab === 'disposition'
              ? 'border-[#00529B] text-[#00529B] bg-white font-extrabold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Package className="w-4 h-4 text-amber-600" /> Americana Move
        </button>
        <button
          onClick={() => setActiveTab('hardware')}
          className={`flex-1 py-2.5 px-3 min-w-[110px] flex items-center justify-center gap-1.5 transition border-b-2 ${
            activeTab === 'hardware'
              ? 'border-[#00529B] text-[#00529B] bg-white font-extrabold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Wrench className="w-4 h-4 text-blue-600" /> Hardware Needed
        </button>
        <button
          onClick={() => setActiveTab('searcy_map')}
          className={`flex-1 py-2.5 px-3 min-w-[110px] flex items-center justify-center gap-1.5 transition border-b-2 ${
            activeTab === 'searcy_map'
              ? 'border-[#00529B] text-[#00529B] bg-white font-extrabold'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-600" /> Searcy Store Map
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-3.5 space-y-3.5">
        {/* TAB 1: VISUAL PLANOGRAM COMPLETED GONDOLA */}
        {activeTab === 'visual' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#003B73] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" /> Completed Gondola / NOW Wall 1-2
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                100% Set Standard
              </span>
            </div>

            {/* Interactive Rendered Gondola Wall */}
            <div className="border-2 border-slate-300 rounded-xl p-3 bg-slate-100 shadow-inner space-y-2 relative overflow-hidden">
              {/* Campaign Signage Header */}
              <div className="bg-gradient-to-r from-blue-700 via-amber-400 to-blue-700 text-slate-900 font-black p-2 rounded-lg text-center shadow-md flex items-center justify-between px-3 border border-amber-300">
                <span className="bg-[#003B73] text-white text-[9px] px-2 py-0.5 rounded font-extrabold uppercase">
                  FIVE BELOW
                </span>
                <span className="text-sm tracking-tight text-[#003B73]">
                  beat the BELL!
                </span>
                <span className="bg-[#003B73] text-amber-300 text-[10px] font-black px-2 py-0.5 rounded">
                  $5 & $7
                </span>
              </div>

              {/* Pegboard Grid Representation */}
              <div className="bg-slate-200 border border-slate-300 rounded-lg p-2 space-y-3 min-h-[220px] relative">
                {/* Top Row: $5 Backpacks on 12" Pegs */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-slate-600 border-b border-slate-300 pb-0.5">
                    <span>12" Peg Row 1 (Spacing: 7", 13", 13", 5")</span>
                    <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[9px]">$5 PRICE CHIP</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: 'Solid Navy Backpack', price: '$5', color: 'bg-blue-900' },
                      { name: 'Pastel Pink Backpack', price: '$5', color: 'bg-pink-400' },
                      { name: 'Camo Print Backpack', price: '$5', color: 'bg-emerald-800' },
                      { name: 'Checkerboard Pack', price: '$5', color: 'bg-slate-800' }
                    ].map((bp, i) => (
                      <div key={i} className="bg-white border border-slate-300 rounded-lg p-1.5 text-center shadow-xs flex flex-col items-center">
                        <div className="w-2 h-2 bg-slate-500 rounded-full mb-1" title="12 inch peg hook" />
                        <div className={`w-10 h-12 ${bp.color} rounded-md shadow-inner flex items-center justify-center text-white font-extrabold text-[9px]`}>
                          {bp.price}
                        </div>
                        <span className="text-[9px] font-bold text-slate-700 truncate w-full mt-1">{bp.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Middle Row: $7 Premium & License Backpacks */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-slate-600 border-b border-slate-300 pb-0.5">
                    <span>12" Peg Row 2 (License & $7 Heavy Duty)</span>
                    <span className="bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded text-[9px] font-black">$7 PRICE TOPPER</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: 'Spider-Man Pack', price: '$7', color: 'bg-red-600' },
                      { name: 'Stitch Backpack', price: '$7', color: 'bg-blue-500' },
                      { name: 'K-Pop Demon Hunter', price: '$7', color: 'bg-purple-600' },
                      { name: 'Clear PVC Backpack', price: '$5', color: 'bg-cyan-200 text-slate-900 border border-slate-400' }
                    ].map((bp, i) => (
                      <div key={i} className="bg-white border border-slate-300 rounded-lg p-1.5 text-center shadow-xs flex flex-col items-center">
                        <div className="w-2 h-2 bg-slate-500 rounded-full mb-1" title="12 inch peg hook" />
                        <div className={`w-10 h-12 ${bp.color} rounded-md shadow-inner flex items-center justify-center font-extrabold text-[9px]`}>
                          {bp.price}
                        </div>
                        <span className="text-[9px] font-bold text-slate-700 truncate w-full mt-1">{bp.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Base Deck / Shelf: Nano Bag Charms & Tech Pouches */}
                <div className="bg-slate-300 p-2 rounded-lg border border-slate-400">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-800 mb-1">
                    <span>Bottom Base Deck Shelf (Nano Bag Charms & Pouches)</span>
                    <span className="text-emerald-700 font-extrabold">50¢ - $5 Shelf Talkers</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                    <div className="bg-amber-100 border border-amber-300 p-1 rounded font-bold text-amber-900">
                      Nano Charm PDQ ($5)
                    </div>
                    <div className="bg-blue-100 border border-blue-300 p-1 rounded font-bold text-blue-900">
                      Writing Cubes (50¢)
                    </div>
                    <div className="bg-purple-100 border border-purple-300 p-1 rounded font-bold text-purple-900">
                      Tech Accessories ($5)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-xs text-[#003B73] space-y-1 font-medium">
              <p className="font-bold flex items-center gap-1">
                <Info className="w-4 h-4 text-[#00529B]" /> Merchandising Note for Searcy, AR Store:
              </p>
              <p className="leading-snug">
                Lead in with the $5 Backpack Wall on NOW Wall 1 right at the store front entrance. Flex clear backpacks into the $5 wall upon receipt. Use 12-inch pegs for hanging depth.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: AMERICANA SUMMER PRODUCT DISPOSITION */}
        {activeTab === 'disposition' && (
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl text-xs text-amber-950 space-y-1">
              <h4 className="font-extrabold text-amber-900 flex items-center gap-1.5 text-sm">
                <Package className="w-4 h-4 text-amber-600" /> Displaced Americana Summer Product Guide
              </h4>
              <p className="font-medium leading-relaxed">
                When setting the Beat the BELL Backpack Wall in New & Now, all Americana summer merchandise must be removed from the front NOW gondola and relocated to designated inline departments.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#003B73] text-white font-bold text-[11px]">
                    <th className="p-2.5">Displaced Item</th>
                    <th className="p-2.5">Former Location</th>
                    <th className="p-2.5">New Searcy Store Home</th>
                    <th className="p-2.5">Action Instruction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr className="bg-amber-50/40">
                    <td className="p-2.5 font-bold text-slate-900">Americana Apparel & Totes</td>
                    <td className="p-2.5 text-gray-500 font-mono">NOW Wall / Gondola</td>
                    <td className="p-2.5 font-bold text-[#00529B] bg-blue-50">Apparel & Canvas Totes Gondola</td>
                    <td className="p-2.5 text-gray-700">Work remaining tees & totes into inline canvas totes/apparel gondola</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-900">Pool Side / Sun Care</td>
                    <td className="p-2.5 text-gray-500 font-mono">NOW Wall</td>
                    <td className="p-2.5 font-bold text-emerald-800 bg-emerald-50">Outdoor Cages & Outdoor Wall</td>
                    <td className="p-2.5 text-gray-700">Move suncare to Outdoor wall; pool floats to front outdoor cages</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2.5 font-bold text-slate-900">Locals Only Apparel</td>
                    <td className="p-2.5 text-gray-500 font-mono">NOW Wall</td>
                    <td className="p-2.5 font-bold text-purple-800 bg-purple-50">Style World / Footwear</td>
                    <td className="p-2.5 text-gray-700">Work flip flops into footwear; apparel into License Style area</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-900">Anime & Stitch Sets</td>
                    <td className="p-2.5 text-gray-500 font-mono">NOW Gondola</td>
                    <td className="p-2.5 font-bold text-blue-900 bg-blue-50">Home Inline / Room Section</td>
                    <td className="p-2.5 text-gray-700">Work remaining merchandise into inline Home/Room locations</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2.5 font-bold text-slate-900">Duck Speakers</td>
                    <td className="p-2.5 text-gray-500 font-mono">NOW Endcap</td>
                    <td className="p-2.5 font-bold text-indigo-900 bg-indigo-50">Tech Audio Speakers</td>
                    <td className="p-2.5 text-gray-700">Move duck speakers into inline Tech Audio section</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={() => {
                if (onCloseModal) onCloseModal();
                if (onNavigateToZone) onNavigateToZone('Apparel Gondola');
              }}
              className="w-full bg-[#00529B] hover:bg-[#003B73] text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <Compass className="w-4 h-4" /> Locate Apparel Gondola in Searcy Store →
            </button>
          </div>
        )}

        {/* TAB 3: HARDWARE, SHELVES, PEGS & PRICE TAGS */}
        {activeTab === 'hardware' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#003B73] uppercase tracking-wider flex items-center gap-1">
                <Wrench className="w-4 h-4 text-blue-600" /> Hardware & Fixture Requirements
              </span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                BTS 2026 Spec Sheet
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Peg Hooks */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#003B73] font-bold">
                  <Grid className="w-4 h-4 text-blue-600" /> 12" Heavy Duty Pegs
                </div>
                <p className="text-[11px] text-slate-700 font-medium">
                  <strong>Qty:</strong> 24 to 36 pegs per 4ft wall section.
                </p>
                <p className="text-[10px] text-slate-500">
                  <strong>Spacing:</strong> 7", 13", 13", 5" horizontal spacing for backpack handles.
                </p>
              </div>

              {/* Shelves & Decks */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#003B73] font-bold">
                  <Layers className="w-4 h-4 text-amber-600" /> Shelves & Fences
                </div>
                <p className="text-[11px] text-slate-700 font-medium">
                  <strong>4' Shelves:</strong> 1 Base Deck + 1-2 adjustable shelves for PDQ shippers.
                </p>
                <p className="text-[10px] text-slate-500">
                  <strong>4' Fences:</strong> Front channel fences for writing cubes & charms.
                </p>
              </div>

              {/* Price Tags & Toppers */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#003B73] font-bold">
                  <Tag className="w-4 h-4 text-emerald-600" /> Price Chips & Toppers
                </div>
                <p className="text-[11px] text-slate-700 font-medium">
                  <strong>$5 Price Signs:</strong> 4x4 signs for $5 Backpack Wall lead-in.
                </p>
                <p className="text-[10px] text-slate-500">
                  <strong>50¢ Price Chips:</strong> Downloadable chips for 24ct Value Crayons.
                </p>
              </div>

              {/* Campaign Header Kit */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#003B73] font-bold">
                  <Sparkles className="w-4 h-4 text-purple-600" /> Sign Kit (SAM / FedEx)
                </div>
                <p className="text-[11px] text-slate-700 font-medium">
                  <strong>Header:</strong> "beat the BELL!" campaign wall header sign.
                </p>
                <p className="text-[10px] text-slate-500">
                  <strong>Side Panels:</strong> $7 Backpack & Nano Charm side-wing signs.
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-900 space-y-1 font-medium">
              <span className="font-bold flex items-center gap-1">
                ⚠️ Hardware Hold Reminder:
              </span>
              <span>
                Hold any extra 12" pegs and unused summer signage in a safe place until the end of the season.
              </span>
            </div>
          </div>
        )}

        {/* TAB 4: SEARCY, AR STORE MAP & IN-STORE PINPOINT */}
        {activeTab === 'searcy_map' && (
          <div className="space-y-3">
            <div className="bg-[#003B73] text-white p-3 rounded-xl shadow-xs space-y-1">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-xs flex items-center gap-1 text-white">
                  <MapPin className="w-4 h-4 text-amber-400" /> Five Below #4150 - Searcy, AR
                </h4>
                <span className="bg-emerald-400 text-emerald-950 font-black text-[9px] px-2 py-0.5 rounded">
                  GPS Active
                </span>
              </div>
              <p className="text-[11px] text-blue-100 font-medium">
                3012 E Race Ave, Searcy, AR 72143 (Lat: 35.2471, Lng: -91.7011)
              </p>
            </div>

            {/* Interactive Indoor Searcy Store Floor Map */}
            <div className="border-2 border-slate-300 rounded-2xl p-3 bg-slate-100 space-y-2 relative">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between items-center">
                <span>Searcy Store Layout Map</span>
                <span className="text-[#00529B] font-extrabold">FRONT OF STORE ENTRANCE ⬇️</span>
              </div>

              <div className="bg-white border border-slate-300 rounded-xl p-3 relative space-y-3 shadow-inner min-h-[200px]">
                {/* Entrance Bar */}
                <div className="w-full bg-slate-800 text-white text-[10px] font-black py-1 text-center rounded">
                  MAIN ENTRANCE / CASHWRAP
                </div>

                {/* Main Aisle & Zones */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {/* Zone 1: New & Now (Beat the BELL) */}
                  <div
                    onClick={() => {
                      if (onCloseModal) onCloseModal();
                      if (onNavigateToZone) onNavigateToZone('New & Now Wall');
                    }}
                    className="bg-blue-600 text-white p-2.5 rounded-lg font-bold space-y-1 shadow-xs cursor-pointer hover:bg-blue-700 transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="bg-amber-400 text-slate-900 text-[8px] font-black px-1 rounded">ZONE 1</span>
                      <span className="text-[9px] text-blue-200 font-mono">📍 FRONT</span>
                    </div>
                    <p className="text-xs font-black leading-tight text-white">New & Now World</p>
                    <p className="text-[9px] text-blue-100">Beat the BELL $5 & $7 Backpack Wall</p>
                  </div>

                  {/* Zone 2: Apparel Gondola (New home for Americana) */}
                  <div
                    onClick={() => {
                      if (onCloseModal) onCloseModal();
                      if (onNavigateToZone) onNavigateToZone('Apparel Gondola');
                    }}
                    className="bg-amber-100 border-2 border-amber-400 text-amber-950 p-2.5 rounded-lg font-bold space-y-1 shadow-xs cursor-pointer hover:bg-amber-200 transition"
                  >
                    <div className="flex justify-between items-center">
                      <span className="bg-amber-500 text-white text-[8px] font-black px-1 rounded">ZONE 2</span>
                      <span className="text-[9px] text-amber-800 font-mono">📍 INLINE</span>
                    </div>
                    <p className="text-xs font-black leading-tight text-amber-950">Apparel & Canvas Totes</p>
                    <p className="text-[9px] text-amber-900">New Home for Americana Summer Tees</p>
                  </div>

                  {/* Zone 3: Back To Dorm */}
                  <div className="bg-purple-100 border border-purple-300 text-purple-900 p-2.5 rounded-lg font-bold space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="bg-purple-600 text-white text-[8px] font-black px-1 rounded">ZONE 3</span>
                      <span className="text-[9px] text-purple-700 font-mono">📍 MID</span>
                    </div>
                    <p className="text-xs font-black leading-tight text-purple-950">Back To Dorm</p>
                    <p className="text-[9px] text-purple-800">Desk Edit Cube 4 & Tech Spinners</p>
                  </div>

                  {/* Zone 4: GLTS Play */}
                  <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-2.5 rounded-lg font-bold space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="bg-emerald-600 text-white text-[8px] font-black px-1 rounded">ZONE 4</span>
                      <span className="text-[9px] text-emerald-700 font-mono">📍 BACK</span>
                    </div>
                    <p className="text-xs font-black leading-tight text-emerald-950">Play Department</p>
                    <p className="text-[9px] text-emerald-800">Slime Zone & Collectibles expansion</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 font-medium text-center">
              📍 Stand near Zone 1 (Front New & Now) to begin the Beat the BELL Backpack reset!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
