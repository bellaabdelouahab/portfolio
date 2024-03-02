export default function TechsForm({ techs, setTechs, setPopupWindow }) {
  const handleTechSubmit = () => {
    let temp = [...techs];
    temp.push({
      title: document.querySelector(".techTitle").value,
      description: document.querySelector(".techDescription").value,
    });
    setTechs(temp);
    setPopupWindow(null);
  };
  return (
    <div className="popup-container">
      <div className="popup">
        <p onClick={() => setPopupWindow(null)}>X</p>
        <input
          type="text"
          className="techTitle"
          name="techTitle"
          placeholder="Tech Title"
        />
        <br />
        <textarea
          type="text"
          className="techDescription"
          name="techDescription"
          placeholder="Tech Description"
        />
        <button onClick={handleTechSubmit}>Submit</button>
      </div>
    </div>
  );
}
