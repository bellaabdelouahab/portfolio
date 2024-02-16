import React from "react";
import axios from "axios";
export default function CertificatesForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        var data = {};
        data["title"] = e.target.title.value;
        data["issuer"] = e.target.issuer.value;
        data["link"] = e.target.link.value;
        data["downloadPath"] = e.target.downloadPath.value;
        const imageinput = e.target.roadmapImage;
        const image = imageinput.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          data["image"] = reader.result;
          console.log(data);
          axios
            .post("http://localhost:5000/api/certificates", data, {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
              },
            })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        });
        reader.readAsDataURL(image);
      }}
      className="certificates-form filldb-form"
    >
      <h1 className="project-form__title">Add Certificate</h1>
      <br />

      <div className="input-flow">
        <input
          type="text"
          name="title"
          className="form__input label_"
          placeholder=" "
        />
        <label className="form__label" htmlFor="title_certificates">
          Title
        </label>
      </div>
      <br />

      <div className="input-flow">
        <input
          type="text"
          name="issuer"
          className="form__input label_"
          placeholder=" "
        />
        <label className="form__label" htmlFor="issuer_certificates">
          Issuer
        </label>
      </div>
      <br />

      <div className="input-flow">
        <input
          type="text"
          name="link"
          className="form__input label_"
          placeholder=" "
        />
        <label className="form__label" htmlFor="link_certificates">
          Link
        </label>
      </div>
      <br />

      <div className="input-flow">
        <input
          type="text"
          name="downloadPath"
          className="form__input label_"
          placeholder=" "
        />
        <label className="form__label" htmlFor="downloadPath_certificates">
          Download Path
        </label>
      </div>
      <br />

      <input type="file" name="roadmapImage" placeholder="roadmapImage" />
      <br />

      <button className="form__button">Add Certificate</button>
    </form>
  );
}
