export default function ResourcesForm({ resources, setResources, setPopupWindow }) {
  const handleResourceSubmit = () => {
    let temp = [...resources];
    temp.push({
      title: document.querySelector(".resourceTitle").value,
      description: document.querySelector(".resourceDescription").value,
    });
    setResources(temp);
    setPopupWindow(null);
  };
  return (
    <div className="popup-container">
      <div className="popup">
        <p onClick={() => setPopupWindow(null)}>X</p>
        <input
          type="text"
          className="resourceTitle"
          name="resourceTitle"
          placeholder="Resource Title"
        />
        <br />
        <textarea
          type="text"
          className="resourceDescription"
          name="resourceDescription"
          placeholder="Resource Description"
        />
        <button onClick={handleResourceSubmit}>Submit</button>
      </div>
    </div>
  );
}
