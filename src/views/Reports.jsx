import '../assets/css/reports.css';
import { useLoaderData } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from 'react';

// Helper function to format dates
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (error) {
        return dateString;
    }
};

// Helper function to format timestamps
const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (error) {
        return "Invalid Date";
    }
};

// Helper function to check if report is new (less than 7 days old)
const isNewReport = (timestamp) => {
    if (!timestamp) return false;
    try {
        const reportDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const differenceInTime = now - reportDate;
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return differenceInDays <= 7;
    } catch (error) {
        return false;
    }
};

// Helper function to truncate long file names
const truncateFileName = (name) => {
    const nameWithoutExtension = name.replace(/\.[^/.]+$/, "");
    return nameWithoutExtension.length > 30 ? 
        nameWithoutExtension.substring(0, 30) + "..." : 
        nameWithoutExtension;
};

export default function Reports() {
    const reports = useLoaderData();
    const [loadingComplete, setLoadingComplete] = useState(false);
    
    // Placeholder image if cover image is missing
    const placeholderImage = "https://via.placeholder.com/175x250/121820/ffffff?text=No+Cover";

    // Sort reports by date (newest first)
    const sortedReports = [...reports].sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
    });

    // Add staggered animation effect
    useEffect(() => {
        // Set a small delay to ensure all resources are loaded
        setTimeout(() => {
            setLoadingComplete(true);
            
            const cards = document.querySelectorAll('.report-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = 1;
                    card.style.transform = 'translateY(0)';
                }, 100 * index);
            });
        }, 300);
    }, []);

    return (
        <section style={{ background: 'transparent', minHeight: '100vh', paddingBottom: '40px' }}>
            <div className="container1">
                <h2 className="heading-section">
                    <span style={{ color: '#48bb78' }}>Reports</span> & Documents
                </h2>
                
                {sortedReports && sortedReports.length > 0 ? (
                    <div className={`reports-grid ${loadingComplete ? 'fade-in' : ''}`}>
                        {sortedReports.map((report) => (
                            <div 
                                className="report-card" 
                                key={report._id}
                                style={{ 
                                    opacity: 0, 
                                    transform: 'translateY(20px)', 
                                    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                }}
                            >
                                {isNewReport(report.createdAt) && 
                                    <div className="report-badge">NEW</div>
                                }
                                <div className="card-cover-container">
                                    <img 
                                        src={report.coverImage || placeholderImage} 
                                        alt={report.name} 
                                        className="report-cover" 
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.src = placeholderImage;
                                        }}
                                    />
                                </div>
                                <div className="card-content">
                                    <h3 className="card-title">
                                        {truncateFileName(report.name)}
                                    </h3>
                                    <span className="report-date">
                                        {formatDate(report.date)}
                                        <span className="report-created">
                                            Created: {formatTimestamp(report.createdAt)}
                                        </span>
                                    </span>
                                    <p className="report-description">
                                        {report.description || "No description available"}
                                    </p>
                                </div>
                                <div className="card-footer">
                                    <a 
                                        className="btn-download" 
                                        href={report.pdfPath} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                    >
                                        Download
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-reports">
                        <p>No reports available at this time.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export async function getReports() {
  const colRef = collection(db, "reports");
  const snapshot = await getDocs(colRef);
  const data = snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
  return data;
}