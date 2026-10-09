import loginBackground from "assets/images/login-bg.webp";
import { useState } from "react";
import { getAuth, signInWithPopup, GithubAuthProvider, signOut } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Button } from "../ui";

// The authorized email address
const AUTHORIZED_EMAIL = "abdobella977@gmail.com";

const FRIENDLY_ERRORS = {
  "auth/popup-closed-by-user": "The sign-in window was closed before it finished. Try again.",
  "auth/cancelled-popup-request": "The sign-in window was closed before it finished. Try again.",
  "auth/popup-blocked": "Your browser blocked the sign-in window. Allow pop-ups for this site and try again.",
  "auth/network-request-failed": "Network problem. Check your connection and try again.",
  "auth/account-exists-with-different-credential": "This email is already linked to another sign-in method.",
  "auth/too-many-requests": "Too many attempts. Wait a minute and try again.",
};

export default function LoginPage({ setAuthenticated }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError(null);
    const auth = getAuth();
    const provider = new GithubAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user's email matches the authorized email
      if (user.email !== AUTHORIZED_EMAIL) {
        await signOut(auth);
        setError("This GitHub account is not allowed to use the admin area.");
        localStorage.removeItem("firebaseAuthUser");
        setAuthenticated(false);
        return;
      }

      // If email matches, store authentication data
      localStorage.setItem(
        "firebaseAuthUser",
        JSON.stringify({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        })
      );

      setAuthenticated(true);
    } catch (err) {
      console.error("Login error:", err);
      setError(FRIENDLY_ERRORS[err.code] || "Sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* The photo is an imported module rather than a CSS url(): going through
       the bundler keeps the hashed filename correct. */
    <main
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <div className="w-full max-w-sm rounded-md border border-line bg-black/85 p-6 shadow-lg">
        <h1 className="text-xl font-semibold tracking-normal! text-ink-strong">Admin sign in</h1>
        <p className="mt-1 text-sm text-ink-muted">Use the GitHub account of the site owner.</p>

        <Button
          variant="primary"
          className="mt-5 w-full"
          loading={isLoading}
          onClick={handleGitHubLogin}
          aria-describedby="login-error"
        >
          {!isLoading && <FontAwesomeIcon icon={faGithub} aria-hidden="true" />}
          {isLoading ? "Connecting..." : "Sign in with GitHub"}
        </Button>

        {/* Always rendered with a reserved height so an error never shifts the card. */}
        <div id="login-error" role="alert" className="mt-3 min-h-10 text-xs text-danger">
          {error}
        </div>
      </div>
    </main>
  );
}
