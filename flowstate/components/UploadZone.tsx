import React, { useCallback, useState } from 'react';
import { UploadCloud, FileImage, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onImageSelected: (base64: string) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPEG, PNG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size too large. Please keep it under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onImageSelected(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
                FlowState
            </h1>
            <p className="text-slate-400 text-lg">
                Turn your whiteboard chaos into structured workflows instantly.
            </p>
        </div>

      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ease-in-out cursor-pointer group
          ${isDragging 
            ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' 
            : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input
          id="fileInput"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileInput}
        />
        
        <div className="flex flex-col items-center justify-center gap-4">
          <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-blue-500/20' : 'bg-slate-700/50 group-hover:bg-slate-700'}`}>
            <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-blue-400' : 'text-slate-400'}`} />
          </div>
          <div>
            <p className="text-lg font-medium text-slate-200">
              {isDragging ? 'Drop strategy sketch here' : 'Upload Whiteboard or Strategy Sketch'}
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Drag & drop or click to browse (JPEG, PNG)
            </p>
          </div>
        </div>

        {error && (
            <div className="absolute -bottom-12 left-0 right-0 flex items-center justify-center text-red-400 text-sm animate-pulse">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
            </div>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-800">
            <div className="font-semibold text-slate-200 mb-1">Upload</div>
            <div className="text-xs text-slate-500">Photo of your meeting notes</div>
        </div>
        <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-800">
            <div className="font-semibold text-slate-200 mb-1">Analyze</div>
            <div className="text-xs text-slate-500">AI extracts OKRs & Tasks</div>
        </div>
        <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-800">
            <div className="font-semibold text-slate-200 mb-1">Execute</div>
            <div className="text-xs text-slate-500">Track on Kanban Board</div>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;
