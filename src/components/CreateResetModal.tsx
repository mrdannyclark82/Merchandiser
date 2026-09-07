import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  MapPin,
  Calendar,
  FileText,
  Upload,
  Check,
  Building2,
  Layers,
  AlertCircle
} from 'lucide-react';
import { ResetProject, ResetTask, ResetDoc } from '../types';

interface CreateResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: ResetProject) => void;
  userLat?: number;
  userLng?: number;
}

const PRESET_STORES = [
  { name: 'Five Below #4102 - Chicago Loop', lat: 41.883, lng: -87.6278, address: '100 N State St, Chicago' },
  { name: 'Five Below #105 - Lincoln Park', lat: 41.9098, lng: -87.6532, address: '1550 N Kingsbury St, Chicago' },
  { name: 'Five Below #88 - Michigan Ave', lat: 41.898, lng: -87.6242, address: '835 N Michigan Ave, Chicago' },
  { name: 'Five Below #129 - South Loop', lat: 41.8685, lng: -87.6391, address: '1100 S Canal St, Chicago' },
];

export function CreateResetModal({
  isOpen,
  onClose,
  onSave,
  userLat,
  userLng,
}: CreateResetModalProps) {
  const [storeName, setStoreName] = useState('Five Below #4102 - Chicago Loop');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Aisle 1 Front');
  const [address, setAddress] = useState('100 Main St, Chicago');
  const [lat, setLat] = useState<number>(41.8781);
  const [lng, setLng] = useState<number>(-87.6298);
  const [radius, setRadius] = useState<number>(300);
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');

  // Item checklist items
  const [taskInputs, setTaskInputs] = useState<string[]>([
    'Review planogram diagram',
    'Clear old merchandise & shelf tags',
    'Set new shelves/pegs per diagram',
    'Stock new SKUs and place shelf talkers',
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  // Attached planograms
  const [documents, setDocuments] = useState<ResetDoc[]>([]);

  if (!isOpen) return null;

  const handleSelectPresetStore = (store: (typeof PRESET_STORES)[0]) => {
    setStoreName(store.name);
    setAddress(store.address);
    setLat(store.lat);
    setLng(store.lng);
  };

  const handleUseCurrentLocation = () => {
    if (userLat && userLng) {
      setLat(userLat);
      setLng(userLng);
    }
  };

  const handleAddTaskInput = () => {
    if (newTaskText.trim()) {
      setTaskInputs([...taskInputs, newTaskText.trim()]);
      setNewTaskText('');
    }
  };

  const handleRemoveTaskInput = (index: number) => {
    setTaskInputs(taskInputs.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const doc: ResetDoc = {
            id: 'doc_' + Date.now(),
            name: file.name,
            type: isPdf ? 'pdf' : 'image',
            url: event.target.result as string,
            uploadedAt: new Date().toLocaleDateString(),
          };
          setDocuments([...documents, doc]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !storeName.trim()) return;

    const formattedTasks: ResetTask[] = taskInputs.map((txt, idx) => ({
      id: `task_${Date.now()}_${idx}`,
      text: txt,
      completed: false,
    }));

    const newProject: ResetProject = {
      id: 'reset_' + Date.now(),
      storeName: storeName.trim(),
      name: name.trim(),
      location: location.trim() || 'Main Floor',
      address: address.trim(),
      lat,
      lng,
      geofenceRadiusMeters: Number(radius),
      dueDate,
      priority,
      status: 'pending',
      tasks: formattedTasks,
      photos: [],
      documents,
      notes: notes.trim() || undefined,
    };

    onSave(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden text-gray-900 flex flex-col max-h-[92vh] shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 bg-blue-600 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Layers className="w-5 h-5" /> Create Merchandise Reset
            </h3>
            <p className="text-xs text-blue-100">
              Set up store, location geofence, planograms & items to reset
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-blue-700 hover:bg-blue-800 rounded-full text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Store Presets */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Select Store Location
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {PRESET_STORES.map((s) => (
                <button
                  type="button"
                  key={s.name}
                  onClick={() => handleSelectPresetStore(s)}
                  className={`p-2 rounded-xl text-xs font-semibold text-left border transition ${
                    storeName === s.name
                      ? 'border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-600'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <p className="font-bold truncate">{s.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{s.address}</p>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <input
                type="text"
                required
                placeholder="Store Name (e.g. Target #1042)"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Reset Title & Aisle Location */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Reset Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Snack aisle re-flow"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Aisle / Bay Location
              </label>
              <input
                type="text"
                placeholder="e.g. Aisle 12 Endcap"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Geofence & Coordinates */}
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Geofence Notification Radius
              </span>
              {userLat && userLng && (
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  Use My Current GPS
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-gray-500">Lat</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1 bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500">Lng</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1 bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500">Trigger Radius</label>
                <select
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1 bg-white font-semibold"
                >
                  <option value={150}>150 m (~500 ft)</option>
                  <option value={300}>300 m (~1000 ft)</option>
                  <option value={500}>500 m (~0.3 mi)</option>
                  <option value={1000}>1000 m (~0.6 mi)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Date & Priority */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          {/* Planogram Uploads */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Attach Planogram Documents / PDFs
            </label>
            <div className="flex items-center gap-2 mb-2">
              <label className="flex-1 border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50/50 rounded-xl p-3 text-center cursor-pointer transition">
                <Upload className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <span className="text-xs font-semibold text-gray-700">
                  Click to upload PDF or Planogram Image
                </span>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            {documents.length > 0 && (
              <div className="space-y-1">
                {documents.map((d, i) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between text-xs bg-gray-100 p-2 rounded-lg"
                  >
                    <span className="font-medium text-gray-800 truncate max-w-[280px]">
                      {d.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDocuments(documents.filter((_, idx) => idx !== i))}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specific Items Checklist */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Reset Action Checklist / Specific Items
            </label>
            <div className="space-y-1.5 mb-2">
              {taskInputs.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl text-xs border border-gray-200">
                  <span className="text-gray-800 font-medium">{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTaskInput(idx)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add specific item to reset..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTaskInput();
                  }
                }}
                className="flex-1 border border-gray-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddTaskInput}
                className="px-3 py-1.5 bg-gray-800 text-white text-xs font-semibold rounded-xl hover:bg-gray-900"
              >
                Add Item
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Additional Notes & Merchandising Instructions
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Use 8-inch pegs for bottom rows, check clearance pricing tags..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm active:scale-[0.99] transition"
            >
              <Check className="w-5 h-5" /> Save Merchandise Reset Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
