import { db } from '../firebase';
import { addDoc, collection, serverTimestamp, query, where, getDocs, limit, doc, updateDoc } from 'firebase/firestore';

/**
 * Tracks visitor information and stores it in Firebase
 */
export const trackVisitor = async () => {
  try {
    // Get visitor IP address using ipify API
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const { ip } = await ipResponse.json();

    // Collect client information
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const referrer = document.referrer || 'direct';
    const path = window.location.pathname;
    const platform = navigator.platform;
    const browser = getBrowserInfo(userAgent);
    const operatingSystem = getOSInfo(userAgent);

    // Check if this IP has visited before in the last 24 hours
    const visitorRef = collection(db, 'visitors');
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const q = query(
      visitorRef, 
      where('ip', '==', ip),
      where('timestamp', '>', oneDayAgo),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // New visit in the last 24 hours, store complete data
      const visitorData = {
        ip,
        userAgent,
        language,
        screenResolution,
        timezone,
        referrer,
        path,
        platform,
        browser,
        operatingSystem,
        timestamp: serverTimestamp(),
        visitCount: 1
      };
      
      await addDoc(collection(db, 'visitors'), visitorData);
      console.log('New visitor tracked');
    } else {
      // Return visitor, update the timestamp and increment count
      const visitorDoc = querySnapshot.docs[0];
      const visitorRef = doc(db, 'visitors', visitorDoc.id);
      
      const currentCount = visitorDoc.data().visitCount || 1;
      
      await updateDoc(visitorRef, {
        timestamp: serverTimestamp(),
        visitCount: currentCount + 1,
        path: path, // Update the current path
        referrer: referrer // Update the referrer
      });
      
      console.log('Return visitor within 24 hours - visit updated');
    }
    
    // Store visit in a separate collection for analytics
    await addDoc(collection(db, 'pageViews'), {
      ip, 
      path,
      timestamp: serverTimestamp()
    });
    
  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
};

/**
 * Helper function to extract browser information
 */
const getBrowserInfo = (userAgent) => {
  const browsers = {
    chrome: /chrome/i,
    safari: /safari/i,
    firefox: /firefox/i,
    edge: /edge|edg/i,
    opera: /opera|opr/i,
    ie: /msie|trident/i
  };
  
  for (const [browser, regex] of Object.entries(browsers)) {
    if (regex.test(userAgent)) {
      return browser;
    }
  }
  
  return 'unknown';
};

/**
 * Helper function to extract OS information
 */
const getOSInfo = (userAgent) => {
  const os = {
    windows: /windows nt/i,
    mac: /macintosh|mac os x/i,
    linux: /linux/i,
    android: /android/i,
    ios: /iphone|ipad|ipod/i
  };
  
  for (const [osName, regex] of Object.entries(os)) {
    if (regex.test(userAgent)) {
      return osName;
    }
  }
  
  return 'unknown';
};

/**
 * React hook for visitor tracking
 */
export const useVisitorTracking = () => {
  useEffect(() => {
    // Track the visitor when component mounts
    trackVisitor();
  }, []);
};
