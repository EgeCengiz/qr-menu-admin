import React, { useRef, useState } from 'react';
import { Upload, Film, X, FileCheck } from 'lucide-react';

interface FileUploaderProps {
  label: string;
  accept: string;
  currentValue?: string;
  onChange: (dataUrl: string) => void;
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

  const handleFileChange = (file: File) => {
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
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
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const isVideo = currentValue && (currentValue.startsWith('data:video') || currentValue.endsWith('.mp4') || currentValue.includes('video'));
  const isGif = currentValue && (currentValue.includes('image/gif') || currentValue.endsWith('.gif') || currentValue.includes('giphy'));

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
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-4 ${
          dragActive
            ? 'border-[#c8a165] bg-[#c8a165]/10'
            : currentValue
            ? 'border-[#3a2e26] bg-[#0d0a08]/80 hover:border-[#c8a165]/50'
            : 'border-[#3a2e26] bg-[#0d0a08] hover:border-[#c8a165]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={onInputChange}
          className="hidden"
        />

        {/* Media Preview Box */}
        {currentValue ? (
          <div className="flex items-center gap-4 w-full">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#16120f] border border-[#c8a165]/30 flex-shrink-0 flex items-center justify-center">
              {isVideo && !isGif ? (
                <video src={currentValue} autoPlay loop muted playsInline className="w-full h-full object-cover" />
              ) : (
                <img src={currentValue} alt="Preview" className="w-full h-full object-cover" />
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
    </div>
  );
};
