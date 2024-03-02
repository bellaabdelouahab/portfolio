import { useState } from "react";

export default function DataSourcesForm({
  dataSources,
  setDataSources,
  setPopupWindow,
}) {
  const [dataSourceType, setDataSourceType] = useState("");
  const [dataSourceName, setDataSourceName] = useState("");
  const [dataSourceSize, setDataSourceSize] = useState("");
  const [dataSourceLink, setDataSourceLink] = useState("");

  const handleDataSourceSubmit = () => {
    let temp = [...dataSources];
    temp.push({
      type: dataSourceType,
      name: dataSourceName,
      size: dataSourceSize,
        link: dataSourceLink,
    });
    setDataSources(temp);
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

  const handleTypeChange = (e) => {
    setDataSourceType(e.target.value);
  };

  return (
    <div className="popup-container">
      <div className="popup">
        <p onClick={() => setPopupWindow(null)}>X</p>
        <select value={dataSourceType} onChange={handleTypeChange}>
          <option value="">Select Data Source Type</option>
          {dataSourcesImg.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
        <br />
        <input
          type="text"
          value={dataSourceName}
          onChange={(e) => setDataSourceName(e.target.value)}
          placeholder="Data Source Name"
        />
        <br />
        <input
          type="text"
          value={dataSourceSize}
          onChange={(e) => setDataSourceSize(e.target.value)}
          placeholder="Data Source Size"
        />
        <br />
        <input
          type="text"
          value={dataSourceLink}
          onChange={(e) => setDataSourceLink(e.target.value)}
          placeholder="Data Source Link"
        />
        <button onClick={handleDataSourceSubmit}>Submit</button>
      </div>
    </div>
  );
}
