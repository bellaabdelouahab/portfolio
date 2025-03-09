import { useEffect, useState } from "react";
import "./wide-screen.css";
import Modal from "../../common/Modal";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

export default function HappyClientsSection() {
    const [clients, setClients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "clients"));
                const clientsData = querySnapshot.docs.map(doc => doc.data());
                setClients(clientsData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchClients();
    }, []);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
      <div className="happy-clients-section hidden-area">
        <div className="home-sections-title">
          <span>06. </span>
          What My Clients Say
        </div>
        <div className="happy-clients-content">
          {clients?.map((client, index) => (
            <div className="happy-clients-card" key={index}>
              <img
                className="client-pic"
                src={`${client.image}`}
                alt="client"
              />
              <img
                className="quotes-pic"
                src="./icons/quotes.png"
                alt="quotes"
              />
              <h3>{client.name}</h3>
              <p>{client.description}</p>
              <div className="client-profession">
                <p>{client.profession}</p>
                <p>{client.company}</p>
              </div>
            </div>
          ))}
          <div className="add-testimonial-container">
            <button className="add-testimonial-btn" onClick={toggleModal}>
              Share Your Experience
            </button>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={toggleModal}
          title="Share Your Experience"
        >
          {/* Replace this URL with your actual Google Form URL */}
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSff6tzcnt1lN26FklbTZtNm2DvUFy5iAS9Pggxz0U8dN83VsA/viewform?embedded=true"
            title="Client Testimonial Form"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
          >
            Loading form...
          </iframe>
        </Modal>
      </div>
    );
}