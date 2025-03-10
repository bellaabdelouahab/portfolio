import { useState } from "react";
import "./TechsForm.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function TechsForm({ techs, setTechs, setPopupWindow }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = () => {
    // Validate form
    if (!title.trim()) {
      setError("Please enter a technology name");
      return;
    }
    
    if (!description.trim()) {
      setError("Please enter a technology description");
      return;
    }
    
    // Add technology
    const newTechs = [...techs];
    newTechs.push({
      title: title.trim(),
      description: description.trim()
    });
    
    setTechs(newTechs);
    setPopupWindow(null);
  };
  
  // List of common technologies for quick selection
  const commonTechs = [
    { name: "React", desc: "A JavaScript library for building user interfaces" },
    { name: "Node.js", desc: "JavaScript runtime built on Chrome's V8 JavaScript engine" },
    { name: "Python", desc: "Interpreted high-level general-purpose programming language" },
    { name: "Docker", desc: "Platform for developing, shipping, and running applications in containers" },
    { name: "MongoDB", desc: "NoSQL document database with scalability and flexibility" },
    { name: "Firebase", desc: "Google's platform for app development, hosting and more" }
  ];
  
  const quickSelectTech = (tech) => {
    setTitle(tech.name);
    setDescription(tech.desc);
  };

  return (
    <div className="popup-container">
      <div className="tech-form popup">
        <button 
          type="button" 
          className="close-button" 
          onClick={() => setPopupWindow(null)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <h2 className="form-title">
          <FontAwesomeIcon icon={faMicrochip} className="title-icon" />
          Add Technology
        </h2>
        
        <div className="quick-select">
          <label>Quick Select:</label>
          <div className="quick-select-buttons">
            {commonTechs.map((tech, index) => (
              <button 
                key={index} 
                type="button" 
                onClick={() => quickSelectTech(tech)}
                className="quick-select-btn"
              >
                {tech.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="techTitle">Technology Name</label>
          <input
            type="text"
            id="techTitle"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., 'React', 'TensorFlow', 'AWS'"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="techDescription">Description</label>
          <textarea
            id="techDescription"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe how this technology was used in your project"
            rows={4}
          />
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
            Add Technology
          </button>
        </div>
      </div>
    </div>
  );
}
