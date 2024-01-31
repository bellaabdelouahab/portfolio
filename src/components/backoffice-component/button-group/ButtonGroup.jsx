export default function ButtonGroup({ tabs,activeTab, handleTabChange }) {
  return (
    <div className="buttons" data-tabindex={activeTab}>
      {tabs.map((tab, index) => (
        <button
          key={index}
          className="filldb-nav__btn"
          onClick={() => handleTabChange(index)}
        >
          {tab.label}
        </button>
      ))}

    </div>
  );
}
