import "assets/css/certification.css";
import { useLoaderData } from "react-router-dom";
import axiosInstance from "utils/axios";
const backendUploadsApi = process.env.REACT_APP_BACKEND_UPLOADS_API;

export default function Certificates() {
    const certificates = useLoaderData();

    return (
        <>
            <div className="certifications-header">
                <div className="count">+{certificates.length} Badges & Certifications</div>
                <label>
                    Sorted By :<span className="filter"> Date Earned ▼</span>{" "}
                </label>
            </div>
            <div className="certifications-content">
                {certificates.map((certificate, index) => (
                    <div className="certification-element" key={index}>
                        <img src={`${backendUploadsApi}${certificate.image}`} alt="NoImage" width="100" height="100" />
                        <div className="certification-title">{certificate.title}</div>
                    </div>
                ))}
            </div>
        </>
    );
}

export async function getCertificates() {
    const res = await axiosInstance.get("certificates?sort=createdAt");
    const data = res.data;
    return data;
}