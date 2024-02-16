import React, { useState } from "react";
import axios from "axios";
import "./Clients.css";

function AddClientForm() {
  const [clientName, setClientName] = useState("");
  const [clientDescription, setClientDescription] = useState("");
  const [clientProfession, setClientProfession] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientPicture, setClientPicture] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const clientData = {
        name: clientName,
        description: clientDescription,
        profession: clientProfession,
        company: clientCompany,
      };
      const file = e.target.image;
      const image = file.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        clientData.image = reader.result;
        const response = axios.post(
          "http://localhost:5000/api/clients",
          clientData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
          }
        );
        console.log("Client added successfully:", response.data);
      };

      if (image) {
        reader.readAsDataURL(image);
      }
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-client-form">
      <div className="client-profession">
        <input
          type="text"
          placeholder="Client Name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
        <textarea
          placeholder="Client Description"
          value={clientDescription}
          onChange={(e) => setClientDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Client Profession"
          value={clientProfession}
          onChange={(e) => setClientProfession(e.target.value)}
        />
        <input
          type="text"
          placeholder="Company"
          value={clientCompany}
          onChange={(e) => setClientCompany(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="client-picture-input"
          name="image"
        />
      </div>
      <button type="submit">Add Client</button>
    </form>
  );
}

export default AddClientForm;
