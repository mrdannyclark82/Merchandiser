import React from 'react';
import { Radio, X, ChevronRight, MapPin, Zap } from 'lucide-react';
import { ResetProject } from '../types';

interface NotificationBannerProps {
  project: ResetProject;
  distanceMeters: number;
  onOpenProject: (id: string) => void;
  onDismiss: () => void;
}

export function NotificationBanner({
  project,
  distanceMeters,
  onOpenProject,
  onDismiss,
}: NotificationBannerProps) {
  return (
    <div className="mx-3 mt-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-3.5 shadow-2xl border border-emerald-400/40 animate-in slide-in-from-top duration-300 relative z-50 shrink-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div className="p-2 bg-white/20 rounded-xl shrink-0 mt-0.5">
            <Radio className="w-5 h-5 text-emerald-200 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="bg-emerald-300 text-emerald-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full tracking-wider uppercase">
                GEOFENCE ALERT
              </span>
              <span className="text-emerald-100 text-xs">Within {Math.round(distanceMeters)}m</span>
            </div>
            <h4 className="font-bold text-sm text-white mt-1 leading-tight">
              Arrived at {project.storeName}
            </h4>
            <p className="text-xs text-emerald-100 mt-0.5">
              Reset pending: <span className="font-semibold">{project.name}</span> ({project.location})
            </p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-1 hover:bg-white/20 rounded-full transition text-emerald-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-2.5 pt-2 border-t border-white/20 flex justify-end">
        <button
          onClick={() => {
            onOpenProject(project.id);
            onDismiss();
          }}
          className="bg-white text-emerald-900 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1 active:scale-95 transition"
        >
          Open Reset Checklist <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
