import "assets/css/certification.css";
import { useLoaderData } from "react-router-dom";
import axiosInstance from "utils/axios";
const backendUploadsApi = process.env.BACKEND_UPLOADS_API;

export default function Certificates() {
    const {certificates,count} = useLoaderData();

    return (
        <>
            <div className="certifications-header">
                <div className="count">+{count} Badges & Certifications</div>
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
    const res = await axiosInstance.get("certificates");
    const certificates = res.data;
    const count = await axiosInstance.get("certificates/count");
    const data = { certificates, count: count.data };
    return data;
}