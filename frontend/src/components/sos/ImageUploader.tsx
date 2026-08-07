"use client";

import React, { useState } from "react";
import { UploadCloud, Image as ImageIcon, X, CheckCircle2 } from "lucide-react";

export const ImageUploader: React.FC = () => {
  const [file, setFile] = useState<{ name: string; url: string } | null>(null);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile({
        name: selected.name,
        url: URL.createObjectURL(selected),
      });
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2">
        Upload Emergency Scene Photo (Optional)
      </label>

      {!file ? (
        <label className="flex flex-col items-center justify-center w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-red-50/30 hover:border-red-400 transition-all duration-200 group p-4">
          <div className="p-2.5 bg-white text-gray-400 group-hover:text-red-500 rounded-xl shadow-xs group-hover:scale-110 transition-all mb-2">
            <UploadCloud className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-gray-700">
            Click to upload or drag &amp; drop photo
          </span>
          <span className="text-[10px] text-gray-400 mt-0.5">
            PNG, JPG, or JPEG (Max 10MB)
          </span>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleSimulatedUpload}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative p-3 bg-red-50/50 border border-red-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 text-white rounded-xl shadow-xs">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-gray-900 block truncate max-w-[200px]">
                {file.name}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Attached for AI Scene Analysis
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="p-1.5 bg-white hover:bg-gray-100 text-gray-500 hover:text-red-600 rounded-xl border border-gray-200 transition-colors"
            aria-label="Remove uploaded photo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
