import axios from "axios";

export default function SkillForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        var data = {};
        data["title"] = e.target.title.value;
        data["description"] = e.target.description.value;
        const imageinput = e.target.roadmapImage;
        const image = imageinput.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          data["roadmapImage"] = reader.result;
          console.log(data);
          axios
            .post("http://localhost:5000/api/skills", data)
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        });
        reader.readAsDataURL(image);
      }}
      className="skill-form filldb-form"
    >
      <h1 className="project-form__title">Add Skill</h1>
      <br />

      <div className="input-flow">
        <input
          type="text"
          name="title"
          className="form__input label_"
          placeholder=" "
        />
        <label className="form__label" htmlFor="title_skill">
          Title
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
        <label className="form__label" htmlFor="Description_skill">
          Description
        </label>
      </div>
      <br />

      <input type="file" name="roadmapImage" placeholder="roadmapImage" />
      <br />
      <input type="submit" value="Submit" />
    </form>
  );
}
