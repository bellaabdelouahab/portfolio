import { useState, useRef } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase";
import { v4 as uuidv4 } from "uuid";
import "./ReportForm.css";

export default function ReportForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: new Date().toLocaleString(),
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});
  const coverImageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  // GitHub commit related states
  const [commitStatus, setCommitStatus] = useState("");
  const [isCommitting, setIsCommitting] = useState(false);

  // GitHub repo details
  const githubDetails = {
    owner: "bellaabdelouahab",
    repo: "portfolio",
    branch: "master",
    baseImagePath: "public/images/reports/",
    basePdfPath: "public/reports/",
    token: localStorage.getItem("githubToken") || ""
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

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any error
      if (errors.coverImage) {
        setErrors({
          ...errors,
          coverImage: "",
        });
      }
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      setPdfName(file.name);
      
      // If name field is empty, fill it with the PDF name
      if (!formData.name.trim()) {
        setFormData({
          ...formData,
          name: file.name
        });
      }
      
      // Clear any error
      if (errors.pdf) {
        setErrors({
          ...errors,
          pdf: "",
        });
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Report name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!coverImageFile) newErrors.coverImage = "Cover image is required";
    if (!pdfFile) newErrors.pdf = "PDF file is required";
    
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
      
      // Check if file already exists to get its SHA
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
        const token = prompt("Please enter your GitHub token to commit files:");
        if (!token) {
          setMessage({
            type: "error",
            text: "GitHub token is required to commit files.",
          });
          setLoading(false);
          return;
        }
        
        // Save token to localStorage for future use
        localStorage.setItem("githubToken", token);
        githubDetails.token = token;
      }
      
      // Generate a unique ID for the report
      const reportId = uuidv4().replace(/-/g, "").substring(0, 24);
      
      // Set up file paths
      const timestamp = Date.now();
      const imageExtension = coverImageFile.name.split('.').pop();
      const safeFileName = pdfFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const pdfPath = `${githubDetails.basePdfPath}${reportId}_${safeFileName}`;
      const imageName = `${reportId}-cover.${imageExtension}`;
      const imagePath = `${githubDetails.baseImagePath}${imageName}`;
      
      // Start committing to GitHub
      setIsCommitting(true);
      
      // Commit files in sequence
      try {
        // First commit cover image
        setCommitStatus("Committing cover image to GitHub...");
        await commitFileToGithub(
          coverImageFile,
          imagePath,
          `Add report cover image for: ${formData.name}`
        );
        
        // Then commit PDF file
        setCommitStatus("Committing PDF file to GitHub...");
        await commitFileToGithub(
          pdfFile,
          pdfPath,
          `Add report PDF: ${formData.name}`
        );
        
        setCommitStatus("Files successfully committed to GitHub!");
      } catch (error) {
        setCommitStatus(`Error committing files: ${error.message}`);
        throw error;
      }
      
      // Create report document in Firestore
      const reportData = {
        _id: reportId,
        name: formData.name,
        description: formData.description,
        date: formData.date,
        coverImage: `/images/reports/${imageName}`,
        pdfPath: `/reports/${reportId}_${safeFileName}`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, "reports"), reportData);
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        date: new Date().toLocaleString(),
      });
      setPdfFile(null);
      setPdfName("");
      setCoverImageFile(null);
      setCoverImagePreview(null);
      if (coverImageInputRef.current) coverImageInputRef.current.value = "";
      if (pdfInputRef.current) pdfInputRef.current.value = "";
      
      setMessage({
        type: "success",
        text: "Report added successfully!",
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
      console.error("Error adding report:", error);
      setMessage({
        type: "error",
        text: `Error adding report: ${error.message}`,
      });
      setIsCommitting(false);
    } finally {
      setLoading(false);
    }
  };
  
  const triggerCoverImageInput = () => {
    coverImageInputRef.current.click();
  };

  const triggerPdfInput = () => {
    pdfInputRef.current.click();
  };

  return (
    <div className="reports-form-container">
      <div className="report-form-header">
        <h1 className="report-form-title">Add New Report</h1>
        <p className="report-form-subtitle">
          Upload documents, reports, and presentations to showcase your work
        </p>
      </div>

      {message.text && (
        <div className={`report-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="report-form">
        <div className="report-form-grid">
          <div className="report-form-fields">
            <div className="report-form-group">
              <label htmlFor="name">Report Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "error" : ""}
                placeholder="e.g., Business Proposal Q1 2024"
              />
              {errors.name && <div className="error-text">{errors.name}</div>}
            </div>

            <div className="report-form-group">
              <label htmlFor="description">Description*</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? "error" : ""}
                placeholder="Briefly describe what this report contains..."
                rows={4}
              />
              {errors.description && <div className="error-text">{errors.description}</div>}
            </div>

            <div className="report-form-group">
              <label htmlFor="date">Date</label>
              <input
                type="text"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="e.g., 2/27/2025 10:42 AM"
              />
              <small className="form-help-text">Default: current date and time</small>
            </div>
            
            <div className="report-form-group">
              <label>PDF File*</label>
              <div 
                className={`report-pdf-selector ${errors.pdf ? 'error-border' : ''} ${pdfFile ? 'has-file' : ''}`}
                onClick={triggerPdfInput}
              >
                {pdfFile ? (
                  <div className="selected-file">
                    <div className="file-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div className="file-details">
                      <span className="file-name">{pdfName}</span>
                      <span className="file-type">PDF Document</span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder pdf-placeholder">
                    <div className="upload-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <path d="M12 18v-6"></path>
                        <path d="M8 15l4 4 4-4"></path>
                      </svg>
                    </div>
                    <p>Click to upload PDF document</p>
                    <span>PDF files only (Max 20MB)</span>
                  </div>
                )}
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfChange}
                  style={{ display: 'none' }}
                />
              </div>
              {errors.pdf && <div className="error-text">{errors.pdf}</div>}
            </div>
          </div>

          <div className="report-image-upload">
            <label className="cover-image-label">Cover Image*</label>
            <div 
              className={`report-image-preview ${errors.coverImage ? 'error-border' : ''} ${coverImagePreview ? 'has-image' : ''}`}
              onClick={triggerCoverImageInput}
            >
              {coverImagePreview ? (
                <img src={coverImagePreview} alt="Cover preview" />
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <p>Click to upload cover image</p>
                  <span>PNG, JPG or WEBP (Min: 800x600px)</span>
                </div>
              )}
              <input
                ref={coverImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                style={{ display: 'none' }}
              />
            </div>
            {errors.coverImage && <div className="error-text">{errors.coverImage}</div>}
          </div>
        </div>

        <div className="report-form-actions">
          <button 
            type="submit" 
            className="report-submit-button"
            disabled={loading || isCommitting}
          >
            {loading || isCommitting ? (
              <>
                <div className="spinner"></div>
                <span>{isCommitting ? "Committing..." : "Uploading..."}</span>
              </>
            ) : (
              'Add Report'
            )}
          </button>
        </div>
        
        {/* GitHub commit status message */}
        {(isCommitting || commitStatus) && (
          <div className={`commit-status ${
            commitStatus.includes("Error") 
              ? "error" 
              : commitStatus.includes("success") 
                ? "success" 
                : "info"
          }`}>
            {commitStatus}
            {isCommitting && !commitStatus.includes("success") && <div className="spinner"></div>}
          </div>
        )}
      </form>
    </div>
  );
}
