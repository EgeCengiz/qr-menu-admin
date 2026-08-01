import React, { useRef, useState } from 'react';
import { Upload, Film, X, FileCheck, Loader2 } from 'lucide-react';
import { apiUploadFile, resolveMediaUrl } from '../api/apiClient';

interface FileUploaderProps {
  label: string;
  accept: string;
  currentValue?: string;
  onChange: (url: string) => void;
  mediaType?: 'image' | 'video' | 'any';
  description?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  accept,
  currentValue,
  onChange,
  mediaType = 'any',
  description = 'Bilgisayarınızdan dosya seçin veya buraya sürükleyin',
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sizeWarning, setSizeWarning] = useState<string | null>(null);

  const handleFileChange = async (file: File) => {
    if (!file) return;

    setFileName(file.name);
    setUploadError(null);
    setSizeWarning(null);
    setIsUploading(true);
    setUploadProgress(0);

    // Warn if video is larger than 50 MB — suggest compression
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > 50) {
      setSizeWarning(
        `⚠️ ${sizeMb.toFixed(0)} MB büyük bir dosya. Mobilde yavaş yüklenebilir. HandBrake veya Clideo ile sıkıştırmanız önerilir.`
      );
    }

    try {
      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return 85;
          }
          return prev + 5;
        });
      }, 200);

      const result = await apiUploadFile(file);
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Save relative URL e.g. /uploads/filename.mp4 so it works on all devices (mobile & desktop)
      onChange(result.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Yükleme başarısız oldu.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      void handleFileChange(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      void handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const isVideo = currentValue && (currentValue.includes('/uploads/') || currentValue.endsWith('.mp4') || currentValue.endsWith('.webm') || currentValue.endsWith('.mov'));
  const isGif = currentValue && (currentValue.endsWith('.gif') || currentValue.includes('image/gif'));

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-[#c8a165] uppercase tracking-wider">
        {label}
      </label>

      {/* Upload Zone & Preview Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all duration-200 flex flex-col md:flex-row items-center justify-between gap-4 ${
          isUploading
            ? 'border-[#c8a165]/60 bg-[#c8a165]/5 cursor-wait'
            : dragActive
            ? 'border-[#c8a165] bg-[#c8a165]/10 cursor-copy'
            : currentValue
            ? 'border-[#3a2e26] bg-[#0d0a08]/80 hover:border-[#c8a165]/50 cursor-pointer'
            : 'border-[#3a2e26] bg-[#0d0a08] hover:border-[#c8a165] cursor-pointer'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={onInputChange}
          className="hidden"
          disabled={isUploading}
        />

        {/* Uploading State */}
        {isUploading ? (
          <div className="flex flex-col items-center justify-center w-full gap-3 py-3">
            <div className="flex items-center gap-2 text-[#c8a165]">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-xs font-semibold">Yükleniyor... {uploadProgress}%</span>
            </div>
            <div className="w-full bg-[#201814] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8b5a2b] via-[#c8a165] to-[#f3e5ab] transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-[#a0907a]">{fileName}</p>
          </div>
        ) : currentValue ? (
          /* Media Preview Box */
          <div className="flex items-center gap-4 w-full">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#16120f] border border-[#c8a165]/30 flex-shrink-0 flex items-center justify-center">
              {isVideo && !isGif ? (
                <video src={resolveMediaUrl(currentValue)} autoPlay loop muted playsInline className="w-full h-full object-cover" />
              ) : (
                <img src={resolveMediaUrl(currentValue)} alt="Preview" className="w-full h-full object-cover" />
              )}
              <span className="absolute bottom-1 right-1 text-[8px] bg-[#c8a165] text-[#0d0a08] font-bold px-1 rounded">
                {isVideo ? 'VIDEO' : isGif ? 'GIF' : 'RESİM'}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
                <FileCheck className="w-4 h-4" />
                <span>Yüklendi: {fileName || 'Yüklü Medya'}</span>
              </div>
              <p className="text-[11px] text-[#a0907a]">
                Farklı bir dosya seçmek veya değiştirmek için tıklayın.
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                setFileName('');
                setUploadError(null);
              }}
              className="p-2 text-[#a0907a] hover:text-red-400 rounded-xl cursor-pointer"
              title="Kaldır"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 py-2 px-2 text-center md:text-left w-full justify-center md:justify-start">
            <div className="p-3 bg-[#1f1914] border border-[#3a2e26] rounded-2xl text-[#c8a165]">
              {mediaType === 'video' ? <Film className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-xs font-bold text-[#e2d8c3]">
                Bilgisayardan Dosya Seç
              </p>
              <p className="text-[11px] text-[#a0907a]">{description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
          <X className="w-3.5 h-3.5" />
          {uploadError}
        </p>
      )}

      {/* Size Warning */}
      {sizeWarning && !uploadError && (
        <p className="text-[11px] text-amber-400/90 bg-amber-900/20 border border-amber-600/30 rounded-xl px-3 py-2 mt-1 leading-relaxed">
          {sizeWarning}
        </p>
      )}
    </div>
  );
};
