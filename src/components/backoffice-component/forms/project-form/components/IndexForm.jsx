// created methods for the form components
const InputComponent = ({
  type="text",
  name,
  className="form__input",
  placeholder="",
  required=true,
  value,
  onChange,
  label,
}) => (
  <div className="input-flow">
    <input
      type={type}
      name={name}
      className={className}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
    />
    <label className="form__label">{label}</label>
  </div>
);


// FileInput Component
const FileInputComponent = ({ name }) => <input type="file" name={name} />;
// Checkbox Component
const CheckboxComponent = ({ name }) => (
  <div className="input-flow">
    <input type="checkbox" name={name} />
    <label className="form__label">Highlighted</label>
  </div>
);



const ProjectDataComponent = ({
  items,
  setItems,
  title,
  setPopupWindow,
  formComponent,
}) => {
  const handleItemClose = (e, index) => {
    e.preventDefault();
    let temp = [...items];
    temp.splice(index, 1);
    setItems(temp);
  };

  return (
    <div className="group-container">
    <div className="input-container">
      <h2 className="title">{title}</h2>
      <input
        type="button"
        className="add-code-sample"
        value={`Add ${title}`}
        onClick={() => {
          setPopupWindow(formComponent);
        }}
      />
    </div>
      {items.length > 0 && (
        <div className="code-samples h-list">
          {items.map((item, index) => (
            <li key={index} className="tab tabSelected">
              <button className="btn title">{item.title}</button>
              <button
                className="btn closeTab"
                onClick={(e) => handleItemClose(e, index)}
              >
                ✕
              </button>
            </li>
          ))}
        </div>
      )}
    </div>
  );
};



// export the form components

export { InputComponent, FileInputComponent, CheckboxComponent , ProjectDataComponent };