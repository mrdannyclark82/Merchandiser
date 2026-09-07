import React from 'react';
import {
  MapPin,
  Navigation,
  Radio,
  Zap,
  CheckCircle2,
  Clock,
  ChevronRight,
  Compass,
  AlertTriangle,
  LocateFixed
} from 'lucide-react';
import { ResetProject, UserCoordinates } from '../types';
import { calculateDistanceMeters, formatDistance } from '../utils/geo';

interface LocationRadarProps {
  userCoords: UserCoordinates | null;
  resets: ResetProject[];
  onSelectReset: (id: string) => void;
  onSimulateLocation: (lat: number, lng: number) => void;
  onUseRealGps: () => void;
  isSimulated: boolean;
}

export function LocationRadar({
  userCoords,
  resets,
  onSelectReset,
  onSimulateLocation,
  onUseRealGps,
  isSimulated,
}: LocationRadarProps) {
  // Compute distances for all resets
  const sortedResets = resets
    .map((r) => {
      const distMeters = userCoords
        ? calculateDistanceMeters(userCoords.lat, userCoords.lng, r.lat, r.lng)
        : 999999;
      const inRange = distMeters <= r.geofenceRadiusMeters;
      return { ...r, distMeters, inRange };
    })
    .sort((a, b) => a.distMeters - b.distMeters);

  const inRangeCount = sortedResets.filter(
    (r) => r.inRange && r.status !== 'completed'
  ).length;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50 overflow-y-auto p-4 space-y-4">
      {/* Location Status Card */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Radio className="w-32 h-32 text-white animate-pulse" />
        </div>

        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur">
              <Compass className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">Location Radar</h2>
              <p className="text-xs text-blue-200">Geofence Proximity Monitor</p>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 ${
              isSimulated
                ? 'bg-amber-400 text-amber-950'
                : 'bg-emerald-400 text-emerald-950'
            }`}
          >
            <Radio className="w-3 h-3 animate-ping" />
            {isSimulated ? 'Simulated GPS' : 'Live GPS Active'}
          </span>
        </div>

        {/* Coords & Proximity Stats */}
        <div className="grid grid-cols-2 gap-2 mt-2 bg-black/20 p-2.5 rounded-xl text-xs backdrop-blur border border-white/10 relative z-10">
          <div>
            <p className="text-[10px] text-blue-200 uppercase font-medium">
              Current Position
            </p>
            <p className="font-mono font-bold mt-0.5">
              {userCoords
                ? `${userCoords.lat.toFixed(4)}, ${userCoords.lng.toFixed(4)}`
                : 'Acquiring GPS...'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-blue-200 uppercase font-medium">
              Stores In Radius
            </p>
            <p className="font-bold text-amber-300 mt-0.5 flex items-center gap-1">
              {inRangeCount} Store{inRangeCount !== 1 ? 's' : ''} Active
            </p>
          </div>
        </div>

        {/* Quick GPS Location Simulator Buttons */}
        <div className="mt-3 pt-3 border-t border-white/15 relative z-10">
          <p className="text-[11px] font-semibold text-blue-200 mb-2 flex items-center justify-between">
            <span>Test Geofence Arrival:</span>
            {isSimulated && (
              <button
                onClick={onUseRealGps}
                className="text-white hover:underline flex items-center gap-1 text-[10px] bg-white/20 px-2 py-0.5 rounded"
              >
                <LocateFixed className="w-3 h-3" /> Reset to Real GPS
              </button>
            )}
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {resets.map((r) => (
              <button
                key={r.id}
                onClick={() => onSimulateLocation(r.lat, r.lng)}
                className="px-2 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[11px] font-medium text-left truncate border border-white/10 transition active:scale-95"
                title={`Arrive at ${r.storeName}`}
              >
                📍 {r.storeName.split('#')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stores Proximity List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
          Nearby Stores with Resets ({sortedResets.length})
        </h3>

        {sortedResets.map((r) => (
          <div
            key={r.id}
            onClick={() => onSelectReset(r.id)}
            className={`bg-white rounded-2xl p-4 border transition cursor-pointer shadow-sm relative overflow-hidden active:scale-[0.99] ${
              r.inRange
                ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            {/* Status indicator bar */}
            <div
              className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                r.inRange ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            />

            <div className="pl-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    {r.storeName}
                  </span>
                  <h4 className="font-bold text-gray-900 text-base leading-snug">
                    {r.name}
                  </h4>
                </div>
                {r.inRange ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm shrink-0 animate-pulse">
                    <Zap className="w-3 h-3 fill-current" /> IN RADIUS
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full shrink-0">
                    {formatDistance(r.distMeters)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {r.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  Due {r.dueDate}
                </span>
              </div>

              {/* Progress & items info */}
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">
                  {r.tasks.filter((t) => t.completed).length}/{r.tasks.length} items completed
                </span>
                <span className="font-bold text-blue-600 flex items-center gap-0.5">
                  View Tasks <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
