import { useState } from "react";
import "./DataSourcesForm.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faTimes, faLink, faFileAlt, faInfo } from '@fortawesome/free-solid-svg-icons';

export default function DataSourcesForm({ dataSources, setDataSources, setPopupWindow }) {
  const [dataSourceType, setDataSourceType] = useState("");
  const [dataSourceName, setDataSourceName] = useState("");
  const [dataSourceSize, setDataSourceSize] = useState("");
  const [dataSourceLink, setDataSourceLink] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // Validate form
    if (!dataSourceType) {
      setError("Please select a data source type");
      return;
    }
    
    if (!dataSourceName.trim()) {
      setError("Please enter a name for the data source");
      return;
    }
    
    // Add data source
    const newDataSources = [...dataSources];
    newDataSources.push({
      type: dataSourceType,
      name: dataSourceName.trim(),
      size: dataSourceSize.trim(),
      link: dataSourceLink.trim()
    });
    
    setDataSources(newDataSources);
    setPopupWindow(null);
  };

  const dataSourcesImg = [
    "excel",
    "csv",
    "json",
    "sql-server",
    "mysql",
    "mongodb",
    "python",
    "xml",
  ];

  return (
    <div className="popup-container">
      <div className="datasource-form popup">
        <button 
          type="button" 
          className="close-button" 
          onClick={() => setPopupWindow(null)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <h2 className="form-title">
          <FontAwesomeIcon icon={faDatabase} className="title-icon" />
          Add Data Source
        </h2>
        
        <div className="form-group">
          <label htmlFor="dataSourceType">Data Source Type</label>
          <div className="datasource-types">
            {dataSourcesImg.map((type, index) => (
              <div 
                key={index} 
                className={`datasource-type ${dataSourceType === type ? 'selected' : ''}`}
                onClick={() => setDataSourceType(type)}
              >
                <div className="datasource-icon">
                  <img 
                    src={`/images/datasources/${type}.svg`} 
                    alt={type}
                    onError={(e) => {
                      e.target.onError = null;
                      e.target.src = "/images/datasources/default.svg";
                    }}
                  />
                </div>
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="dataSourceName">
            <FontAwesomeIcon icon={faFileAlt} className="field-icon" />
            Data Source Name
          </label>
          <input
            type="text"
            id="dataSourceName"
            className="form-control"
            value={dataSourceName}
            onChange={(e) => setDataSourceName(e.target.value)}
            placeholder="e.g., 'Customer Records', 'Transaction Data'"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="dataSourceSize">
            <FontAwesomeIcon icon={faInfo} className="field-icon" />
            Size/Records (optional)
          </label>
          <input
            type="text"
            id="dataSourceSize"
            className="form-control"
            value={dataSourceSize}
            onChange={(e) => setDataSourceSize(e.target.value)}
            placeholder="e.g., '2.5 GB', '10,000 records'"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="dataSourceLink">
            <FontAwesomeIcon icon={faLink} className="field-icon" />
            Source Link (optional)
          </label>
          <input
            type="text"
            id="dataSourceLink"
            className="form-control"
            value={dataSourceLink}
            onChange={(e) => setDataSourceLink(e.target.value)}
            placeholder="URL to the data source if publicly available"
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
            disabled={!dataSourceType || !dataSourceName}
          >
            Add Data Source
          </button>
        </div>
      </div>
    </div>
  );
}
