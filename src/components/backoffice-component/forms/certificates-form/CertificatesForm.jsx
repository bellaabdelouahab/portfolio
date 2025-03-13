import { useState, useRef } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebase";
import { v4 as uuidv4 } from "uuid";
import "./CertificatesForm.css";

export default function CertificatesForm() {
  const [formData, setFormData] = useState({
    certificateTitle: "",
    issuer: "",
    link: "",
    downloadPath: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  
  // GitHub commit related states
  const [commitStatus, setCommitStatus] = useState('');
  const [isCommitting, setIsCommitting] = useState(false);

  // GitHub repo details - hardcoded for this implementation
  const githubDetails = {
    owner: "bellaabdelouahab",
    repo: "portfolio",
    branch: "master", // Note: using master branch as per the repo URL
    baseImagePath: "public/images/certificates/",
    token: localStorage.getItem("githubToken") || "" // Get token from localStorage if available
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is modified
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any error
      if (errors.image) {
        setErrors({
          ...errors,
          image: "",
        });
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.certificateTitle.trim()) newErrors.certificateTitle = "Title is required";
    if (!formData.issuer.trim()) newErrors.issuer = "Issuer is required";
    if (!formData.link.trim()) newErrors.link = "Link is required";
    if (!formData.downloadPath.trim()) newErrors.downloadPath = "Download path is required";
    if (!imageFile) newErrors.image = "Certificate image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Function to convert file to base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Extract the base64 data (remove the data:image/xxx;base64, prefix)
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to commit a file to GitHub
  const commitFileToGithub = async (file, filePath, commitMessage) => {
    if (!file || !githubDetails.token) {
      throw new Error("Missing file or GitHub token");
    }

    try {
      // Convert file to base64
      const base64Content = await getBase64(file);
      
      // Check if file already exists to get its SHA (needed for updates)
      let fileSha = null;
      try {
        const checkResponse = await fetch(
          `https://api.github.com/repos/${githubDetails.owner}/${githubDetails.repo}/contents/${filePath}?ref=${githubDetails.branch}`,
          {
            headers: {
              Authorization: `token ${githubDetails.token}`,
              Accept: 'application/vnd.github.v3+json'
            }
          }
        );
        
        if (checkResponse.status === 200) {
          const fileData = await checkResponse.json();
          fileSha = fileData.sha;
        }
      } catch (error) {
        // File doesn't exist, which is fine for creating new files
        console.log(`File does not exist yet: ${filePath}`);
      }

      // Prepare commit payload
      const commitData = {
        message: commitMessage,
        content: base64Content,
        branch: githubDetails.branch
      };

      // If we're updating an existing file, include the SHA
      if (fileSha) {
        commitData.sha = fileSha;
      }

      // Make the commit
      const response = await fetch(
        `https://api.github.com/repos/${githubDetails.owner}/${githubDetails.repo}/contents/${filePath}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `token ${githubDetails.token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(commitData)
        }
      );

      const responseData = await response.json();

      if (response.status === 200 || response.status === 201) {
        return responseData;
      } else {
        throw new Error(`GitHub API Error: ${responseData.message}`);
      }
    } catch (error) {
      console.error('Error committing to GitHub:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      setLoading(true);
      
      // Check if GitHub token exists
      if (!githubDetails.token) {
        const token = prompt("Please enter your GitHub token to commit images:");
        if (!token) {
          setMessage({
            type: "error",
            text: "GitHub token is required to commit images.",
          });
          setLoading(false);
          return;
        }
        
        // Save token to localStorage for future use
        localStorage.setItem("githubToken", token);
        githubDetails.token = token;
      }
      
      // Generate a unique ID for the certificate
      const certificateId = uuidv4().replace(/-/g, "").substring(0, 24);
      
      // Set up file paths according to the repository structure
      const timestamp = Date.now();
      const imageExtension = imageFile.name.split('.').pop();
      const imageName = `${certificateId}.${imageExtension}`;
      const imagePath = `${githubDetails.baseImagePath}${imageName}`;
      
      // Start committing to GitHub
      setIsCommitting(true);
      setCommitStatus("Committing certificate image to GitHub...");
      
      try {
        await commitFileToGithub(
          imageFile,
          imagePath,
          `Add certificate image: ${formData.certificateTitle}`
        );
        
        setCommitStatus("Image successfully committed to GitHub!");
      } catch (error) {
        setCommitStatus(`Error committing image: ${error.message}`);
        throw error;
      }
      
      // Create certificate document in Firestore
      const certificateData = {
        _id: certificateId,
        certificateTitle: formData.certificateTitle,
        issuer: formData.issuer,
        link: formData.link,
        downloadPath: formData.downloadPath,
        image: `/images/certificates/${imageName}`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        __v: 0,
      };
      
      await addDoc(collection(db, "certificates"), certificateData);
      
      // Reset form
      setFormData({
        certificateTitle: "",
        issuer: "",
        link: "",
        downloadPath: "",
      });
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      setMessage({
        type: "success",
        text: "Certificate added successfully!",
      });
      
      // Clear commit status after a delay
      setTimeout(() => {
        setCommitStatus("");
        setIsCommitting(false);
      }, 3000);
      
      // Clear success message after delay
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      
    } catch (error) {
      console.error("Error adding certificate:", error);
      setMessage({
        type: "error",
        text: `Error adding certificate: ${error.message}`,
      });
      setIsCommitting(false);
    } finally {
      setLoading(false);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="certificates-form-container">
      <div className="certificate-form-header">
        <h1 className="certificate-form-title">Add New Certificate</h1>
        <p className="certificate-form-subtitle">
          Add your professional certificates and achievements to showcase your
          expertise
        </p>
      </div>

      {message.text && (
        <div className={`certificate-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="certificate-form">
        <div className="certificate-form-grid">
          <div className="certificate-form-fields">
            <div className="certificate-form-group">
              <label htmlFor="title">Certificate Title*</label>
              <input
                type="text"
                id="title"
                name="certificateTitle"
                value={formData.certificateTitle}
                onChange={handleChange}
                className={errors.certificateTitle ? "error" : ""}
                placeholder="e.g., AWS Certified Solutions Architect"
              />
              {errors.certificateTitle && (
                <div className="error-text">{errors.certificateTitle}</div>
              )}
            </div>

            <div className="certificate-form-group">
              <label htmlFor="issuer">Issuing Organization*</label>
              <input
                type="text"
                id="issuer"
                name="issuer"
                value={formData.issuer}
                onChange={handleChange}
                className={errors.issuer ? "error" : ""}
                placeholder="e.g., Amazon Web Services"
              />
              {errors.issuer && (
                <div className="error-text">{errors.issuer}</div>
              )}
            </div>

            <div className="certificate-form-group">
              <label htmlFor="link">Certificate Link*</label>
              <input
                type="text"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className={errors.link ? "error" : ""}
                placeholder="https://verify.example.com/cert/123"
              />
              {errors.link && <div className="error-text">{errors.link}</div>}
            </div>

            <div className="certificate-form-group">
              <label htmlFor="downloadPath">Download Link*</label>
              <input
                type="text"
                id="downloadPath"
                name="downloadPath"
                value={formData.downloadPath}
                onChange={handleChange}
                className={errors.downloadPath ? "error" : ""}
                placeholder="https://example.com/download/certificate.pdf"
              />
              {errors.downloadPath && (
                <div className="error-text">{errors.downloadPath}</div>
              )}
            </div>
          </div>

          <div className="certificate-image-upload">
            <div
              className={`certificate-image-preview ${
                errors.image ? "error-border" : ""
              } ${imagePreview ? "has-image" : ""}`}
              onClick={triggerFileInput}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Certificate preview" />
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <p>Click to upload certificate image</p>
                  <span>PNG, JPG or WEBP (Max 5MB)</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
            {errors.image && <div className="error-text">{errors.image}</div>}
          </div>
        </div>

        <div className="certificate-form-actions">
          <button
            type="submit"
            className="certificate-submit-button"
            disabled={loading || isCommitting}
          >
            {loading || isCommitting ? (
              <>
                <div className="spinner"></div>
                <span>{isCommitting ? "Committing..." : "Uploading..."}</span>
              </>
            ) : (
              "Add Certificate"
            )}
          </button>
        </div>

        {/* GitHub commit status message */}
        {(isCommitting || commitStatus) && (
          <div
            className={`commit-status ${
              commitStatus.includes("Error")
                ? "error"
                : commitStatus.includes("success")
                ? "success"
                : "info"
            }`}
          >
            {commitStatus}
            {isCommitting && !commitStatus.includes("success") && (
              <div className="spinner"></div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
