import React, { useState, useRef } from 'react';
import uploadFileIcon from '../graphics/uploadFile Icon.png'; // Import the image

const UploadComponent = ({ onFileChange }) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    onFileChange(selectedFile); // Notify parent component about the file change
  };

  const handleIconClick = () => {
    fileInputRef.current.click(); // Trigger file input when icon is clicked
  };

  return (
    <div className="icon-container">
      <button className="icon-button" onClick={handleIconClick}>
        <img src={uploadFileIcon} alt="Upload File" className="icon" /> {/* Use the imported image */}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }} // Hide the actual file input
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadComponent;
