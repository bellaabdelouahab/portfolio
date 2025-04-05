import { useState, useEffect, useMemo } from "react";
import { collection, query, orderBy, limit, getDocs, where, startAfter } from "firebase/firestore";
import { db } from "../../../firebase";
import "./VisitorStats.css";

export default function VisitorStats() {
  // State for visitor statistics
  const [visitorStats, setVisitorStats] = useState({
    totalVisitors: 0,
    totalPageViews: 0,
    recentVisitors: [],
    allVisitors: [],
    topPages: [],
    browsers: {},
    operatingSystems: {},
    referrers: {},
    screenResolutions: {},
    languages: {},
    timezones: {},
    repeatVisitors: 0,
    newVisitorsToday: 0,
    avgVisitDuration: 0,
    hourlyDistribution: {},
    dailyDistribution: {},
    loading: true,
    error: null
  });

  // Filters and pagination state
  const [filters, setFilters] = useState({
    timeRange: "all", // all, day, week, month
    browser: "all",
    os: "all",
    ipSearch: "", // New filter for IP search
  });
  
  // Pagination state
  const [pagination, setpagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    viewAll: false,
    totalPages: 1,
    lastVisible: null
  });
  
  // Calculate today's date at midnight
  const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  // Fetch visitor statistics
  useEffect(() => {
    const fetchVisitorStats = async () => {
      try {
        // Get visitors collection
        const visitorsRef = collection(db, "visitors");
        
        // Apply time filter
        let visitorQuery = visitorsRef;
        let timeFilterDate = null;
        
        if (filters.timeRange !== "all") {
          const date = new Date();
          if (filters.timeRange === "day") {
            date.setDate(date.getDate() - 1);
          } else if (filters.timeRange === "week") {
            date.setDate(date.getDate() - 7);
          } else if (filters.timeRange === "month") {
            date.setMonth(date.getMonth() - 1);
          }
          timeFilterDate = date;
          visitorQuery = query(visitorsRef, where("timestamp", ">=", date));
        }
        
        const visitorsSnap = await getDocs(visitorQuery);
        
        // Process visitor data
        const uniqueVisitors = new Set();
        const browsers = {};
        const operatingSystems = {};
        const referrers = {};
        const screenResolutions = {};
        const languages = {};
        const timezones = {};
        const hourlyDistribution = Array(24).fill(0);
        const dailyDistribution = Array(7).fill(0);
        
        let repeatVisitors = 0;
        let totalPageViews = 0;
        let newVisitorsToday = 0;
        let totalDuration = 0;
        let visitWithDuration = 0;
        
        // Get today's date
        const today = getToday();
        
        visitorsSnap.docs.forEach(doc => {
          const visitorData = doc.data();
          
          // Count unique visitors
          uniqueVisitors.add(visitorData.ip);
          
          // Check if new visitor today
          if (visitorData.timestamp) {
            const visitDate = typeof visitorData.timestamp === 'string' 
              ? new Date(visitorData.timestamp) 
              : visitorData.timestamp.toDate ? visitorData.timestamp.toDate() : new Date();
            
            const visitDateMidnight = new Date(visitDate);
            visitDateMidnight.setHours(0, 0, 0, 0);
            
            if (visitDateMidnight.getTime() === today.getTime()) {
              newVisitorsToday++;
            }
            
            // Hourly distribution
            const hour = visitDate.getHours();
            hourlyDistribution[hour]++;
            
            // Daily distribution
            const day = visitDate.getDay();
            dailyDistribution[day]++;
          }
          
          // Count browsers
          const browser = visitorData.browser || "unknown";
          browsers[browser] = (browsers[browser] || 0) + 1;
          
          // Count operating systems
          const os = visitorData.operatingSystem || "unknown";
          operatingSystems[os] = (operatingSystems[os] || 0) + 1;
          
          // Count referrers
          let referrer = "direct";
          try {
            if (visitorData.referrer) {
              referrer = new URL(visitorData.referrer).hostname;
            }
          } catch (error) {
            referrer = "invalid";
          }
          referrers[referrer] = (referrers[referrer] || 0) + 1;
          
          // Count screen resolutions
          const resolution = visitorData.screenResolution || "unknown";
          screenResolutions[resolution] = (screenResolutions[resolution] || 0) + 1;
          
          // Count languages
          const language = visitorData.language || "unknown";
          languages[language] = (languages[language] || 0) + 1;
          
          // Count timezones
          const timezone = visitorData.timezone || "unknown";
          timezones[timezone] = (timezones[timezone] || 0) + 1;
          
          // Count repeat visitors
          if (visitorData.visitCount && visitorData.visitCount > 1) {
            repeatVisitors++;
          }
          
          // Count total page views
          totalPageViews += visitorData.visitCount || 1;
          
          // Calculate average visit duration
          if (visitorData.visitDuration) {
            totalDuration += visitorData.visitDuration;
            visitWithDuration++;
          }
        });
        
        // Calculate average visit duration
        const avgVisitDuration = visitWithDuration > 0 
          ? Math.round(totalDuration / visitWithDuration) 
          : 0;
        
        // Get all visitors for pagination
        let allVisitorsQuery = query(visitorsRef, orderBy("timestamp", "desc"));
        
        // Apply browser filter
        if (filters.browser !== "all") {
          allVisitorsQuery = query(allVisitorsQuery, where("browser", "==", filters.browser));
        }
        
        // Apply OS filter
        if (filters.os !== "all") {
          allVisitorsQuery = query(allVisitorsQuery, where("operatingSystem", "==", filters.os));
        }
        
        // Apply time filter to all visitors
        if (timeFilterDate) {
          allVisitorsQuery = query(allVisitorsQuery, where("timestamp", ">=", timeFilterDate));
        }
        
        const allVisitorsSnap = await getDocs(allVisitorsQuery);
        
        let allVisitors = allVisitorsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: formatTimestamp(doc.data().timestamp)
        }));
        
        // Filter by IP if search is applied
        if (filters.ipSearch) {
          allVisitors = allVisitors.filter(visitor => 
            visitor.ip && visitor.ip.includes(filters.ipSearch)
          );
        }
        
        // Calculate total pages
        const totalPages = Math.ceil(allVisitors.length / pagination.itemsPerPage);
        
        // Get recent visitors based on pagination
        const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
        const endIndex = pagination.viewAll ? allVisitors.length : startIndex + pagination.itemsPerPage;
        const recentVisitors = allVisitors.slice(startIndex, endIndex);
        
        // Get top pages
        const pageViewsRef = collection(db, "pageViews");
        let pageViewsQuery = pageViewsRef;
        
        if (timeFilterDate) {
          pageViewsQuery = query(pageViewsQuery, where("timestamp", ">=", timeFilterDate));
        }
        
        const pageViewsSnap = await getDocs(pageViewsQuery);
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
          totalVisitors: uniqueVisitors.size,
          totalPageViews,
          recentVisitors,
          allVisitors,
          topPages,
          browsers,
          operatingSystems,
          referrers,
          screenResolutions,
          languages,
          timezones,
          repeatVisitors,
          newVisitorsToday,
          avgVisitDuration,
          hourlyDistribution,
          dailyDistribution,
          loading: false,
          error: null
        });
        
        setpagination(prev => ({
          ...prev,
          totalPages
        }));
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
  }, [filters, pagination.currentPage, pagination.itemsPerPage, pagination.viewAll]);
  
  // Helper function to format timestamps
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    
    try {
      const date = typeof timestamp === 'string' 
        ? new Date(timestamp) 
        : timestamp.toDate ? timestamp.toDate() : new Date();
      
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Invalid date";
    }
  };
  
  // Helper function to format duration
  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  // Get top browsers
  const topBrowsers = useMemo(() => {
    return Object.entries(visitorStats.browsers)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [visitorStats.browsers]);
  
  // Get top operating systems
  const topOS = useMemo(() => {
    return Object.entries(visitorStats.operatingSystems)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [visitorStats.operatingSystems]);
  
  // Get top referrers
  const topReferrers = useMemo(() => {
    return Object.entries(visitorStats.referrers)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [visitorStats.referrers]);
  
  // Get top screen resolutions
  const topScreenResolutions = useMemo(() => {
    return Object.entries(visitorStats.screenResolutions)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [visitorStats.screenResolutions]);
  
  // Get available browsers and OS for filters
  const availableBrowsers = useMemo(() => {
    return Object.keys(visitorStats.browsers);
  }, [visitorStats.browsers]);
  
  const availableOS = useMemo(() => {
    return Object.keys(visitorStats.operatingSystems);
  }, [visitorStats.operatingSystems]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset pagination when filters change
    setpagination(prev => ({
      ...prev,
      currentPage: 1,
      viewAll: false
    }));
  };
  
  // Handle IP search
  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      ipSearch: e.target.value
    }));
    
    // Reset pagination when search changes
    setpagination(prev => ({
      ...prev,
      currentPage: 1,
      viewAll: false
    }));
  };
  
  // Handle pagination
  const handlePageChange = (page) => {
    setpagination(prev => ({
      ...prev,
      currentPage: page,
      viewAll: false
    }));
  };
  
  // Toggle view all
  const toggleViewAll = () => {
    setpagination(prev => ({
      ...prev,
      viewAll: !prev.viewAll
    }));
  };
  
  // Calculate heat map colors
  const getHeatMapColor = (value, max) => {
    if (max === 0) return 'rgba(72, 187, 120, 0)'; // Fully transparent for no data
    const intensity = value / max;

    return `rgba(72, 187, 120, ${intensity})`; // Softer green with varying transparency
  };
  
  // Calculate max values for heat maps
  const maxHourlyValue = Array.isArray(visitorStats.hourlyDistribution) 
    ? Math.max(...visitorStats.hourlyDistribution) 
    : 0;
  const maxDailyValue = Array.isArray(visitorStats.dailyDistribution) 
    ? Math.max(...visitorStats.dailyDistribution) 
    : 0;
  
  if (visitorStats.loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <div>Loading visitor statistics...</div>
      </div>
    );
  }
  
  if (visitorStats.error) {
    return <div className="error">{visitorStats.error}</div>;
  }

  return (
    <div className="visitor-stats">
      <h2><span>Visitor</span> Statistics</h2>
      <div className="filters">
        <div>
          <span className="filter-label">Time Range:</span>
          <select 
            name="timeRange" 
            value={filters.timeRange} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Time</option>
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
        
        <div>
          <span className="filter-label">Browser:</span>
          <select 
            name="browser" 
            value={filters.browser} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Browsers</option>
            {availableBrowsers.map(browser => (
              <option key={browser} value={browser}>
                {browser.charAt(0).toUpperCase() + browser.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <span className="filter-label">Operating System:</span>
          <select 
            name="os" 
            value={filters.os} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All OS</option>
            {availableOS.map(os => (
              <option key={os} value={os}>
                {os.charAt(0).toUpperCase() + os.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <span className="filter-label">Search IP:</span>
          <input 
            type="text"
            placeholder="Search by IP address"
            value={filters.ipSearch}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stats-card">
          <h3>Total Unique Visitors</h3>
          <div className="stat-number">{visitorStats.totalVisitors}</div>
          <div className="stat-detail">Unique IP addresses</div>
        </div>
        
        <div className="stats-card">
          <h3>Total Page Views</h3>
          <div className="stat-number">{visitorStats.totalPageViews}</div>
          <div className="stat-detail">All visits combined</div>
        </div>
        
        <div className="stats-card">
          <h3>Repeat Visitors</h3>
          <div className="stat-number">
            {visitorStats.repeatVisitors}
            <span className="stat-detail" style={{display: 'inline-block', marginLeft: '10px'}}>
              ({Math.round((visitorStats.repeatVisitors / visitorStats.totalVisitors) * 100 || 0)}%)
            </span>
          </div>
          <div className="stat-detail">Visited more than once</div>
        </div>
        
        <div className="stats-card">
          <h3>New Today</h3>
          <div className="stat-number">{visitorStats.newVisitorsToday}</div>
          <div className="stat-detail">Visitors in last 24h</div>
        </div>
      </div>
      
      {/* Additional Statistics */}
      <div className="stats-section">
        <h3>Visit Details</h3>
        <div className="mini-stats-grid">
          <div className="mini-stat">
            <div className="mini-stat-title">Avg. Visit Duration</div>
            <div className="mini-stat-value">{formatDuration(visitorStats.avgVisitDuration)}</div>
          </div>
          <div className="mini-stat">
            <div className="mini-stat-title">Pages per Visit</div>
            <div className="mini-stat-value">
              {(visitorStats.totalPageViews / visitorStats.totalVisitors || 0).toFixed(1)}
            </div>
          </div>
          <div className="mini-stat">
            <div className="mini-stat-title">Bounce Rate</div>
            <div className="mini-stat-value">
              {Math.round((1 - visitorStats.repeatVisitors / visitorStats.totalVisitors) * 100 || 0)}%
            </div>
          </div>
          <div className="mini-stat">
            <div className="mini-stat-title">Unique Languages</div>
            <div className="mini-stat-value">{Object.keys(visitorStats.languages).length}</div>
          </div>
          <div className="mini-stat">
            <div className="mini-stat-title">Unique Timezones</div>
            <div className="mini-stat-value">{Object.keys(visitorStats.timezones).length}</div>
          </div>
        </div>
      </div>
      
      {/* Distribution by Time */}
      <div className="stats-section">
        <h3>Visit Distribution by Time</h3>
        
        <h4 style={{marginTop: '20px', color: 'rgba(255, 255, 255, 0.8)'}}>Hourly Distribution</h4>
        <div style={{display: 'flex', marginTop: '10px'}}>
          <div style={{width: '30px'}}>
            {[0, 6, 12, 18].map(hour => (
              <div key={hour} className="heatmap-label" style={{height: '30px'}}>
                {hour}h
              </div>
            ))}
          </div>
          <div style={{flex: 1}}>
            <div className="heatmap-row">
              {Array(24).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="heatmap-cell"
                  style={{background: getHeatMapColor(visitorStats.hourlyDistribution[i], maxHourlyValue), border: '1px solid rgba(255, 255, 255, 0.1)'}}
                  title={`${i}:00 - ${i+1}:00: ${visitorStats.hourlyDistribution[i]} visits`}
                >
                  {visitorStats.hourlyDistribution[i] > 0 && visitorStats.hourlyDistribution[i]}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <h4 style={{marginTop: '30px', color: 'rgba(255, 255, 255, 0.8)'}}>Daily Distribution</h4>
        <div style={{display: 'flex', marginTop: '10px'}}>
          <div style={{width: '30px'}}></div>
          <div style={{flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px'}}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="heatmap-day">{day}</div>
            ))}
          </div>
        </div>
        <div style={{display: 'flex', marginTop: '5px'}}>
          <div style={{width: '30px'}}></div>
          <div style={{flex: 1}}>
            <div className="heatmap-row">
              {visitorStats.dailyDistribution.map((count, i) => (
                <div
                  key={i}
                  className="heatmap-cell"
                  style={{background: getHeatMapColor(count, maxDailyValue)}}
                  title={`${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i]}: ${count} visits`}
                >
                  {count > 0 && count}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="heatmap-legend">
          <div className="legend-item">
            <div className="legend-color" style={{background: 'rgba(72, 187, 120, 0.1)'}}></div>
            <span>Low</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{background: 'rgba(72, 187, 120, 0.3)'}}></div>
            <span></span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{background: 'rgba(72, 187, 120, 0.5)'}}></div>
            <span></span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{background: 'rgba(72, 187, 120, 0.7)'}}></div>
            <span></span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{background: 'rgba(72, 187, 120, 1)'}}></div>
            <span>High</span>
          </div>
        </div>
      </div>
      
      <div className="distribution-row">
        {/* Top Pages Section */}
        <div className="stats-section">
          <h3>Top Pages</h3>
          <ul className="top-pages">
            {visitorStats.topPages.map((page, index) => (
              <li key={index}>
                <span className="page-path">{page.path || "/"}</span>
                <span className="page-count">{page.count} views</span>
              </li>
            ))}
            {visitorStats.topPages.length === 0 && (
              <li><span>No page view data available</span></li>
            )}
          </ul>
        </div>
        
        {/* Top Referrers */}
        <div className="stats-section">
          <h3>Traffic Sources</h3>
          <ul className="top-pages">
            {topReferrers.map((referrer, index) => (
              <li key={index} className="referrer-item">
                <span className="referrer-domain">
                  {referrer.name === 'direct' ? 'Direct / Bookmarked' : referrer.name}
                </span>
                <span className="page-count">{referrer.count}</span>
              </li>
            ))}
            {topReferrers.length === 0 && (
              <li><span>No referrer data available</span></li>
            )}
          </ul>
        </div>
      </div>
      
      <div className="distribution-row">
        {/* Browser Distribution */}
        <div className="stats-section">
          <h3>Browser Distribution</h3>
          <ul className="top-pages">
            {topBrowsers.map((browser, index) => (
              <li key={index}>
                <span>
                  <img 
                    src={`/images/browsers/${browser.name.toLowerCase()}.svg`} 
                    alt={browser.name} 
                    className="browser-icon"
                    onError={(e) => {e.target.style.display = 'none'}}
                  />
                  {browser.name.charAt(0).toUpperCase() + browser.name.slice(1)}
                </span>
                <span className="page-count">{browser.count}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* OS Distribution */}
        <div className="stats-section">
          <h3>Operating System</h3>
          <ul className="top-pages">
            {topOS.map((os, index) => (
              <li key={index}>
                <span>
                  <img 
                    src={`/images/os/${os.name.toLowerCase()}.svg`} 
                    alt={os.name} 
                    className="os-icon"
                    onError={(e) => {e.target.style.display = 'none'}}
                  />
                  {os.name.charAt(0).toUpperCase() + os.name.slice(1)}
                </span>
                <span className="page-count">{os.count}</span>
              </li>
            ))}
          </ul>
        </div>
      
      <div className="distribution-row">
        {/* Screen Resolution */}
        <div className="stats-section">
          <h3>Screen Resolutions</h3>
          <ul className="top-pages">
            {topScreenResolutions.map((resolution, index) => (
              <li key={index}>
                <span className="referrer-domain">
                  {resolution.name}
                </span>
                <span className="page-count">{resolution.count}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Languages */}
        <div className="stats-section"></div>
          <h3>Languages</h3>
          <ul className="top-pages">
            {Object.entries(visitorStats.languages)
              .map(([lang, count]) => ({ lang, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
              .map((item, index) => (
                <li key={index}>
                  <span className="referrer-domain">
                    {item.lang === 'unknown' ? 'Unknown' : item.lang}
                  </span>
                  <span className="page-count">{item.count}</span>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
      <div className="stats-section">
        <h3>Visitor Log</h3>
        <div className="visitors-table-container">
          <table className="visitors-table">
            <thead>
              <tr>
                <th>IP Address</th>
                <th>Page</th>
                <th>Browser / OS</th>
                <th>Screen</th>
                <th>Language</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {visitorStats.recentVisitors.map((visitor, index) => (
                <tr key={index}>
                  <td>
                    {visitor.ip || "Unknown"}
                    {visitor.visitCount > 1 && (
                      <span className="badge badge-repeat">
                        {visitor.visitCount}x
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="page-path">{visitor.path || "/"}</span>
                  </td>
                  <td>
                    <img 
                      src={`/images/browsers/${visitor.browser?.toLowerCase()}.svg`} 
                      alt={visitor.browser} 
                      className="browser-icon"
                      onError={(e) => {e.target.style.display = 'none'}}
                    />
                    {visitor.browser || "Unknown"} / 
                    <img 
                      src={`/images/os/${visitor.operatingSystem?.toLowerCase()}.svg`} 
                      alt={visitor.operatingSystem} 
                      className="os-icon"
                      onError={(e) => {e.target.style.display = 'none'}}
                    />
                    {visitor.operatingSystem || "Unknown"}
                  </td>
                  <td>
                    {visitor.screenResolution || "Unknown"}
                  </td>
                  <td>
                    {visitor.language || "Unknown"}
                  </td>
                  <td>
                    {visitor.timestamp}
                  </td>
                </tr>
              ))}
              {visitorStats.recentVisitors.length === 0 && (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center'}}>
                    No visitor data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button 
            className={`view-all-btn ${pagination.viewAll ? 'active' : ''}`}
            onClick={toggleViewAll}
          >
            {pagination.viewAll ? 'Show Less' : 'View All'}
          </button>
          
          {!pagination.viewAll && (
            <div className="pagination-buttons">
              <button 
                className="page-btn" 
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(1)}
              >
                &laquo;
              </button>
              <button 
                className="page-btn" 
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                &lsaquo;
              </button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNumber = pagination.currentPage <= 3
                  ? i + 1
                  : pagination.currentPage >= pagination.totalPages - 2
                    ? pagination.totalPages - 4 + i
                    : pagination.currentPage - 2 + i;
                
                if (pageNumber <= pagination.totalPages && pageNumber > 0) {
                  return (
                    <button
                      key={pageNumber}
                      className={`page-btn ${pagination.currentPage === pageNumber ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}
              
              <button 
                className="page-btn" 
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                &rsaquo;
              </button>
              <button 
                className="page-btn" 
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => handlePageChange(pagination.totalPages)}
              >
                &raquo;
              </button>
            </div>
          )}
          
          <div className="page-info">
            Showing {pagination.viewAll ? 'all' : `${Math.min((pagination.currentPage - 1) * pagination.itemsPerPage + 1, visitorStats.allVisitors.length)} - ${Math.min(pagination.currentPage * pagination.itemsPerPage, visitorStats.allVisitors.length)}`} of {visitorStats.allVisitors.length} visitors
          </div>
        </div>
      </div>
      </div>
  );
}
