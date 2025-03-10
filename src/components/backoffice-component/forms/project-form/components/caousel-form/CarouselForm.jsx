import { useState } from "react";
import "./CarouselForm.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTimes, faPlus, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function CarouselForm({ carouselSamples, setCarouselSamples, setPopupWindow }) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file is an image
      if (!file.type.match('image.*')) {
        setError("Please select an image file");
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
      setError("");
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
      const file = e.dataTransfer.files[0];
      
      // Validate file is an image
      if (!file.type.match('image.*')) {
        setError("Please select an image file");
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleSubmit = () => {
    if (!title) {
      setError("Please enter a title for the carousel image");
      return;
    }
    
    if (!image) {
      setError("Please select an image");
      return;
    }
    
    let temp = [...carouselSamples];
    temp.push({
      title: title,
      img: [image]
    });
    
    setCarouselSamples(temp);
    setPopupWindow(null);
  };

  return (
    <div className="popup-container">
      <div className="carousel-form popup">
        <button 
          type="button" 
          className="close-button" 
          onClick={() => setPopupWindow(null)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <h2 className="form-title">Add Carousel Image</h2>
        
        <div className="form-group">
          <label htmlFor="carouselTitle">Image Title</label>
          <input
            type="text"
            id="carouselTitle"
            className="carousel-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title for this image"
          />
        </div>

        <div className="form-group">
          <label>Image Upload</label>
          <div 
            className={`carousel-upload-area ${preview ? 'has-preview' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="file-input"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              id="carouselImage"
            />
            
            {preview ? (
              <div className="carousel-preview">
                <img src={preview} alt="Preview" className="preview-image" />
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <FontAwesomeIcon icon={faImage} className="upload-icon" />
                <div className="upload-text">
                  <p>Drag & drop image here</p>
                  <span>or</span>
                  <label htmlFor="carouselImage" className="browse-btn">
                    <FontAwesomeIcon icon={faPlus} /> Browse files
                  </label>
                </div>
              </div>
            )}
          </div>
          
          <div className="image-requirements">
            <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
            <span>Recommended: JPG, PNG or WebP • Max 5MB • 16:9 aspect ratio</span>
          </div>
        </div>
        
        {error && <div className="form-error">{error}</div>}
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => setPopupWindow(null)}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="submit-btn" 
            onClick={handleSubmit}
          >
            Add to Carousel
          </button>
        </div>
      </div>
    </div>
  );
}