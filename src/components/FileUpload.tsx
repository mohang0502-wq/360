import { useState, useRef, useCallback } from 'react';
import { Upload, X, File, ImageIcon, Link } from 'lucide-react';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  preview?: string;
}

interface FileUploadProps {
  dropboxLink?: boolean;
}

export default function FileUpload({ dropboxLink = true }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dropboxUrl, setDropboxUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadedFile[] = [];
    Array.from(fileList).forEach((file) => {
      const uf: UploadedFile = { name: file.name, size: file.size, type: file.type };
      if (file.type.startsWith('image/')) {
        uf.preview = URL.createObjectURL(file);
      }
      newFiles.push(uf);
    });
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => setIsDragOver(false), []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFiles(e.target.files);
  }, [processFiles]);

  const removeFile = useCallback((idx: number) => {
    setFiles((prev) => {
      const copy = [...prev];
      if (copy[idx].preview) URL.revokeObjectURL(copy[idx].preview!);
      copy.splice(idx, 1);
      return copy;
    });
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className={`dropzone ${isDragOver ? 'dragover' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.zip,.rar"
          className="hidden"
          onChange={onFileChange}
        />
        <div className="flex flex-col items-center gap-3 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <Upload size={22} className="text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Drag &amp; drop your images here
            </p>
            <p className="text-xs text-slate-500 mt-1">
              or <span className="underline text-slate-700">click to browse</span> — JPG, PNG, TIFF, PSD, ZIP accepted
            </p>
          </div>
          <p className="text-xs text-slate-400">File names are included in your request — share the files via a link below, or we will reply with a secure upload link.</p>
        </div>
      </div>

      {/* Names of the chosen files travel with the form submission. */}
      <input type="hidden" name="sampleFiles" value={files.map((f) => f.name).join(", ")} />

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
            >
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 bg-slate-200 rounded-md flex items-center justify-center flex-shrink-0">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon size={16} className="text-slate-500" />
                  ) : (
                    <File size={16} className="text-slate-500" />
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropbox link */}
      {dropboxLink && (
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Link size={15} className="text-slate-400" />
          </div>
          <input
            type="url"
            name="sampleLink"
            value={dropboxUrl}
            onChange={(e) => setDropboxUrl(e.target.value)}
            placeholder="Or paste a Dropbox / Google Drive / WeTransfer link..."
            className="w-full pl-9 pr-4 py-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition"
          />
        </div>
      )}
    </div>
  );
}
