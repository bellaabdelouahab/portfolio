import { useState, useEffect } from "react";
import * as s from "../formStyles";

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
      <div className={s.toggleRow}>
        <div>
          <span className={s.toggleLabel}>GitHub token connected</span>
          <span className={s.toggleDesc}>
            Verified write access to your portfolio repo
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* currentColor + text-success rather than a hard-coded #4ade80, so
              the tick tracks the one accent the form uses. */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-success"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <button
            type="button"
            className="cursor-pointer text-xs text-success underline"
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
    <div className={s.toggleRow}>
      <div className="w-full">
        <span className={s.toggleLabel}>
          GitHub token required<span className={s.requiredMark}>*</span>
        </span>
        <span className={s.toggleDesc}>
          Add a token so images can be committed. It's verified before it's
          saved.
        </span>
        <div className="mt-1 flex gap-2">
          <input
            type="password"
            className={`${s.fieldInput} flex-1`}
            placeholder="ghp_..."
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
            disabled={status === "verifying"}
          />
          {/* Was the one blue button on the screen. Same primary as every other
              affirmative action now, and sized to match the input beside it. */}
          <button
            type="button"
            className={`${s.btnPrimary} px-4 py-2 text-xs`}
            disabled={!inputToken.trim() || status === "verifying"}
            onClick={() => verifyToken(inputToken.trim())}
          >
            {status === "verifying" ? "Verifying..." : "Verify & Save"}
          </button>
        </div>
        {status === "error" && (
          <span className={s.fieldErrorText}>{error}</span>
        )}
      </div>
    </div>
  );
}
