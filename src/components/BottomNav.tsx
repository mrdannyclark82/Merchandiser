import React from 'react';
import { ClipboardList, Radio, Camera, PlusCircle } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'resets' | 'radar' | 'photos';
  onTabChange: (tab: 'resets' | 'radar' | 'photos') => void;
  onNewResetClick: () => void;
  inRangeBadgeCount?: number;
}

export function BottomNav({
  activeTab,
  onTabChange,
  onNewResetClick,
  inRangeBadgeCount = 0,
}: BottomNavProps) {
  return (
    <div className="h-14 bg-white border-t border-gray-200 shrink-0 flex items-center justify-around px-2 z-30 shadow-lg">
      <button
        onClick={() => onTabChange('resets')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
          activeTab === 'resets' ? 'text-[#00529B] font-extrabold scale-105' : 'text-gray-400 font-medium hover:text-gray-600'
        }`}
      >
        <ClipboardList className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Resets</span>
      </button>

      <button
        onClick={() => onTabChange('radar')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition relative ${
          activeTab === 'radar' ? 'text-[#00529B] font-extrabold scale-105' : 'text-gray-400 font-medium hover:text-gray-600'
        }`}
      >
        <Radio className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Radar</span>
        {inRangeBadgeCount > 0 && (
          <span className="absolute top-0 right-5 w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center animate-pulse shadow-sm">
            {inRangeBadgeCount}
          </span>
        )}
      </button>

      <button
        onClick={onNewResetClick}
        className="flex flex-col items-center justify-center -mt-5 bg-[#00529B] hover:bg-[#003B73] text-white w-12 h-12 rounded-full shadow-lg active:scale-95 transition ring-4 ring-white"
        title="Add New Reset"
      >
        <PlusCircle className="w-7 h-7" />
      </button>

      <button
        onClick={() => onTabChange('photos')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
          activeTab === 'photos' ? 'text-[#00529B] font-extrabold scale-105' : 'text-gray-400 font-medium hover:text-gray-600'
        }`}
      >
        <Camera className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Photos</span>
      </button>
    </div>
  );
}

