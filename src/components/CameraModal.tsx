import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Upload, Check, AlertCircle } from 'lucide-react';
import { ResetPhoto } from '../types';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured: (photo: ResetPhoto) => void;
  taskId?: string;
  taskTitle?: string;
}

export function CameraModal({
  isOpen,
  onClose,
  onPhotoCaptured,
  taskId,
  taskTitle,
}: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [note, setNote] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  useEffect(() => {
    if (isOpen && !capturedUrl) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, capturedUrl]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        'Camera unavailable or permission denied. You can still upload a photo below.'
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedUrl(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedUrl(event.target.result as string);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!capturedUrl) return;
    const photo: ResetPhoto = {
      id: 'photo_' + Date.now(),
      url: capturedUrl,
      timestamp: new Date().toLocaleString(),
      note: note.trim() || undefined,
      taskId: taskId || undefined,
    };
    onPhotoCaptured(photo);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setCapturedUrl(null);
    setNote('');
    setCameraError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-between text-white">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800 bg-black/40 backdrop-blur shrink-0">
        <div>
          <h3 className="font-bold text-base flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-400" />
            Attach Photo Proof
          </h3>
          {taskTitle && (
            <p className="text-xs text-gray-400 truncate max-w-[260px]">
              For: {taskTitle}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Viewport */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
        {!capturedUrl ? (
          <>
            {cameraError ? (
              <div className="p-6 text-center max-w-xs space-y-4">
                <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
                <p className="text-sm text-gray-300">{cameraError}</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md active:bg-blue-700"
                >
                  <Upload className="w-4 h-4" /> Browse Photo File
                </button>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera controls overlay */}
            {!cameraError && (
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() =>
                    setFacingMode((prev) =>
                      prev === 'environment' ? 'user' : 'environment'
                    )
                  }
                  className="p-2.5 bg-black/50 backdrop-blur rounded-full text-white border border-white/20"
                  title="Switch Camera"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center bg-gray-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={capturedUrl}
              alt="Captured proof"
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-4 bg-gray-950 border-t border-gray-800 flex flex-col gap-3 shrink-0">
        {!capturedUrl ? (
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-200 transition"
              title="Upload from Device"
            >
              <Upload className="w-6 h-6" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {!cameraError && (
              <button
                onClick={takeSnapshot}
                className="w-16 h-16 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center shadow-lg active:scale-95 transition"
              >
                <div className="w-12 h-12 rounded-full bg-white" />
              </button>
            )}

            <div className="w-12" /> {/* spacer for symmetry */}
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Add optional photo caption or SKU note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 bg-gray-800 text-gray-300 font-semibold rounded-xl text-sm"
              >
                Retake
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-1.5 shadow"
              >
                <Check className="w-4 h-4" /> Save Photo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
