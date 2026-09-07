import React, { useState } from 'react';
import { Camera, X, Trash2, Calendar, FileText, Download } from 'lucide-react';
import { ResetPhoto } from '../types';

interface PhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: ResetPhoto[];
  onDeletePhoto: (photoId: string) => void;
  onAddPhotoClick: () => void;
  projectName: string;
}

export function PhotoGalleryModal({
  isOpen,
  onClose,
  photos,
  onDeletePhoto,
  onAddPhotoClick,
  projectName,
}: PhotoGalleryModalProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<ResetPhoto | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-lg bg-gray-900 rounded-2xl overflow-hidden text-white flex flex-col max-h-[92vh] border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-gray-900 border-b border-gray-800 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-400" /> Photo Proof Gallery ({photos.length})
            </h3>
            <p className="text-xs text-gray-400 truncate">{projectName}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onAddPhotoClick}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow"
            >
              + Take Photo
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-950">
          {selectedPhoto ? (
            <div className="flex flex-col items-center space-y-3">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="self-start text-xs font-semibold text-blue-400 hover:underline mb-1"
              >
                ← Back to Gallery
              </button>
              <div className="relative w-full rounded-xl overflow-hidden border border-gray-800 bg-black flex items-center justify-center max-h-[55vh]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedPhoto.url}
                  alt="Proof"
                  className="max-w-full max-h-[55vh] object-contain rounded"
                />
              </div>
              <div className="w-full bg-gray-900 p-3 rounded-xl space-y-1 text-xs">
                <p className="text-gray-300">
                  <span className="font-bold text-gray-400">Captured:</span> {selectedPhoto.timestamp}
                </p>
                {selectedPhoto.note && (
                  <p className="text-white font-medium">
                    <span className="text-blue-400 font-bold">Note:</span> {selectedPhoto.note}
                  </p>
                )}
                <div className="pt-2 flex justify-between items-center border-t border-gray-800 mt-2">
                  <a
                    href={selectedPhoto.url}
                    download={`reset_proof_${selectedPhoto.id}.jpg`}
                    className="text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" /> Save Image
                  </a>
                  <button
                    onClick={() => {
                      onDeletePhoto(selectedPhoto.id);
                      setSelectedPhoto(null);
                    }}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Photo
                  </button>
                </div>
              </div>
            </div>
          ) : photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPhoto(p)}
                  className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 cursor-pointer hover:border-blue-500 transition active:scale-95"
                >
                  <div className="aspect-square bg-black flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.url}
                      alt="Proof thumbnail"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="p-2 text-[11px] bg-gray-900/90 backdrop-blur">
                    <p className="font-semibold text-gray-200 truncate">
                      {p.note || 'Verification Photo'}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">{p.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 space-y-3">
              <Camera className="w-12 h-12 text-gray-600 mx-auto" />
              <p className="text-sm text-gray-400">No photos captured for this reset yet.</p>
              <button
                onClick={onAddPhotoClick}
                className="px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow"
              >
                Take First Photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
