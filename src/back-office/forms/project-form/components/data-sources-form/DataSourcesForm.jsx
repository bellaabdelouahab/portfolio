import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faTimes, faLink, faFileAlt, faInfo } from '@fortawesome/free-solid-svg-icons';
import * as s from "../formStyles";

// Leading icon on a field label. Was `.field-icon`, coloured indigo.
const fieldIcon = "mr-2 text-success";

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
    <div className={s.popupOverlay}>
      <div className={`${s.popupPanel} w-full max-w-175`}>
        <button
          type="button"
          className={s.popupClose}
          onClick={() => setPopupWindow(null)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className={s.popupTitle}>
          <FontAwesomeIcon icon={faDatabase} className={s.popupTitleIcon} />
          Add Data Source
        </h2>

        <div className={s.fieldGroup}>
          <label className={s.fieldLabel} htmlFor="dataSourceType">Data Source Type</label>
          {/* Eight tiles: two columns on a phone, four from sm up. The old rule
              was written the other way round (4 cols, dropping to 2 under
              600px). */}
          <div className="mt-2.5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {dataSourcesImg.map((type, index) => (
              <div
                key={index}
                className={[
                  "flex cursor-pointer flex-col items-center justify-center rounded-md border px-2.5 py-4",
                  "transition-all duration-200 ease-standard hover:-translate-y-[3px]",
                  dataSourceType === type
                    ? "border-success bg-success/15 shadow-md"
                    : "border-line bg-surface-raised hover:border-success/40",
                ].join(" ")}
                onClick={() => setDataSourceType(type)}
              >
                <div className="mb-1.5 flex size-10 items-center justify-center">
                  <img
                    src={`/images/datasources/${type}.svg`}
                    alt={type}
                    className="h-auto w-full object-contain"
                    onError={(e) => {
                      e.target.onError = null;
                      e.target.src = "/images/datasources/default.svg";
                    }}
                  />
                </div>
                <span className="text-xs leading-relaxed tracking-wide uppercase">{type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={s.fieldGroup}>
          <label className={s.fieldLabel} htmlFor="dataSourceName">
            <FontAwesomeIcon icon={faFileAlt} className={fieldIcon} />
            Data Source Name
          </label>
          <input
            type="text"
            id="dataSourceName"
            className={s.control}
            value={dataSourceName}
            onChange={(e) => setDataSourceName(e.target.value)}
            placeholder="e.g., 'Customer Records', 'Transaction Data'"
          />
        </div>

        <div className={s.fieldGroup}>
          <label className={s.fieldLabel} htmlFor="dataSourceSize">
            <FontAwesomeIcon icon={faInfo} className={fieldIcon} />
            Size/Records (optional)
          </label>
          <input
            type="text"
            id="dataSourceSize"
            className={s.control}
            value={dataSourceSize}
            onChange={(e) => setDataSourceSize(e.target.value)}
            placeholder="e.g., '2.5 GB', '10,000 records'"
          />
        </div>

        <div className={s.fieldGroup}>
          <label className={s.fieldLabel} htmlFor="dataSourceLink">
            <FontAwesomeIcon icon={faLink} className={fieldIcon} />
            Source Link (optional)
          </label>
          <input
            type="text"
            id="dataSourceLink"
            className={s.control}
            value={dataSourceLink}
            onChange={(e) => setDataSourceLink(e.target.value)}
            placeholder="URL to the data source if publicly available"
          />
        </div>

        {error && <div className={s.formError}>{error}</div>}

        <div className={s.formActions}>
          <button
            type="button"
            className={s.btnGhost}
            onClick={() => setPopupWindow(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className={s.btnPrimary}
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
