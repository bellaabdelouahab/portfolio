export default function ToolsForm({ tools, setTools, setPopupWindow }) {
  const handleToolSubmit = () => {
    let temp = [...tools];
    temp.push({
      title: document.querySelector(".toolTitle").value,
      description: document.querySelector(".toolDescription").value,
    });
    setTools(temp);
    setPopupWindow(null);
  };
  return (
    <div className="popup-container">
      <div className="popup">
        <p onClick={() => setPopupWindow(null)}>X</p>
        <input
          type="text"
          className="toolTitle"
          name="toolTitle"
          placeholder="Tool Title"
        />
        <br />
        <textarea
          type="text"
          className="toolDescription"
          name="toolDescription"
          placeholder="Tool Description"
        />
        <button onClick={handleToolSubmit}>Submit</button>
      </div>
    </div>
  );
}
