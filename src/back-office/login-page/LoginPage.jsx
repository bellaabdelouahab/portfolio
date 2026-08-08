import "./LoginPage.css";
import { useState, useEffect } from "react";
import { 
  getAuth, 
  signInWithPopup, 
  GithubAuthProvider,
  signOut 
} from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default function LoginPage({ setAuthenticated }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  
  // The authorized email address
  const AUTHORIZED_EMAIL = "abdobella977@gmail.com";

  // Reset error when component mounts
  useEffect(() => {
    setError(null);
    setIsUnauthorized(false);
  }, []);

  // Clean up error message after display
  useEffect(() => {
    if (error && !isUnauthorized) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, isUnauthorized]);

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError(null);
    setIsUnauthorized(false);
    const auth = getAuth();
    const provider = new GithubAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      // The signed-in user info
      const user = result.user;
      // GitHub OAuth access token
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      
      console.log("User email:", user.email);
      console.log("Authorized email:", AUTHORIZED_EMAIL);
      
      // Check if the user's email matches the authorized email
      if (user.email !== AUTHORIZED_EMAIL) {
        console.log("Unauthorized access attempt");
        // Sign out immediately
        await signOut(auth);
        setIsUnauthorized(true);
        setError("You are not my owner! Get the hell out of here!");
        localStorage.removeItem("firebaseAuthUser");
        setAuthenticated(false);
        return;
      }
      
      // If email matches, store authentication data
      localStorage.setItem("firebaseAuthUser", JSON.stringify({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }));
      
      setAuthenticated(true);
    } catch (error) {
      // Handle Errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Login error:", error);
      setError(`Login failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-title">Admin Access</h1>
        <p className="login-subtitle">Sign in with your GitHub account to access the admin panel</p>
        
        <button 
          className="github-login-btn" 
          onClick={handleGitHubLogin}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faGithub} className="github-icon" />
          {isLoading ? 'Connecting...' : 'Sign in with GitHub'}
        </button>
        
        {error && (
          <div className={`login-error ${isUnauthorized ? 'unauthorized' : ''}`}>
            {isUnauthorized && <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />}
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
