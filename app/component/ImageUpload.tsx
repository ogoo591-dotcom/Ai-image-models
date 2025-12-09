interface ImageUploadProps {
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageUpload({ selectedFile, onFileChange }: ImageUploadProps) {
  if (selectedFile) {
    return (
      <div className="border border-slate-300 rounded-lg p-4">
        <div className="aspect-video bg-slate-100 rounded-md flex items-center justify-center">
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-md"
          />
        </div>
      </div>
    );
  }
  return (
    <div className="border border-slate-300 rounded-lg text-center h-10">
      <label htmlFor="file-upload" className="cursor-pointer">
        <span className="text-sm font-medium text-slate-900 hover:text-slate-700">
          Choose File
        </span>
        <input
          id="file-upload"
          type="file"
          className="sr-only"
          accept="image/*"
          onChange={onFileChange}
        ></input>
      </label>
      <span className="text-sm text-slate-500 ml-2">JPG, PNG</span>
    </div>
  );
}
