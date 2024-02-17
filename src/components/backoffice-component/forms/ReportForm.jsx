import axiosInstance from "utils/axios";

export default function ReportForm() {
  return (
    <form
      className="report-form filldb-form"
      onSubmit={(e) => {
        e.preventDefault();
        var data = {};
        data["title"] = e.target.title.value;
        data["description"] = e.target.description.value;
        const reportFileinput = e.target.reportFile;
        const reportFile = reportFileinput.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          data["reportFile"] = reader.result;
          console.log(data);
          axiosInstance
            .post("/reports", data)
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        });
        reader.readAsDataURL(reportFile);
      }}
    >
      <h1 className="project-form__title">Add Report</h1>
      <br />

      <div className="input-flow">
        <input
          type="text"
          name="title"
          className="form__input label_"
          placeholder=" "
        />
        <label className="form__label" htmlFor="title_report">
          Title of Report
        </label>
      </div>
      <br />

      <div className="input-flow">
        <input
          type="text"
          name="description"
          className="form__input label_"
          placeholder=" "
        />
        <label className="form__label" htmlFor="Description_report">
          Description
        </label>
      </div>
      <br />

      <input type="file" name="reportFile" placeholder="image" />
      <input type="submit" value="Submit" />
    </form>
  );
}
