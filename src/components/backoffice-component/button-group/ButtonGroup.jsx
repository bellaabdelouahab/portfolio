export default function ButtonGroup({ activeTab, handleTabChange }) {
  return (
    <div className="buttons" data-tabIndex={activeTab}>
      <button
        className={"filldb-nav__btn"}
        onClick={() => {
          handleTabChange(0);
        }}
      >
        Project
      </button>

      <button
        className={"filldb-nav__btn"}
        onClick={() => {
          handleTabChange(1);
        }}
      >
        Skill
      </button>

      <button
        className={"filldb-nav__btn"}
        onClick={() => {
          handleTabChange(2);
        }}
      >
        Report
      </button>
    </div>
  );
}
