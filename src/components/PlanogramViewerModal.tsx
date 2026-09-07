import React, { useState, useRef } from 'react';
import {
  FileText,
  X,
  Upload,
  Download,
  ExternalLink,
  Plus,
  Trash2,
  FileCheck,
  Eye,
  Image as ImageIcon,
  Sparkles,
  Package,
  Wrench,
  Compass
} from 'lucide-react';
import { ResetDoc } from '../types';
import { GondolaTransitionGuide } from './GondolaTransitionGuide';

interface PlanogramViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: ResetDoc[];
  onAddDocument: (doc: ResetDoc) => void;
  onDeleteDocument: (docId: string) => void;
  projectName: string;
}

export function PlanogramViewerModal({
  isOpen,
  onClose,
  documents,
  onAddDocument,
  onDeleteDocument,
  projectName,
}: PlanogramViewerModalProps) {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(
    documents[0]?.id || 'transition_guide'
  );
  const [activeViewMode, setActiveViewMode] = useState<'guide' | 'doc'>('guide');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const currentDoc =
    documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newDoc: ResetDoc = {
            id: 'doc_' + Date.now(),
            name: file.name,
            type: isPdf ? 'pdf' : 'image',
            url: event.target.result as string,
            uploadedAt: new Date().toLocaleDateString(),
          };
          onAddDocument(newDoc);
          setSelectedDocId(newDoc.id);
          setActiveViewMode('doc');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-lg bg-slate-900 rounded-2xl overflow-hidden text-white flex flex-col max-h-[92vh] border border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-[#003B73] border-b border-blue-900 flex items-center justify-between shrink-0">
          <div className="min-w-0 pr-2">
            <h3 className="font-extrabold text-base flex items-center gap-2 text-white">
              <FileCheck className="w-5 h-5 text-amber-400" /> Planograms & Transition Blueprint
            </h3>
            <p className="text-xs text-blue-100 truncate font-medium">{projectName}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#003B73] rounded-lg text-xs font-black flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Upload Doc
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={onClose}
              className="p-1.5 bg-blue-900/60 hover:bg-blue-900 rounded-lg text-blue-200 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Toggle Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950 p-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveViewMode('guide')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              activeViewMode === 'guide'
                ? 'bg-[#00529B] text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Transition Guide & Hardware
          </button>
          <button
            onClick={() => setActiveViewMode('doc')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              activeViewMode === 'doc'
                ? 'bg-[#00529B] text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-300" /> Uploaded Planograms ({documents.length})
          </button>
        </div>

        {/* Main Document / Guide Body */}
        <div className="flex-1 overflow-y-auto p-3 bg-slate-950 min-h-[350px]">
          {activeViewMode === 'guide' ? (
            <GondolaTransitionGuide onCloseModal={onClose} />
          ) : (
            <div className="space-y-3">
              {/* Document Tabs */}
              {documents.length > 0 && (
                <div className="flex gap-2 p-1 overflow-x-auto no-scrollbar pb-1">
                  {documents.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition ${
                        currentDoc?.id === doc.id
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {doc.type === 'pdf' ? (
                        <FileText className="w-3.5 h-3.5" />
                      ) : (
                        <ImageIcon className="w-3.5 h-3.5" />
                      )}
                      <span className="max-w-[120px] truncate">{doc.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {currentDoc ? (
                <div className="w-full flex flex-col items-center space-y-3">
                  {currentDoc.type === 'image' ? (
                    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center max-h-[50vh]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentDoc.url}
                        alt={currentDoc.name}
                        className="max-w-full max-h-[50vh] object-contain rounded"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-[45vh] border border-slate-800 rounded-xl overflow-hidden bg-slate-900 flex flex-col items-center justify-center p-6 text-center space-y-4">
                      <FileText className="w-16 h-16 text-blue-400" />
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          {currentDoc.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 font-medium">
                          PDF Planogram Document • Uploaded {currentDoc.uploadedAt}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={currentDoc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-[#00529B] hover:bg-[#003B73] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
                        >
                          <ExternalLink className="w-4 h-4" /> Open Full PDF
                        </a>
                        <a
                          href={currentDoc.url}
                          download={currentDoc.name}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                        >
                          <Download className="w-4 h-4" /> Download
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Doc meta bar */}
                  <div className="w-full flex items-center justify-between px-1 text-xs text-slate-400 pt-1">
                    <span>Uploaded: {currentDoc.uploadedAt}</span>
                    <button
                      onClick={() => onDeleteDocument(currentDoc.id)}
                      className="text-red-400 hover:text-red-300 flex items-center gap-1 hover:underline font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove file
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 space-y-3">
                  <Upload className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-sm text-slate-400">No custom planogram documents attached yet.</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#00529B] text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Upload Planogram PDF / Image
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
