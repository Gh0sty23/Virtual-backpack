import { useState, useRef, useEffect } from 'react';
import './ID.css';
import Sidebar from '../Sidebar/Sidebar';

interface IDProps {
  // Add any props your component might need
}

const ID: React.FC<IDProps> = () => {
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load image from local storage on component mount
  useEffect(() => {
    const savedImage = localStorage.getItem('ID_IMAGE');
    if (savedImage) {
      setImage(savedImage);
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setImage(imageData);
        // Save to local storage
        localStorage.setItem('ID_IMAGE', imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImage(null);
    // Remove from local storage
    localStorage.removeItem('ID_IMAGE');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
    <Sidebar /> {/* renders the sidebar only for the apps and not the homepage. I cannot be assed to figure out a modular way to conditionally code this shit */}
    <div className="id-container">
      <h2>VIRTUAL ID</h2>
      
      <div className="id-content">
        {image ? (
          <div className="image-preview">
            <img src={image} alt="ID" />
            <button 
              className="material-button remove-button" 
              onClick={removeImage}
            >
              Remove ID
            </button>
          </div>
        ) : (
          <div className="upload-area">
            <p>Upload your ID image</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <button 
              className="material-button" 
              onClick={triggerFileInput}
            >
              Upload ID
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ID;