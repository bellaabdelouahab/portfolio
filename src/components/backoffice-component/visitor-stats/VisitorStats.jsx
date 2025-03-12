import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { db } from "../../../firebase";
import "./VisitorStats.css";

export default function VisitorStats() {
  const [visitorStats, setVisitorStats] = useState({
    totalVisitors: 0,
    recentVisitors: [],
    topPages: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchVisitorStats = async () => {
      try {
        // Get unique visitors count
        const visitorsRef = collection(db, "visitors");
        const visitorsSnap = await getDocs(visitorsRef);
        
        // Get recent visitors
        const recentQuery = query(
          visitorsRef,
          orderBy("timestamp", "desc"),
          limit(10)
        );
        const recentSnap = await getDocs(recentQuery);
        const recentVisitors = recentSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.() || new Date()
        }));
        
        // Get top pages
        const pageViewsRef = collection(db, "pageViews");
        const pageViewsSnap = await getDocs(pageViewsRef);
        const pages = {};
        pageViewsSnap.docs.forEach(doc => {
          const path = doc.data().path;
          if (path) {
            pages[path] = (pages[path] || 0) + 1;
          }
        });
        
        const topPages = Object.entries(pages)
          .map(([path, count]) => ({ path, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        setVisitorStats({
          totalVisitors: visitorsSnap.size,
          recentVisitors,
          topPages,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error("Error fetching visitor stats:", error);
        setVisitorStats(prev => ({
          ...prev,
          loading: false,
          error: "Failed to load visitor statistics"
        }));
      }
    };
    
    fetchVisitorStats();
  }, []);
  
  if (visitorStats.loading) {
    return <div className="loading">Loading visitor statistics...</div>;
  }
  
  if (visitorStats.error) {
    return <div className="error">{visitorStats.error}</div>;
  }

  return (
    <div className="visitor-stats">
      <h2>Visitor Statistics</h2>
      
      <div className="stats-card">
        <h3>Total Unique Visitors</h3>
        <div className="stat-number">{visitorStats.totalVisitors}</div>
      </div>
      
      <div className="stats-section">
        <h3>Top Pages</h3>
        <ul className="top-pages">
          {visitorStats.topPages.map((page, index) => (
            <li key={index}>
              <span className="page-path">{page.path || "/"}</span>
              <span className="page-count">{page.count} views</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="stats-section">
        <h3>Recent Visitors</h3>
        <table className="visitors-table">
          <thead>
            <tr>
              <th>IP Address</th>
              <th>Browser</th>
              <th>OS</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {visitorStats.recentVisitors.map((visitor, index) => (
              <tr key={index}>
                <td>{visitor.ip}</td>
                <td>{visitor.browser}</td>
                <td>{visitor.operatingSystem}</td>
                <td>{visitor.timestamp.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
