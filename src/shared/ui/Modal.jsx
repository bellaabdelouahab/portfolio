import { useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  // Close modal when clicking escape key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // modal-overlay / modal-container / modal-content carry no styling of their
    // own any more — they are the hooks Modal.css still needs for the two
    // entrance animations and for reaching the caller-supplied iframe.
    <div
      className="modal-overlay fixed inset-0 z-1000 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="modal-container max-h-[90vh] w-[95%] max-w-175 overflow-y-auto rounded-md bg-surface shadow-lg md:w-[90%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3.75">
          <h2 className="tracking-[2px] text-ink-strong">{title}</h2>
          <button
            className="cursor-pointer border-none bg-transparent text-2xl leading-none text-ink transition-colors duration-200 hover:text-accent"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="modal-content p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
