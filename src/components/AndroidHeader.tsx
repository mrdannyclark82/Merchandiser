import React from 'react';
import { Search, Plus, Sparkles } from 'lucide-react';

interface AndroidHeaderProps {
  title: string;
  subtitle?: string;
  onNewResetClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export function AndroidHeader({
  title,
  subtitle,
  onNewResetClick,
  searchQuery = '',
  onSearchChange,
  activeFilter = 'all',
  onFilterChange,
}: AndroidHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-[#003B73] via-[#00529B] to-[#0072CE] text-white p-4 shadow-md shrink-0 relative overflow-hidden">
      {/* Decorative Five Below energetic background accent */}
      <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-blue-400/20 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="bg-amber-400 text-[#003B73] font-black text-[9px] uppercase px-1.5 py-0.5 rounded tracking-wider shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> FIVE BELOW MERCH
            </span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight leading-tight flex items-center gap-1.5">
            {title}
          </h1>
          {subtitle && <p className="text-blue-100 text-xs mt-0.5 font-medium">{subtitle}</p>}
        </div>
        {onNewResetClick && (
          <button
            onClick={onNewResetClick}
            className="bg-white text-[#00529B] hover:bg-amber-300 hover:text-[#003B73] font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition"
          >
            <Plus className="w-4 h-4" /> New Reset
          </button>
        )}
      </div>

      {/* Search & Filter Bar if handler provided */}
      {onSearchChange && (
        <div className="mt-3 space-y-2 relative z-10">
          <div className="relative">
            <Search className="w-4 h-4 text-blue-200 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Five Below store, aisle, SKU or reset name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#003B73]/60 text-white placeholder-blue-200/80 border border-blue-400/40 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:bg-[#003B73]/90 focus:border-white transition"
            />
          </div>

          {onFilterChange && (
            <div className="flex gap-1.5 overflow-x-auto pt-1 pb-0.5 no-scrollbar">
              {[
                { id: 'all', label: 'All Resets' },
                { id: 'in_progress', label: '⚡ In Progress' },
                { id: 'pending', label: '⏳ Pending' },
                { id: 'completed', label: '✅ Completed' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => onFilterChange(f.id)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
                    activeFilter === f.id
                      ? 'bg-amber-400 text-[#003B73] shadow-sm'
                      : 'bg-[#003B73]/50 text-blue-100 hover:bg-[#003B73]/80'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

