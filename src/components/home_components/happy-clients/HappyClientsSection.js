import { useEffect, useState } from "react";
import "./wide-screen.css";

export default function HappyClientsSection() {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/clients")
            .then(response => response.json())
            .then(data => setClients(data.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="happy-clients-section hidden-area">
            <div className="home-sections-title">
                <span>05. </span>
                What My Clients Say
                <hr />
            </div>
            <div className="happy-clients-content">
                {clients?.map(client => (
                    <div className="happy-clients-card" key={client.id}>
                        <img className="client-pic" src={`http://localhost:5000${client.image}`} alt="client" />
                        <img className="quotes-pic" src="./quotes.png" alt="quotes" />
                        <h3>{client.name}</h3>
                        <p>{client.description}</p>
                        <div className="client-profession">
                            <p>{client.profession}</p>
                            <p>{client.company}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}