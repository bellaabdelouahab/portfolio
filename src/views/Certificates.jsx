import "assets/css/certification.css";
import { useEffect,useState } from "react";
import { useLoaderData } from "react-router-dom";
import axiosInstance from "utils/axios";
const backendUploadsApi = process.env.BACKEND_UPLOADS_API;

export default function Certificates() {
    const {certificatesInit,count} = useLoaderData();
    const [certificates, setCertificates] = useState(certificatesInit);
    const [page, setPage] = useState(1);

    // a handler for the show more button
    useEffect(() => {
      const handleShowMore = () => {
        setPage(page + 1);
        // fetch more certificates
        axiosInstance
          .get(`certificates?limit=9&page=${page + 1}`)
          .then((res) => {
            const newCertificates = res.data;
            console.log(newCertificates);
            setCertificates([...certificates, ...newCertificates]);
          })
          .catch((err) => console.log(err));
      };
      const showMoreButton = document.querySelector(
        ".certifications-show-more button"
      );
      showMoreButton.addEventListener("click", handleShowMore);
      return () => {
        showMoreButton.removeEventListener("click", handleShowMore);
      };
    }, [page, setCertificates, certificates, setPage]);


    return (
      <>
        <div className="certifications-header">
          <div className="count">Over {count} Badges & Certifications</div>
        </div>
        <div className="certifications-content">
          {certificates.map((certificate, index) => (
            <div className="certification-element" key={index}>
              <img
                src={`${backendUploadsApi}${certificate.image}`}
                alt="NoImage"
                width="100"
                height="100"
              />
              <div className="certification-title">{certificate.title}</div>
            </div>
          ))}
        </div>
        {/* div for show more */}
        <div className="certifications-show-more">
            <div className="line"></div>
          <button 
          >Show More</button>
            <div className="line"></div>
        </div>
      </>
    );
}

export async function getCertificates() {
    const res = await axiosInstance.get("certificates?limit=9");
    const certificates = res.data;
    const count = await axiosInstance.get("certificates/count");
    const data = { certificatesInit: certificates, count: count.data };
    return data;
}