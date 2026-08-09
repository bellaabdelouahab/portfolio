import { useState, useEffect } from "react";
import "./GithubTokenInput.css";

const TEST_FILE_PATH = ".github-token-test";

export default function GithubTokenInput({ githubDetails, onVerified }) {
  const [status, setStatus] = useState("checking"); // checking | missing | verifying | verified | error
  const [inputToken, setInputToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("githubToken");
    if (stored) {
      setStatus("verified");    
    } else {
      setStatus("missing");
    }
  }, []);

  const verifyToken = async (token) => {
    setStatus("verifying");
    setError("");
    try {
      // Empty test commit — proves the token can actually WRITE, not just auth.
      const putResponse = await fetch(
        `https://api.github.com/repos/${githubDetails.owner}/${githubDetails.repo}/contents/${TEST_FILE_PATH}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Verify GitHub token (auto-test)",
            content: btoa("token verification"),
            branch: githubDetails.branch,
          }),
        },
      );
      const putData = await putResponse.json();
      if (putResponse.status !== 200 && putResponse.status !== 201) {
        throw new Error(putData.message || "Token could not write to repo");
      }

      // Immediately clean up the test file
      await fetch(
        `https://api.github.com/repos/${githubDetails.owner}/${githubDetails.repo}/contents/${TEST_FILE_PATH}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Remove token verification test file",
            sha: putData.content.sha,
            branch: githubDetails.branch,
          }),
        },
      );

      localStorage.setItem("githubToken", token);
      setStatus("verified");
      onVerified?.(token);
    } catch (err) {
      console.error("GitHub token verification failed:", err);
      setError(err.message || "Verification failed");
      setStatus("error");
    }
  };

  const handleRemove = () => {
    localStorage.removeItem("githubToken");
    setInputToken("");
    setStatus("missing");
  };

  if (status === "checking") return null;

  if (status === "verified") {
    return (
      <div className="toggle-row">
        <div className="toggle-row__text">
          <span className="toggle-row__label">GitHub token connected</span>
          <span className="toggle-row__desc">
            Verified write access to your portfolio repo
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.46875rem" }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4ade80"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <button
            type="button"
            className="github-token-change"
            onClick={handleRemove}
          >
            Change
          </button>
        </div>
      </div>
    );
  }

  // missing / verifying / error
  return (
    <div className="toggle-row github-token-row">
      <div className="toggle-row__text" style={{ width: "100%" }}>
        <span className="toggle-row__label">
          GitHub token required<span className="form__required">*</span>
        </span>
        <span className="toggle-row__desc">
          Add a token so images can be committed. It's verified before it's
          saved.
        </span>
        <div className="github-token-input-row">
          <input
            type="password"
            className="form__input"
            placeholder="ghp_..."
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            disabled={status === "verifying"}
          />
          <button
            type="button"
            className="submit-btn"
            disabled={!inputToken.trim() || status === "verifying"}
            onClick={() => verifyToken(inputToken.trim())}
          >
            {status === "verifying" ? "Verifying..." : "Verify & Save"}
          </button>
        </div>
        {status === "error" && <span className="form__error">{error}</span>}
      </div>
    </div>
  );
}
