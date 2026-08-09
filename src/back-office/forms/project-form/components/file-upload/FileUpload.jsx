import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';

const FileUpload = ({ name, label, required = true, acceptedTypes = "image/*" }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create a preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreview(event.target.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check if the file type is accepted
      if (acceptedTypes && !droppedFile.type.match(acceptedTypes)) {
        alert(`Only ${acceptedTypes} files are accepted`);
        return;
      }
      
      // Update the file input value
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(droppedFile);
      fileInputRef.current.files = dataTransfer.files;
      
      // Trigger the change event manually
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    fileInputRef.current.value = '';
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="my-5 w-full">
      <label className="mb-2.5 block text-lg font-semibold text-ink">
        {label || 'Upload Image'}
      </label>

      {/* `drag-over` is added/removed via classList by the handlers above, so
          it's matched as an arbitrary variant rather than lifted into state. */}
      <div
        className={[
          "relative flex w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-success/40 bg-surface transition-colors duration-300 ease-standard hover:border-success hover:bg-success/10 [&.drag-over]:border-success [&.drag-over]:bg-success/10",
          preview
            ? "min-h-50 border-solid border-success/70 p-2.5 md:min-h-75"
            : "min-h-37.5 md:min-h-50",
        ].join(" ")}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          name={name}
          ref={fileInputRef}
          onChange={handleFileChange}
          required={required}
          accept={acceptedTypes}
          className="absolute inset-0 z-2 h-full w-full cursor-pointer opacity-0"
        />

        {preview ? (
          <div className="relative flex h-full w-full items-center justify-center">
            <img
              src={preview}
              alt="Preview"
              className="max-h-75 w-full rounded-sm object-contain"
            />
            <button
              type="button"
              className="absolute top-2.5 right-2.5 flex size-7.5 cursor-pointer items-center justify-center rounded-full bg-danger/80 text-white transition-transform duration-200 ease-standard hover:scale-110 hover:bg-danger"
              onClick={handleRemoveFile}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center px-5 py-7.5 text-center">
            <FontAwesomeIcon
              icon={faImage}
              className="mb-4 text-4xl text-success/70 md:text-5xl"
            />
            <div className="flex flex-col items-center gap-2.5">
              <p className="text-sm leading-relaxed text-ink md:text-base">
                Drag and drop your image here
              </p>
              <span className="text-sm text-ink-muted">or</span>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2 rounded-sm bg-success px-4 py-2 text-xs font-semibold text-page transition-colors duration-200 ease-standard hover:bg-success/85 md:px-5 md:py-2.5"
                onClick={handleBrowseClick}
              >
                <FontAwesomeIcon icon={faUpload} /> Browse files
              </button>
            </div>
            <p className="mt-4 text-xs text-ink-muted">
              16:9 aspect ratio recommended (PNG, JPG, WEBP)
            </p>
          </div>
        )}
      </div>

      {file && (
        <div className="mt-2.5 flex items-center gap-2.5 rounded-sm bg-success/10 px-2.5 py-1.5">
          <span className="flex-1 truncate text-sm text-ink">{file.name}</span>
          <span className="text-xs text-ink-muted">
            ({(file.size / (1024 * 1024)).toFixed(2)} MB)
          </span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
