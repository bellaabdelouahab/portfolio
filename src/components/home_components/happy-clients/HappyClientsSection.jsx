import { useEffect, useState } from "react";
import "./wide-screen.css";
import axiosInstance from "utils/axios";
const backendUploadsApi = process.env.BACKEND_UPLOADS_API;

export default function HappyClientsSection() {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        axiosInstance.get("/clients")
            .then(res => {
                setClients(res.data)
            }
                )
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="happy-clients-section hidden-area">
            <div className="home-sections-title">
                <span>06. </span>
                What My Clients Say
            </div>
            <div className="happy-clients-content">
                {clients?.map((client,index) => (
                    <div className="happy-clients-card" key={index}>
                        <img className="client-pic" src={`${backendUploadsApi}${client.image}`} alt="client" />
                        <img className="quotes-pic" src="./icons/quotes.png" alt="quotes" />
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