import "./LoginPage.css"; // only supplies the @keyframes for .login-error-shake
import loginBackground from "assets/images/login-bg.jpg";
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
    /* The photo is an imported module rather than a CSS url(): the stylesheet is
       gone, and going through the bundler keeps the hashed filename correct. */
    <div
      className="flex h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <div className="flex w-full max-w-sm flex-col items-center rounded-md bg-black/80 p-5 shadow-lg">
        <h1 className="mb-2.5 text-xl leading-tight text-ink-strong">Admin Access</h1>
        <p className="mb-5 text-center leading-relaxed text-ink-muted">
          Sign in with your GitHub account to access the admin panel
        </p>

        <button
          className="flex w-full cursor-pointer items-center justify-center rounded-md bg-surface-raised px-4 py-2.5 text-sm text-ink-strong shadow-none transition duration-200 ease-standard hover:-translate-y-0.5 hover:bg-page hover:shadow-md active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-surface disabled:text-ink-muted disabled:shadow-none"
          onClick={handleGitHubLogin}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faGithub} className="mr-2.5 text-sm" />
          {isLoading ? 'Connecting...' : 'Sign in with GitHub'}
        </button>

        {error && (
          <div
            className={[
              "mt-2.5 w-full rounded-md p-2.5 text-center text-xs font-medium leading-normal text-ink-strong",
              isUnauthorized
                ? "login-error-shake bg-danger font-bold shadow-lg"
                : "bg-danger/80",
            ].join(" ")}
          >
            {isUnauthorized && <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2.5 text-xs" />}
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
