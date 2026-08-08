import { useState, useRef } from 'react';
import './FileUpload.css';
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
    <div className="file-upload-container">
      <label className="file-upload-label">{label || 'Upload Image'}</label>
      
      <div 
        className={`file-upload-area ${preview ? 'has-preview' : ''}`}
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
          className="file-upload-input"
        />
        
        {preview ? (
          <div className="file-preview">
            <img src={preview} alt="Preview" className="file-preview-image" />
            <button 
              type="button" 
              className="file-remove-button"
              onClick={handleRemoveFile}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        ) : (
          <div className="file-upload-placeholder">
            <FontAwesomeIcon icon={faImage} className="file-icon" />
            <div className="file-upload-text">
              <p>Drag and drop your image here</p>
              <span>or</span>
              <button 
                type="button" 
                className="file-browse-button"
                onClick={handleBrowseClick}
              >
                <FontAwesomeIcon icon={faUpload} /> Browse files
              </button>
            </div>
            <p className="file-format-note">16:9 aspect ratio recommended (PNG, JPG, WEBP)</p>
          </div>
        )}
      </div>
      
      {file && (
        <div className="file-info">
          <span className="file-name">{file.name}</span>
          <span className="file-size">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
