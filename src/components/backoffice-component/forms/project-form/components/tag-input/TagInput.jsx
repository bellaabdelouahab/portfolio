import { useState, useRef, useEffect } from 'react';
import './TagInput.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faTags } from '@fortawesome/free-solid-svg-icons';

const TagInput = ({ tags, setTags, label }) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove the last tag when backspace is pressed in an empty input
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput && !tags.includes(trimmedInput)) {
      setTags([...tags, trimmedInput]);
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleContainerClick = () => {
    inputRef.current.focus();
  };

  return (
    <div 
      className={`tag-input-container ${isFocused ? 'focused' : ''}`} 
      onClick={handleContainerClick}
    >
      <div className="tag-input-icon">
        <FontAwesomeIcon icon={faTags} />
      </div>
      
      <div className="tag-input-wrapper">
        
        <div className="tag-input-field">
          {tags.map((tag, index) => (
            <div key={index} className="tag">
              <span className="tag-text">{tag}</span>
              <span 
                className="tag-close" 
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
              >
                <FontAwesomeIcon icon={faTimesCircle} />
              </span>
            </div>
          ))}
          
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              if (inputValue) addTag();
            }}
            className="tag-input"
            placeholder={tags.length > 0 ? "" : "Type and press Enter to add tags"}
          />
        </div>
      </div>
      
      <div className="tag-input-helper">
        Press Enter or comma to add
      </div>
    </div>
  );
};

export default TagInput;
