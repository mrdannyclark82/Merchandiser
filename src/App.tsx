import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  ClipboardList,
  MapPin,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Circle,
  FileCheck,
  Camera,
  Play,
  Trash2,
  Radio,
  Info,
  Sparkles,
  PartyPopper
} from 'lucide-react';
import { ResetProject, ResetPhoto, ResetDoc, UserCoordinates } from './types';
import { INITIAL_RESETS } from './data';
import { calculateDistanceMeters, formatDistance } from './utils/geo';
import { AndroidHeader } from './components/AndroidHeader';
import { BottomNav } from './components/BottomNav';
import { LocationRadar } from './components/LocationRadar';
import { NotificationBanner } from './components/NotificationBanner';
import { CreateResetModal } from './components/CreateResetModal';
import { CameraModal } from './components/CameraModal';
import { PlanogramViewerModal } from './components/PlanogramViewerModal';
import { PhotoGalleryModal } from './components/PhotoGalleryModal';
import { GondolaTransitionGuide } from './components/GondolaTransitionGuide';

// --- Particle Confetti Animation Trigger ---
export function triggerTaskCompletionConfetti() {
  try {
    const confettiFn =
      typeof confetti === 'function'
        ? confetti
        : (confetti as any)?.default ||
          ((window as any) && (window as any).confetti);

    if (typeof confettiFn !== 'function') return;

    const count = 150;
    const defaults = {
      origin: { y: 0.6 },
      colors: ['#00529b', '#0072ce', '#00a3e0', '#f37021', '#ffd100', '#ffffff', '#22c55e'],
    };

    const fire = (particleRatio: number, opts: confetti.Options) => {
      try {
        confettiFn({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      } catch (e) {
        console.warn('Confetti burst error:', e);
      }
    };

    fire(0.25, { spread: 28, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  } catch (err) {
    console.warn('Confetti module error:', err);
  }
}

export default function App() {
  // Main resets state
  const [resets, setResets] = useState<ResetProject[]>(() => {
    const saved = localStorage.getItem('five_below_merch_resets_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed parsing resets from local storage', e);
      }
    }
    return INITIAL_RESETS;
  });

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<'resets' | 'radar' | 'photos'>('resets');
  const [activeResetId, setActiveResetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Location & Geofencing State
  const [userCoords, setUserCoords] = useState<UserCoordinates | null>({
    lat: 41.883,
    lng: -87.6278,
  }); // Default Chicago Loop Five Below
  const [isSimulatedLocation, setIsSimulatedLocation] = useState(false);
  const [geofenceAlertProject, setGeofenceAlertProject] = useState<ResetProject | null>(null);
  const [geofenceAlertDistance, setGeofenceAlertDistance] = useState<number>(0);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraTargetTaskId, setCameraTargetTaskId] = useState<string | undefined>(undefined);
  const [isPlanogramModalOpen, setIsPlanogramModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('five_below_merch_resets_v3', JSON.stringify(resets));
  }, [resets]);

  // Real Geolocation Tracking
  useEffect(() => {
    if ('geolocation' in navigator && !isSimulatedLocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
        },
        (err) => {
          console.warn('Geolocation error:', err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isSimulatedLocation]);

  // Geofence Radius Check on location/resets change
  useEffect(() => {
    if (!userCoords) return;

    for (const project of resets) {
      if (project.status === 'completed') continue;
      if (dismissedAlerts.has(project.id)) continue;

      const dist = calculateDistanceMeters(
        userCoords.lat,
        userCoords.lng,
        project.lat,
        project.lng
      );

      if (dist <= project.geofenceRadiusMeters) {
        setGeofenceAlertProject(project);
        setGeofenceAlertDistance(dist);
        break;
      }
    }
  }, [userCoords, resets, dismissedAlerts]);

  // Selected Reset Project
  const activeReset = resets.find((r) => r.id === activeResetId);

  // --- Handlers ---
  const handleToggleTask = (projectId: string, taskId: string) => {
    setResets((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;

        const wereAllCompleted = p.tasks.length > 0 && p.tasks.every((t) => t.completed);

        const newTasks = p.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );

        const allDone = newTasks.length > 0 && newTasks.every((t) => t.completed);
        const someDone = newTasks.some((t) => t.completed);

        let newStatus = p.status;
        if (allDone) newStatus = 'completed';
        else if (someDone) newStatus = 'in_progress';
        else newStatus = 'pending';

        // Trigger confetti celebration when transition to all completed happens!
        if (!wereAllCompleted && allDone) {
          setTimeout(() => {
            triggerTaskCompletionConfetti();
          }, 100);
        }

        return { ...p, tasks: newTasks, status: newStatus };
      })
    );
  };

  const handleStartReset = (projectId: string) => {
    setResets((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: 'in_progress' } : p))
    );
  };

  const handleSaveNewReset = (newProject: ResetProject) => {
    setResets((prev) => [newProject, ...prev]);
    setActiveResetId(newProject.id);
  };

  const handleDeleteReset = (projectId: string) => {
    if (confirm('Are you sure you want to delete this merchandise reset task?')) {
      setResets((prev) => prev.filter((p) => p.id !== projectId));
      if (activeResetId === projectId) setActiveResetId(null);
    }
  };

  const handlePhotoCaptured = (photo: ResetPhoto) => {
    if (!activeResetId) return;
    setResets((prev) =>
      prev.map((p) => {
        if (p.id !== activeResetId) return p;
        return { ...p, photos: [photo, ...p.photos] };
      })
    );
  };

  const handleDeletePhoto = (photoId: string) => {
    if (!activeResetId) return;
    setResets((prev) =>
      prev.map((p) => {
        if (p.id !== activeResetId) return p;
        return { ...p, photos: p.photos.filter((photo) => photo.id !== photoId) };
      })
    );
  };

  const handleAddDocument = (doc: ResetDoc) => {
    if (!activeResetId) return;
    setResets((prev) =>
      prev.map((p) => {
        if (p.id !== activeResetId) return p;
        return { ...p, documents: [doc, ...p.documents] };
      })
    );
  };

  const handleDeleteDocument = (docId: string) => {
    if (!activeResetId) return;
    setResets((prev) =>
      prev.map((p) => {
        if (p.id !== activeResetId) return p;
        return { ...p, documents: p.documents.filter((d) => d.id !== docId) };
      })
    );
  };

  const handleSimulateLocation = (lat: number, lng: number) => {
    setIsSimulatedLocation(true);
    setUserCoords({ lat, lng });
  };

  const handleUseRealGps = () => {
    setIsSimulatedLocation(false);
  };

  // Filtered Resets List
  const filteredResets = resets.filter((r) => {
    const matchesFilter =
      activeFilter === 'all' ? true : r.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.storeName.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.tasks.some((t) => t.text.toLowerCase().includes(q));
    return matchesFilter && matchesQuery;
  });

  const inRangeCount = userCoords
    ? resets.filter(
        (r) =>
          r.status !== 'completed' &&
          calculateDistanceMeters(userCoords.lat, userCoords.lng, r.lat, r.lng) <=
            r.geofenceRadiusMeters
      ).length
    : 0;

  return (
    <div className="min-h-screen bg-slate-900 flex items-start justify-center font-sans sm:p-4 md:p-8">
      {/* Mobile Device Frame styling for desktop browsers, naturally full screen on mobile */}
      <div className="w-full h-[100dvh] sm:h-[850px] sm:max-h-[100dvh] max-w-[400px] bg-slate-50 flex flex-col relative sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden sm:ring-8 sm:ring-slate-900 border border-slate-700">
        {/* Status Bar Mockup in Five Below Cobalt Blue */}
        <div className="h-7 w-full bg-[#003B73] flex items-center justify-between px-4 text-[10px] text-white font-medium z-50 shrink-0">
          <span className="font-mono tracking-tight">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex space-x-1.5 items-center">
            <Radio className="w-3 h-3 text-amber-300 animate-pulse" />
            <span className="text-[9px] font-bold tracking-wider">5-BELOW GPS</span>
            <div className="w-3.5 h-2 bg-white rounded-xs" />
          </div>
        </div>

        {/* Proximity Geofence Alert Banner */}
        {geofenceAlertProject && (
          <NotificationBanner
            project={geofenceAlertProject}
            distanceMeters={geofenceAlertDistance}
            onOpenProject={(id) => setActiveResetId(id)}
            onDismiss={() => {
              setDismissedAlerts(new Set(dismissedAlerts).add(geofenceAlertProject.id));
              setGeofenceAlertProject(null);
            }}
          />
        )}

        <AnimatePresence mode="wait">
          {!activeReset ? (
            <motion.div
              key="main-tabs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-hidden"
            >
              {activeTab === 'resets' && (
                <>
                  <AndroidHeader
                    title="Store Resets"
                    subtitle="Five Below Merchandising & Planograms"
                    onNewResetClick={() => setIsCreateModalOpen(true)}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                  />

                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 pb-20">
                    {filteredResets.length > 0 ? (
                      filteredResets.map((reset) => (
                        <ResetCard
                          key={reset.id}
                          reset={reset}
                          userCoords={userCoords}
                          onClick={() => setActiveResetId(reset.id)}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12 px-4 space-y-3">
                        <ClipboardList className="w-12 h-12 text-[#00529b]/40 mx-auto" />
                        <h3 className="font-bold text-gray-700">No Five Below resets found</h3>
                        <p className="text-xs text-gray-500">
                          Try adjusting search filters or tap the '+' button to create a new merchandise reset task.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === 'radar' && (
                <>
                  <AndroidHeader
                    title="Location Radar"
                    subtitle="Geofence store detection & distance status"
                  />
                  <LocationRadar
                    userCoords={userCoords}
                    resets={resets}
                    onSelectReset={(id) => setActiveResetId(id)}
                    onSimulateLocation={handleSimulateLocation}
                    onUseRealGps={handleUseRealGps}
                    isSimulated={isSimulatedLocation}
                  />
                </>
              )}

              {activeTab === 'photos' && (
                <>
                  <AndroidHeader
                    title="Photo Proofs"
                    subtitle="Captured verification photos across all Five Below resets"
                  />
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {resets.some((r) => r.photos.length > 0) ? (
                      resets
                        .filter((r) => r.photos.length > 0)
                        .map((r) => (
                          <div
                            key={r.id}
                            className="bg-white p-3.5 rounded-2xl border border-blue-100 shadow-xs space-y-2"
                          >
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                              <div>
                                <h4 className="font-bold text-xs text-[#003B73]">{r.name}</h4>
                                <p className="text-[10px] text-gray-500 font-medium">{r.storeName}</p>
                              </div>
                              <button
                                onClick={() => setActiveResetId(r.id)}
                                className="text-xs text-[#00529b] font-bold hover:underline"
                              >
                                View Reset →
                              </button>
                            </div>
                            <div className="grid grid-cols-3 gap-2 pt-1">
                              {r.photos.map((p) => (
                                <div
                                  key={p.id}
                                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-blue-100 shadow-xs"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={p.url}
                                    alt="Proof"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-12 text-gray-500 space-y-3">
                        <Camera className="w-12 h-12 mx-auto text-[#00529b]/30" />
                        <p className="text-sm font-semibold text-gray-700">No photos captured yet.</p>
                        <p className="text-xs text-gray-400">
                          Open a Five Below reset task to take photo proof during resets.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Bottom Nav Bar */}
              <BottomNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onNewResetClick={() => setIsCreateModalOpen(true)}
                inRangeBadgeCount={inRangeCount}
              />
            </motion.div>
          ) : (
            <ResetDetailsView
              key="details-view"
              reset={activeReset}
              userCoords={userCoords}
              onBack={() => setActiveResetId(null)}
              onToggleTask={handleToggleTask}
              onStartReset={handleStartReset}
              onDeleteReset={handleDeleteReset}
              onOpenPlanogram={() => setIsPlanogramModalOpen(true)}
              onOpenGallery={() => setIsGalleryModalOpen(true)}
              onOpenCamera={(taskId) => {
                setCameraTargetTaskId(taskId);
                setIsCameraModalOpen(true);
              }}
            />
          )}
        </AnimatePresence>

        {/* Android Navigation Bar */}
        <div className="h-10 bg-white shrink-0 flex items-center justify-around border-t border-gray-200 z-40 sm:rounded-b-[2rem] px-8">
          <div className="w-3 h-3 border-2 border-gray-400 rounded-xs" />
          <div className="w-3.5 h-3.5 border-2 border-gray-400 rounded-full" />
          <div className="w-3 h-3 border-t-2 border-l-2 border-transparent rotate-45 border-gray-400" />
        </div>

        {/* Modals */}
        <CreateResetModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveNewReset}
          userLat={userCoords?.lat}
          userLng={userCoords?.lng}
        />

        {activeReset && (
          <>
            <CameraModal
              isOpen={isCameraModalOpen}
              onClose={() => setIsCameraModalOpen(false)}
              onPhotoCaptured={handlePhotoCaptured}
              taskId={cameraTargetTaskId}
              taskTitle={
                cameraTargetTaskId
                  ? activeReset.tasks.find((t) => t.id === cameraTargetTaskId)?.text
                  : activeReset.name
              }
            />

            <PlanogramViewerModal
              isOpen={isPlanogramModalOpen}
              onClose={() => setIsPlanogramModalOpen(false)}
              documents={activeReset.documents}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
              projectName={activeReset.name}
            />

            <PhotoGalleryModal
              isOpen={isGalleryModalOpen}
              onClose={() => setIsGalleryModalOpen(false)}
              photos={activeReset.photos}
              onDeletePhoto={handleDeletePhoto}
              onAddPhotoClick={() => {
                setIsGalleryModalOpen(false);
                setIsCameraModalOpen(true);
              }}
              projectName={activeReset.name}
            />
          </>
        )}
      </div>
    </div>
  );
}

// --- Reset Card Component ---
interface ResetCardProps {
  key?: React.Key;
  reset: ResetProject;
  userCoords: UserCoordinates | null;
  onClick: () => void;
}

function ResetCard({
  reset,
  userCoords,
  onClick,
}: ResetCardProps) {
  const isCompleted = reset.status === 'completed';
  const total = reset.tasks.length;
  const completed = reset.tasks.filter((t) => t.completed).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const distMeters = userCoords
    ? calculateDistanceMeters(userCoords.lat, userCoords.lng, reset.lat, reset.lng)
    : null;
  const inRange = distMeters !== null && distMeters <= reset.geofenceRadiusMeters;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border p-4 shadow-xs active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden ${
        inRange
          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
          : isCompleted
          ? 'border-blue-100 bg-blue-50/30'
          : 'border-blue-100 hover:border-[#00529b]'
      }`}
    >
      {/* Five Below Accent Bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          isCompleted ? 'bg-emerald-500' : 'bg-[#00529b]'
        }`}
      />

      {/* Geofence In Range Badge */}
      {inRange && !isCompleted && (
        <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
          <Radio className="w-3 h-3" /> IN RANGE ({Math.round(distMeters)}m)
        </span>
      )}

      {isCompleted && (
        <span className="absolute top-3 right-3 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> RESET DONE
        </span>
      )}

      <div className="pr-16 pt-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[10px] font-bold text-[#00529b] bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wide">
            {reset.storeName.split('-')[0].trim()}
          </span>
        </div>
        <h3
          className={`font-bold text-gray-900 text-base leading-snug mt-1 ${
            isCompleted ? 'line-through text-gray-400' : ''
          }`}
        >
          {reset.name}
        </h3>
      </div>

      <div className="flex items-center gap-3 mt-2 text-xs text-gray-600 font-medium">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#00529b] shrink-0" />
          {reset.location}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          {reset.dueDate}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <div className="flex-1 mr-3">
          <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1">
            <span>Tasks Completed</span>
            <span className={isCompleted ? 'text-emerald-600' : 'text-[#00529b]'}>
              {progress}% ({completed}/{total})
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#00529b] to-[#0072ce]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-gray-400 shrink-0">
          {reset.documents.length > 0 && (
            <FileCheck className="w-4 h-4 text-[#00529b]" title="Planogram attached" />
          )}
          {reset.photos.length > 0 && (
            <Camera className="w-4 h-4 text-emerald-500" title="Photos attached" />
          )}
        </div>
      </div>
    </div>
  );
}

// --- Reset Details View ---
interface ResetDetailsViewProps {
  key?: React.Key;
  reset: ResetProject;
  userCoords: UserCoordinates | null;
  onBack: () => void;
  onToggleTask: (pId: string, tId: string) => void;
  onStartReset: (pId: string) => void;
  onDeleteReset: (pId: string) => void;
  onOpenPlanogram: () => void;
  onOpenGallery: () => void;
  onOpenCamera: (taskId?: string) => void;
}

function ResetDetailsView({
  reset,
  userCoords,
  onBack,
  onToggleTask,
  onStartReset,
  onDeleteReset,
  onOpenPlanogram,
  onOpenGallery,
  onOpenCamera,
}: ResetDetailsViewProps) {
  const total = reset.tasks.length;
  const completed = reset.tasks.filter((t) => t.completed).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isAllCompleted = total > 0 && completed === total;

  const distMeters = userCoords
    ? calculateDistanceMeters(userCoords.lat, userCoords.lng, reset.lat, reset.lng)
    : null;
  const inRange = distMeters !== null && distMeters <= reset.geofenceRadiusMeters;

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col min-h-0 bg-slate-50 z-20 overflow-hidden"
    >
      {/* Header Bar in Five Below Cobalt Blue */}
      <div className="bg-gradient-to-r from-[#003B73] via-[#00529B] to-[#0072CE] text-white px-3 py-3 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-white/10 rounded-full transition active:scale-95"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="min-w-0">
            <h2 className="text-base font-extrabold truncate leading-tight text-white">{reset.name}</h2>
            <p className="text-blue-100 text-xs truncate font-medium">{reset.storeName} • {reset.location}</p>
          </div>
        </div>

        <button
          onClick={() => onDeleteReset(reset.id)}
          className="p-2 text-blue-200 hover:text-red-200 hover:bg-white/10 rounded-lg transition"
          title="Delete Reset"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {/* Geofence Status Banner */}
        <div
          className={`p-3 rounded-2xl flex items-center justify-between text-xs font-bold shadow-xs ${
            inRange
              ? 'bg-emerald-500 text-white'
              : 'bg-white text-gray-700 border border-blue-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${inRange ? 'animate-pulse text-white' : 'text-[#00529b]'}`} />
            <span>
              {inRange
                ? `Inside Five Below store geofence (${Math.round(distMeters)}m)`
                : distMeters !== null
                ? `Five Below Distance: ${formatDistance(distMeters)}`
                : 'Store Geofence Active'}
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider bg-black/10 px-2 py-0.5 rounded">
            {reset.geofenceRadiusMeters}m radius
          </span>
        </div>

        {/* Celebratory Completion Banner if 100% completed */}
        {isAllCompleted && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 rounded-2xl shadow-md border border-emerald-400 space-y-2 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PartyPopper className="w-6 h-6 text-amber-300 animate-bounce" />
                <div>
                  <h4 className="font-extrabold text-sm tracking-tight text-white">Reset 100% Completed!</h4>
                  <p className="text-emerald-100 text-xs">All merchandise tasks & planograms verified.</p>
                </div>
              </div>
              <button
                onClick={() => triggerTaskCompletionConfetti()}
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-xs active:scale-95 transition flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Celebrate 🎊
              </button>
            </div>
          </motion.div>
        )}

        {/* Progress Card */}
        <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold text-[#00529b] uppercase tracking-wider">
                Five Below Progress
              </p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5">
                {progress}%{' '}
                <span className="text-xs font-bold text-gray-500">
                  ({completed}/{total} items)
                </span>
              </h3>
            </div>

            {/* Quick Document & Photo Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenPlanogram}
                className="px-3 py-2 bg-blue-50 text-[#00529b] hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <FileCheck className="w-4 h-4" />
                Planogram ({reset.documents.length})
              </button>
              <button
                onClick={onOpenGallery}
                className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Camera className="w-4 h-4" />
                Photos ({reset.photos.length})
              </button>
            </div>
          </div>

          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isAllCompleted
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-[#00529b] via-[#0072ce] to-[#00a3e0]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Notes / Instructions if present */}
        {reset.notes && (
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-xs text-amber-900 space-y-1">
            <p className="font-extrabold flex items-center gap-1 text-[#003B73]">
              <Info className="w-4 h-4 text-[#00529b]" /> Five Below Merchandising Notes:
            </p>
            <p className="leading-relaxed font-medium">{reset.notes}</p>
          </div>
        )}

        {/* Gondola Planogram & Transition Guide Blueprint */}
        <GondolaTransitionGuide />

        {/* Task Items Checklist */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#00529b] uppercase tracking-wider ml-1">
              Reset Action Checklist
            </h3>
            <button
              onClick={() => onOpenCamera()}
              className="text-xs font-bold text-[#00529b] hover:underline flex items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5" /> Overall Proof Photo
            </button>
          </div>

          {reset.status === 'pending' ? (
            <div className="bg-white p-6 rounded-2xl border border-blue-100 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 bg-blue-50 text-[#00529b] rounded-full flex items-center justify-center mx-auto">
                <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
              </div>
              <h4 className="font-extrabold text-gray-900">Ready to start this Five Below reset?</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto font-medium">
                Review attached planograms and clear the endcap or aisle before starting execution.
              </p>
              <button
                onClick={() => onStartReset(reset.id)}
                className="w-full bg-[#00529b] hover:bg-[#003B73] text-white font-bold py-3 px-4 rounded-xl shadow-md text-sm active:scale-95 transition"
              >
                Start Reset Session
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {reset.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-2xl border transition flex items-start justify-between gap-3 ${
                    task.completed
                      ? 'bg-emerald-50/40 border-emerald-200 opacity-85'
                      : 'bg-white border-blue-100 shadow-xs'
                  }`}
                >
                  <div
                    onClick={() => onToggleTask(reset.id, task.id)}
                    className="flex items-start gap-3 flex-1 cursor-pointer"
                  >
                    <button className="mt-0.5 shrink-0">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 hover:text-[#00529b]" />
                      )}
                    </button>
                    <span
                      className={`text-sm font-semibold leading-snug ${
                        task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenCamera(task.id)}
                    className="p-1.5 text-gray-400 hover:text-[#00529b] hover:bg-blue-50 rounded-lg transition shrink-0"
                    title="Attach Photo Proof for this item"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

